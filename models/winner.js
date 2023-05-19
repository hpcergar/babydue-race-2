'use strict';


//var winner = require('../data/winner.json');


/**
 * Parse results from storage
 */
function getData(){
    var data = winner.winner,
        result = {
            date:'',
            gender:''
        }
        ;
    // Map values if set
    Object.keys(data).forEach(function(date) {
        result['date'] = date;
        result['gender'] = data[date]; 
    });
    
    return result;
}

/**
 * Returns all users
 * @returns {object}
 */
exports.get = function(){
    return getData();
};

/**
 *
 * @returns {object|boolean}
 */
exports.haveWinner = function(){
    // TODO Switch back to enable winner again
    // return '' != getData()['date'];
    return false;
};

exports.getGender = function(){
    return getData()['gender'];
};








