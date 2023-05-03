var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    jsonencoded = bodyParser.json(),
    router = express.Router(),
    users = require('../models/users'),
    usersController = require('../controller/users'),
    _ = require('lodash'),
    cryptoService = require('../service/crypto'),
    salt = require('../config/config').saltTime
    ;

/**
 * Handle insertion/update
 *
 * @param request
 * @param response
 * @param errorCode
 */
function handleUpsert(request, response, errorCode){

    let email = request.query.emailOrig || request.query.email;
    // Decode time
    let actualTimeSignature = request.query.time;
    let expectedTimeSignature = cryptoService.crypt(request.body.time.toString(), salt)

    if (expectedTimeSignature !== actualTimeSignature) {
        let errorMessage = 'Wrong time sent ' + request.body.time
        console.log(errorMessage);
        response
            .status(400)
            .json({ error:  errorMessage});
        return;
    }

    let user = users.getUserByEmail(email)
    user.lastTime = request.body.time;
    user.time = !user.time || user.time > user.lastTime ? user.lastTime : user.time
    user.email = email;

    usersController.save(user, email, function(error){
        if(error){
            console.log(error.message);
            response
                .status(errorCode)
                .json({ error: error.message });
            return;
        }

        response
            .status(201)
            .json(request.body);
    });
}

router.route('/')
    .get(function (request, response) {
        // Get an array
        let usersFiltered = _(users.getAll()) //wrap object so that you can chain lodash methods
            .mapValues((value, email)=>_.merge({}, value, {email})) //attach id to object
            .values() //get the values of the result
            .value();

        usersFiltered = usersFiltered
            .filter(user => user.time !== undefined && user.time > 0) // Take those having time
            .map(({ name, time }) => ({ name, time })); // Take only name, time
        // Take first 10, sorted by time asc
        let top10 = _.slice(_.orderBy(usersFiltered, ['time'], ['asc']), 0, 10);
        response.json(top10);
    })
;

router.route('/:email')
    .get(function (request, response) {
        let email = request.query.emailOrig || request.query.email;
        let user = users.getUserByEmail(email)
        response.json(user
            ? { "name" : user.name, "time" : user.time || null}
            : false);
    })
    .put(jsonencoded, function (request, response) {
        handleUpsert(request, response, 400);
    })
;

module.exports = router;