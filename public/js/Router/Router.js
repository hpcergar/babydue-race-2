
/*
 Main controller
 */

define(function(require) {
    'use strict';

    var Backbone = require('backbone'),
        $ = require('jquery'),
        _ = require('underscore'),
        MainView = require('View/MainView'),
        UnauthorizedView = require('View/UnauthorizedView'),
        Auth = require('Security/Auth').default,
        t = require('Lib/Messages').translate
    ;


    var router = Backbone.Router.extend({
        routes: {
            "": "index"
        },

        initialize: function (conf) {
            this.conf = conf;

            // Global object
            window.app = this;

            // Login
            $.ajax({
                url:'/login?email=' + window.app.conf.EMAIL + '&signature=' + window.app.conf.SIGNATURE,
                headers: Auth(),
                success:this.startMainView,
                error:this.startUnauthorizedView
            });
        },

        start: function () {
            Backbone.history.start({pushState: true});
            return this;
        },
        
        startMainView: function(){
            this.mainView = new MainView();
            $('body').append(this.mainView.render().$el);
        },

        startUnauthorizedView: function(){
            this.view = new UnauthorizedView();
            $('body').append(this.view.render().$el);
        },
        
        index: function () {
            document.title = t('title');
        }
    });
    
    return router;
});


