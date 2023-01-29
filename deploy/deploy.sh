#!/bin/sh

sh deploy/build-prod-all.sh

# Go down a folder, TODO To remove if we fill a /dist folder before
cd ..

name=$(date '+%Y%m%d%H%M%S').babydue-race
#name=20180909190723.babydue-race
dirName=dist/${name}
nameZip=$name.tar.gz

echo "Creating babydue-race/${dirName}"
mkdir -p babydue-race/${dirName}

# Copy to dist
echo "Copying node & /public to babydue-race/${dirName}"
rsync -av --progress babydue-race/ babydue-race/${dirName}/ --exclude game --exclude data --exclude dist --exclude .git --exclude deploy/deploy.sh --exclude config --exclude cron

mkdir -p babydue-race/${dirName}/game

echo "Copying game to babydue-race/${dirName}/game"
rsync -av --progress babydue-race/game/build/ babydue-race/${dirName}/game/

cd babydue-race/dist

echo "Tarring ${name} to ${nameZip}"
tar -zcvf "$nameZip" ${name}


# Remote vars
remoteRoot=/var/www/babydue-race
remoteDirVersions=${remoteRoot}/www/versions

# Send by ssh
# TODO Improve paths to avoid hard-coding them
echo "Sending tar by ssh: sshpass -p ${BABYDUE_RACE_PASSWORD} scp -p ${nameZip} ${BABYDUE_RACE_LOGIN}@${BABYDUE_RACE_HOST}:/var/www/babydue-race/www/versions"
sshpass -p ${BABYDUE_RACE_PASSWORD} scp -p ${nameZip} ${BABYDUE_RACE_LOGIN}@${BABYDUE_RACE_HOST}:/var/www/babydue-race/www/versions

echo "Uncompressing"
sshpass -p ${BABYDUE_RACE_PASSWORD} ssh ${BABYDUE_RACE_LOGIN}@${BABYDUE_RACE_HOST} "cd ${remoteDirVersions} && tar -zxvf ${nameZip} ${name} && rm -Rf ${nameZip}"

echo "Running npm install"
sshpass -p ${BABYDUE_RACE_PASSWORD} ssh ${BABYDUE_RACE_LOGIN}@${BABYDUE_RACE_HOST} "cd ${remoteDirVersions}/${name} && sudo npm install"

# Config symlink
echo "Setting up symlinks"
sshpass -p ${BABYDUE_RACE_PASSWORD} ssh ${BABYDUE_RACE_LOGIN}@${BABYDUE_RACE_HOST} "cd ${remoteDirVersions}/${name} && sh deploy/symlinks.sh ${remoteRoot}"
# sshpass -p ${BABYDUE_RACE_PASSWORD} ssh ${BABYDUE_RACE_LOGIN}@${BABYDUE_RACE_HOST} "cd /var/www/babydue-race/www/20180909193327.babydue-race && sh deploy/symlinks.sh"

# latest symlink to
echo "cd ${remoteRoot}/www && ln -sf ${remoteDirVersions}/${name} current"
sshpass -p ${BABYDUE_RACE_PASSWORD} ssh ${BABYDUE_RACE_LOGIN}@${BABYDUE_RACE_HOST} "cd ${remoteRoot}/www && ln -sfn ${remoteDirVersions}/${name} current"


sshpass -p ${BABYDUE_RACE_PASSWORD} ssh ${BABYDUE_RACE_LOGIN}@${BABYDUE_RACE_HOST} "cd ${remoteRoot}/www/current && pm2 restart ecosystem.config.js --env production --update-env"
