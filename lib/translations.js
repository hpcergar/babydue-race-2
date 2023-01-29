'use strict';

var dicts = {
        en: require('./trans/en'),
        fr: require('./trans/fr'),
        es: require('./trans/es')
    },
    dict;


exports.translate = function (msg) {
    if (! dict) return msg;
    var translated = dict[msg];
    if (! translated) console.warn('translate: ', msg);
    return translated || msg;
};

exports.setDictionary = function (lang) {

    if (! lang || ! dicts[lang]) return;
    dict = dicts[lang];
};

