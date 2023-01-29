/**
 * Handlebars Helper loaded by webpack's handlebars loader
 * registering this file's name as the helper name ("is" here)
 */

// Exports as "is" helper
module.exports = function(value, test, options){
    if(value && value == test){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
};
