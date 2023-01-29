/**
 * Retrieve signature from email
 *
 */


var security = require('../controller/security');

let args = process.argv;

if(args.length < 3) {
    console.error('Missing email argument. Usage:' + "\n" +'$ node getSignature myEmail@dot.com');
    return;
}

let email = args[2];

console.log('Signature for email ' + email + ' is: ' + security.getSignature(email));
