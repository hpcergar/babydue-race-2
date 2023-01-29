define(function (require) {
    'use strict';

    var _ = require('underscore'),
        $ = require('jquery'),
        Backbone = require('backbone'),
        t = require('Lib/Messages').translate,
        template = require('./Templates/Winner.hbs')
        ;

    // TODO
    return Backbone.View.extend({

        id: 'winner',

        className:'row',

        template: template,

        render: function () {

            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }

    });
});
