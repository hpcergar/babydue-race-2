#!/bin/sh

baseDir=babydue-race-2
if [ -z "$1" ]
  then
    name=$(date '+%Y%m%d%H%M%S').${baseDir}
  else
    name=$1
fi

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
    rsync -av --progress ${baseDir}/ ${baseDir}/${dirName}/ --exclude ./game --exclude ./data --exclude ./dist --exclude .git --exclude deploy/deploy.sh --exclude config/config.js --exclude ./cron

    mkdir -p ${baseDir}/${dirName}/game

    echo "Copying game to ${baseDir}/${dirName}/game"
    rsync -av --progress ${baseDir}/game/build/ ${baseDir}/${dirName}/game/

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
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "
  echo 'Setting up symlinks'
  cd ${remoteDirVersions}/${name} && sh deploy/symlinks.sh ${remoteRoot}
  echo 'Changing owner'
  chown nodejs -R ${remoteDirVersions}/${name}
  echo 'Updating latest current symlink'
  cd ${remoteRoot}/www && ln -sfn ${remoteDirVersions}/${name} current
  echo 'Restarting app'
  cd ${remoteRoot}/www/current && runuser -l nodejs -c 'pm2 restart ${remoteRoot}/www/current/ecosystem.config.js --env production --update-env && pm2 save'
"
