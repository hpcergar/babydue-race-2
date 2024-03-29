﻿define(function (require) {
'use strict';

var dicts = {
        fr: require('./I18n/fr'),
        es: require('./I18n/es'),
        en: require('./I18n/en')
    },
    dict;


return {
    translate: translate,
    setDictionary: setDictionary
};


function translate(msg) {
    if (! dict) return msg;
    var translated = dict[msg];
    if (! translated) console.warn('translate: ', msg);
    return translated || msg;
}

function setDictionary(lang) {
    if (! lang || ! dicts[lang]) return;
    dict = dicts[lang];
}


});