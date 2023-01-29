'use strict';

// TODO to config
var cryptoService = require('../service/crypto'),
    salt = require('../config/config').salt || '2D23PsgZdDLMu225'

    ;

/**
 *
 * @param email
 * @returns {*|{}}
 */
var getSignature = function(email){
    return cryptoService.crypt(email, salt)
};

/**
 * Validate request after verifying email and signature do match
 *
 * @param email
 * @param signature
 */
var validate = function(email, signature){
    console.log('Signature should be ' + getSignature(email))
    return (signature === getSignature(email));
};


/**
 * Exposed methods
 *
 * @type {{validate: validate, getSignature: getSignature}}
 */
module.exports = {
    validate: validate,
    getSignature: getSignature
};