#!/bin/sh

baseDir=babydue-race-2
if [ -z "$1" ]
  then
    name=$(date '+%Y%m%d%H%M%S').${baseDir}
  else
    name=$1
fi

# Test connection
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "echo 'Connection successful'"

dirName=dist/${name}
nameZip=$name.tar.gz

if [ ! -f $nameZip ]
  then
    sh deploy/build-prod-all.sh

    # Go down a folder
    cd ..
    echo "Creating ${baseDir}/${dirName}"
    mkdir -p ${baseDir}/${dirName}

    # Copy to dist
    echo "Copying node & /public to ${baseDir}/${dirName}"
    rsync -av --progress ${baseDir}/ ${baseDir}/${dirName}/ --exclude game --exclude node_modules --exclude .idea --exclude data --exclude dist --exclude .git --exclude deploy/deploy.sh --exclude config/config.js

    mkdir -p ${baseDir}/${dirName}/game

    echo "Copying game to ${baseDir}/${dirName}/game"
    rsync -av --progress ${baseDir}/game/build/ ${baseDir}/${dirName}/game/build

    cd ${baseDir}/dist

    echo "Tarring ${name} to ${nameZip}"
    tar -zcvf "$nameZip" ${name}
  else
    cd dist
fi

# Remote vars
remoteRoot=/var/www/${baseDir}
remoteDirVersions=${remoteRoot}/www/versions

# Send by ssh
# Setup a ssh-agent so it doesn't request SSH key password for each command
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "mkdir -p ${remoteDirVersions}"

echo "Sending tar by ssh: scp -p ${nameZip} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST}:${remoteDirVersions}"
scp -i ${BABYDUE_RACE_2_SSH_KEY} -p ${nameZip} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST}:${remoteDirVersions}

echo "Uncompressing"
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "cd ${remoteDirVersions} && tar -zxvf ${nameZip} ${name} && rm -Rf ${nameZip}"

# Several tasks at once. Did in one command to overcome the SSH 6 user rate limit
# You could check that limit by using:
#   $ iptables -nL|grep "22\|ssh"
# We install dependencies in this step, because we excluded in the rsync. It was too slow in WSL2 (my current dev platform)
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "
  echo 'Changing owner'
  chown nodejs -R ${remoteDirVersions}/${name}
  echo 'Installing dependencies'
  runuser -l nodejs -c 'cd ${remoteDirVersions}/${name} && pm2 stop babydue-race-2 && npm install'
  echo 'Initializing data folders'
  mkdir -p ${remoteDirVersions}/data/backup
  chown nodejs -R ${remoteDirVersions}/data
  echo 'Setting up symlinks'
  cd ${remoteDirVersions}/${name} && sh deploy/symlinks.sh ${remoteRoot}
  echo 'Updating latest current symlink'
  cd ${remoteRoot}/www && ln -sfn ${remoteDirVersions}/${name} current
  echo 'Restarting app'
  cd ${remoteRoot}/www/current && runuser -l nodejs -c 'pm2 restart ${remoteRoot}/www/current/ecosystem.config.js --env production --update-env && pm2 save'
"
