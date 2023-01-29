var express = require('express'),
    security = require('./routes/security'),
    login = require('./routes/login'),
    bets = require('./routes/bets'),
    users = require('./routes/users'), 
    highscores = require('./routes/highscores'),
    winner = require('./routes/winner')
    ;

var Main = function(){

    var self = this;

    self.setupVariables = function(){
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

        console.log('Port ' + self.port);
        console.log('Port openshift ' + process.env.OPENSHIFT_NODEJS_PORT);
        console.log('IP ' + self.ipaddress);

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 0.0.0.0');
            self.ipaddress = "0.0.0.0";
        }
    };

    self.initializeServer = function(){
        self.app = express();
        self.createRoutes();
    };

    self.createRoutes = function(){
        self.app.use('/calendar', express.static('public'));
        // self.app.use('/calendar/js', express.static('public/js'));
        self.app.use('/', express.static('game/build'));
        self.app.use('/calendar/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
        self.app.use('/calendar/jquery-ui', express.static(__dirname + '/public/css/jquery-ui/minified'));
        self.app.use('/calendar/remodal', express.static(__dirname + '/node_modules/remodal/dist'));

        // Add security layer
        // TODO switch back
        // self.app.use('/winner', security);
        self.app.use('/winner', winner);
        
        // Add security layer
        self.app.use('/users', security);
        self.app.use('/users', users);
        
        self.app.use('/bets', security);
        self.app.use('/bets', bets);

        self.app.use('/login', security);
        self.app.use('/login', login);

        self.app.use('/highscores', security);
        self.app.use('/highscores', highscores);
    };

    self.start = function(){
        self.setupVariables();
        self.initializeServer();

        self.app.listen(self.port, self.ipaddress, function(){
            console.log('Started app on port ' + self.port);
        });
    }
};



var App = new Main();
App.start();
module.exports=App;