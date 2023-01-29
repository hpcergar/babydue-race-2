'use strict';
import config from '../config'

export default class {
    constructor(game) {
        // create map layers
        this.groups = {};
        config.groups.forEach(group => {
            this.groups[group] = game.add.group();
        });
    }

    addToGroup(group, entity) {
        this.groups[group].add(entity);
    }

    getGroups(){
        return this.groups;
    }
}