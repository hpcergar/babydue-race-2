var express = require('express'),
    app = express(),
    router = express.Router(),
    users = require('../models/users')
    ;



router.route('/')
    .get(function (request, response) {
        response.json(users.getAll());
    })
;

router.route('/:email')
    .get(function (request, response) {
        let email = request.query.emailOrig || request.query.email;
        let user = users.getUserByEmail(email);
        console.log(email)
        console.log(user)
        response.json(user ? user : false);
    })
;



module.exports = router;