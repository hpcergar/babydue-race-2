'use strict';

let crypto = require('crypto')

exports.crypt = function(text, salt){
    let hash = crypto
        .createHmac('sha256', salt)
        .update(text)
        .digest('hex');

    console.log('Hash for ' + text + ' should be ' + hash + ' with salt ' + salt);
    return hash;
}