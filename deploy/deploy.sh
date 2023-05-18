#!/bin/sh

sh deploy/build-prod-all.sh

# Go down a folder, TODO To remove if we fill a /dist folder before
cd ..

baseDir=babydue-race-2
name=$(date '+%Y%m%d%H%M%S').${baseDir}
dirName=dist/${name}
nameZip=$name.tar.gz

echo "Creating ${baseDir}/${dirName}"
mkdir -p ${baseDir}/${dirName}

# Copy to dist
echo "Copying node & /public to ${baseDir}/${dirName}"
rsync -av --progress ${baseDir}/ ${baseDir}/${dirName}/ --exclude game --exclude data --exclude dist --exclude .git --exclude deploy/deploy.sh --exclude config --exclude cron

mkdir -p ${baseDir}/${dirName}/game

echo "Copying game to ${baseDir}/${dirName}/game"
rsync -av --progress ${baseDir}/game/build/ ${baseDir}/${dirName}/game/

cd ${baseDir}/dist

echo "Tarring ${name} to ${nameZip}"
tar -zcvf "$nameZip" ${name}


# Remote vars
remoteRoot=/var/www/${baseDir}
remoteDirVersions=${remoteRoot}/www/versions

# Send by ssh
# Setup a ssh-agent so it doesn't request SSH key password for each command
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "mkdir -p ${remoteDirVersions}"

echo "Sending tar by ssh: sshpass -p ${BABYDUE_RACE_2_PASSWORD} scp -p ${nameZip} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST}:${remoteDirVersions}"
scp -i ${BABYDUE_RACE_2_SSH_KEY} -p ${nameZip} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST}:${remoteDirVersions}

echo "Uncompressing"
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "cd ${remoteDirVersions} && tar -zxvf ${nameZip} ${name} && rm -Rf ${nameZip}"

echo "Running npm install"
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "cd ${remoteDirVersions}/${name} && sudo npm install"

# Config symlink
echo "Setting up symlinks"
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "cd ${remoteDirVersions}/${name} && sh deploy/symlinks.sh ${remoteRoot}"

echo "Changing owner"
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "chown nodejs -R ${remoteDirVersions}/${name}"

# latest symlink to
echo "cd ${remoteRoot}/www && ln -sf ${remoteDirVersions}/${name} current"
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "cd ${remoteRoot}/www && ln -sfn ${remoteDirVersions}/${name} current"

# TODO Restart as nodejs user
ssh -i ${BABYDUE_RACE_2_SSH_KEY} ${BABYDUE_RACE_2_LOGIN}@${BABYDUE_RACE_2_HOST} "cd ${remoteRoot}/www/current && pm2 restart ecosystem.config.js --env production --update-env"
