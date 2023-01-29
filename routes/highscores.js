var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    jsonencoded = bodyParser.json(),
    router = express.Router(),
    users = require('../models/users'),
    usersController = require('../controller/users'),
    _ = require('lodash'),
    cryptoService = require('../service/crypto'),
    salt = require('../config/config').saltScore
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
    // Decode score
    let scoreSignature = request.query.score;

    let scoreComputed = cryptoService.crypt(request.body.score.toString(), salt)

    if (scoreComputed !== scoreSignature) {
        let errorMessage = 'Wrong score sent ' + request.body.score
        console.log(errorMessage);
        response
            .status(400)
            .json({ error:  errorMessage});
        return;
    }

    let user = users.getUserByEmail(email)

    user.lastScore = request.body.score;
    user.score = !user.score || user.score < user.lastScore ? user.lastScore : user.score
    user.email = email;



    usersController.save(user, email, scoreSignature, function(error){
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
            .filter(user => user.score !== undefined) // Take those having score
            .map(({ name, score }) => ({ name, score })); // Take only name, email, score
        // Take first 10, sorted by score desc
        let highscores = _.slice(_.orderBy(usersFiltered, ['score'], ['desc']), 0, 10);
        response.json(highscores);
    })
;

router.route('/:email')
    .get(function (request, response) {
        let email = request.query.emailOrig || request.query.email;
        let user = users.getUserByEmail(email)
        response.json(user
            ? { "name" : user.name, "score" : user.score || null}
            : false);
    })
    .put(jsonencoded, function (request, response) {
        handleUpsert(request, response, 400);
    })
;



module.exports = router;