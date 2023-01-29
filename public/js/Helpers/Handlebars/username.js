/**
 * Handlebars Helper loaded by webpack's handlebars loader
 * registering this file's name as the helper name
 */

// Exports as "username" helper
module.exports = function(email, users){
    return users.findUserNameByEmail(email);
};
