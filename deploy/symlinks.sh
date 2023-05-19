#!/bin/sh

if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    exit 1
fi

if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit 1
fi

# CWD/versions/www
dataDir=$1/data

echo "dataDir is ${dataDir}"

echo "Adding symlinks to json data";
mkdir -p ${dataDir}
mkdir -p data
ln -sf ${dataDir}/bets.json ./data/bets.json
ln -sf ${dataDir}/users.json ./data/users.json
ln -sf ${dataDir}/winner.json ./data/winner.json
ln -sf ${dataDir}/log ./data/log

echo "Adding symlinks to config files";
mkdir -p config
ln -sf ${dataDir}/config.js ./config/config.js


