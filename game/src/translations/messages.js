'use strict';

import fr from './I18n/fr';
import es from './I18n/es';

let dicts = {
        fr: fr,
        es: es
    };

/**
 * Translation class
 */
export default class {

    constructor(lang) {
        if (! lang || ! dicts[lang]) console.error('Invalid or undefined language: ' + lang)
        this.dict = dicts[lang];
    }

    translate(msg) {
        if (! this.dict) return msg;
        let translated = this.dict[msg];
        if (! translated) console.warn('translate: ', msg);
        return translated || msg;
    }
}


