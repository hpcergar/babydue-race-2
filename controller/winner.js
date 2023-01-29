'use strict';

var model = require('../models/winner'),
    users = require('../models/users'),
    bets = require('../models/bets')
    ;


/**
 * Set positions order by given bets replacing email by username
 * @param data
 * @returns {{}}
 */
function mapPositions(data){
    var map = {
        '1st':{},
        '2nd':{},
        '3rd':{}
    },
        position;

    // Loop over possible genders
    for (var gender in data) {
        if (data.hasOwnProperty(gender)){
            if(gender == model.getGender()){
                position = '1st';
            }else if(gender == 'd'){
                // Dragon always 2nd
                position = '2nd'
            }else{
                position = '3rd'
            }
            
            // Set a list of emails-based key with selected date and gender
            map[position] = {name: users.getUserByEmail(data[gender]), gender : gender};
        }
    }

    return map;
}


/**
 * Get winners with names 
 * @param callback
 */
exports.get = function (callback) {
    // Get bets by date
    var winner = model.get();

    bets.findByDate(winner['date'], function(err, data){

        if(err){
            callback(err);
            return;
        }

        // Get date, gender, positions, user names
        callback(null, {
            date: winner['date'] || '',
            gender: winner['gender']  || '',
            // For each bet, find user name and set position
            positions:mapPositions(data)
        });

    });
};

/**
 *
 * @param params
 * @param emailOrig
 * @param callback
 */
exports.save = function (params, emailOrig, callback) {

    // TODO 
    
    return;
    
    
    
    
    var date = params.date,
        email = params.email,
        gender = params.gender
        ;

    // Data validation
    if(!params.date || !moment(date).isValid()){callback(new Error('Invalid date'), null);return;}
    if(!params.email || !validator.isEmail(email)){callback(new Error('Invalid email'), null);return;}
    if(email != emailOrig){callback(new Error('Sent email ' + email + ' is not the same as authenticated one ' + emailOrig), null);return;}
    if(!params.gender || !model.isValidGender(gender)){callback(new Error('Invalid gender'), null);return;}

    // Winner check
    if(winner.haveWinner()){callback(new Error('Bets disabled: we already got a winner!'), null);return;}


    // Check availability of date
    model.isBetAvailable(params, function(err){
        /* params format: {
                "date" : "2016-01-01",
                "email" : "aaa@bbb.com",
                "gender" : "m", // m, f, d (dragon)
                }
                */
        if(err){
            callback(new Error('Date unavailable'), null);
            return;
        }

        // Save bet by email
        model.save({
            "date":date,
            "email":email,
            "gender":gender
        }, callback);
    });
};


