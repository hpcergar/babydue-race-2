'use strict';

var model = require('../models/users'),
    winner = require('../models/winner'),
    validator = require('validator')
    ;

/**
 *
 * @param params
 * @param emailOrig
 * @param callback
 */
exports.save = function (params, emailOrig, callback)
{
    let email = params.email;

    // Data validation
    if (!params.email || !validator.isEmail(email)) {
        callback(new Error('Invalid email'), null);
        return;
    }
    if (email !== emailOrig) {
        callback(new Error('Sent email ' + email + ' is not the same as authenticated one ' + emailOrig), null);
        return;
    }

    // Winner check
    if (winner.haveWinner()) {
        callback(new Error('Bets disabled: we already got a winner!'), null);
        return;
    }

    // Save user by email
    model.save(params, callback);
};


