var express = require('express'),
    app = express(),
    router = express.Router(),
    winner = require('../controller/winner')
    ;



router.route('/')
    .get(function (request, response) {
        winner.get(function(error, winners){
            if(error){
                response
                    .status(404)
                    .json({ error: error.message });
                return;
            }
            response.json( winners );
        });
    })
;



module.exports = router;