'use strict';

var path = require('path'),
    file = path.join(__dirname, '..', 'data', 'users.json'),
    dataCached,
    _ = require('lodash'),
    logger = require('../service/logger').logger(),
    users = require('../data/users.json'),
    storageAdapter = require('../storage/adapter')
;


/**
 * Get data from cache of file
 *
 * @storage
 *
 * @param callback
 */
function getData(callback){
    if(dataCached){
        callback(null, dataCached);
        return;
    }

    // getDataFromFile(callback);

    storageAdapter.fetch(file, function(err, data){
        dataCached = JSON.parse(data);
        console.log('Data retrieved from file');

        callback(null, dataCached);
    });
}


/**
 * Save to cached buffer data
 * @param data
 */
function saveUser(data){
    let users = dataCached;

    if(!_.has(users, data.email)){
        throw new Error('Email not found:  ' + data.email)
    }

    users[data.email] = _.omit(data, ['email']);

    // Log
    let name = (users[data.email] ? users[data.email]["name"] : data.email);
    logger.info(name + ' saved with data ' + JSON.stringify(data) + '');

    dataCached = users;

    console.log('User cached in data');
}

/**
 * Returns all users
 * @returns {object}
 */
exports.getAll = function(){
    return users;
};

/**
 *
 * @param email
 * @returns {object|boolean}
 */
exports.getUserByEmail = function(email){
    if(users[email]){
        console.log('Name ' + users[email]['name'] + ' found for email ' + email);
        return users[email];
    }

    console.log('Email not found ' + users[email]);

    return false;
};

/**
 * Validates given email is valid user
 * @param email
 * @returns {boolean}
 */
exports.isValidUser = function(email){
    return (false !== this.getUserByEmail(email));
};

/**
 * Validates user has already player at least once
 * @param email
 * @returns {boolean}
 */
exports.hasAlreadyPlayed = function(email){
    let user = this.getUserByEmail(email)
    return (false !== user && user.time);
};


/**
 * Filter users by level
 * 
 * @param level
 * @returns {{}}
 */
exports.getUsersByLevel = function(level){
    let result = {};

    Object.keys(users).forEach(function(key){
        if(users[key]['level'] && level === users[key]['level']){
            result[key] = users[key]; 
        }
    });
    
    return result;
};

exports.save = function(data, callback){
    // Retrieve data from storage
    getData(function(err){
        if(err){
            callback(err);
            return;
        }
        // save to JSON cached and save to storage
        saveUser(data);
        storageAdapter.flush(file, dataCached, callback);
    })
};








