var _ = require('underscore'),
    security = require('../controller/security'),
    users = require('../data/users.json'),
    t = require('../lib/translations'),
    config = require('../config/production/config'),
    nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport(config.email.server),
    mailOptions = {
        from: config.email.sender,
        bcc: config.email.sender,
    },
    url = 'http://babydue-race.netake.com:3000/?email=:email&signature=:signature',
    signature,
    urlSend,
    
    filterLevel = 7
;


// Foreach user with level
_.each(users, function(user, key) {

    if(user['level'] == filterLevel){
        user['email'] = key;

        console.log('Starting with user ' + key);
        console.log(' -> with language ' + user['lg']);


        var waitTill = new Date(new Date().getTime() + 2 * 1000);
        while(waitTill > new Date()){}

        // Set language by user
        t.setDictionary(user['lg']);

        // Generate signature
        signature = security.getSignature(user['email']);
        console.log(' -> with signature ' + signature);

        urlSend = url.replace(':email', user['email']).replace(':signature', signature);
        // Send email with body
        mailOptions['to'] = user['email'];
        mailOptions['subject'] = t.translate('Email subject');
        mailOptions['html'] = t.translate('Email text')
            + '<br/><br/><a href="' + urlSend + '">' + urlSend + '</a><br/><br/>'
            + t.translate('Email signature');

        console.log(' -> with email subject ' + mailOptions['subject']);
        console.log(' -> with email content ' + mailOptions['html']);

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });


    }
});



console.log('Invitations sent');

