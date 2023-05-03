# Babydue race 2

# TODO
Our charming girl wants to meet her forthcoming brother or sister, help her find the way to the hospital!
And then, will it be a boy? A girl? Or... a wolf? You can also have fun betting date and gender on our calendar!
 
This is a web application featuring a 2D endless runner game and a baby due bet calendar. 

Had lots of fun doing it :)

# Code structure
* /game: Phaser.js game
* /public: Backbone.js Bet calendar
* / (root): Backend nodejs/express API server

## 2D Platform game
Featuring our brave girl running her wagon, trying to reach the hospital as fast as possible!

An endless runner 2D platform game made with HTML5 game framework [Phaser](https://phaser.io/). 
It is tile-based and mixing commercial and home-made assets, and it is playable on mobile or desktop.
Controls are very easy, since you can click/touch menu options and the main character only needs to 
jump. Basically any click/tap/main keyboard key (space bar, enter key...) will do.

## Bet calendar
Once you finish your game, time to bet for the baby due date & gender!
A calendar made in backbone.js allowing to vote a pair of date/gender.
Only one person can vote for a specific pair of day/gender, 
ie. for the same day there cannot be two people betting on boy 


## Backend API server
Made in nodejs/express. It handles data models such as users, bets, highscores and a few more. It is consumed
by both 2d game and bet calendar.

There is middleware to ensure that our API responds only to a valid key of email/signature.
So email and signature MUST always be sent in GET along with the other parameters.


# How to dev

## Install
```game``` folder is independent from the ```/``` (root) & ```public``` folders.
This means it has its own webpack and dev flow. Here I will be describing how I work with them.  

* For starters, a classic, install dependencies for both:

```bash
$ npm install && cd game/ && npm install
```

* Copy ```config/sandbox/config.js``` file to  with ```config/config.js```. Modify it by inserting your own `salt` and `saltTime`. 
* Create ```data/users.json``` file with ```data/users.example.json``` if it does not exist
* Same goes for ```data/bets.json```
* In ```data/users.json```, you can pick one of the example emails of add your own.
We will be using ```obiwan.kenobi@tatooine.com``` for this tutorial
* Generate email signature with ```node cron/getSignature.js obiwan.kenobi@tatooine.com``` and save it for later.


## Build (dev):
```bash
$ npm run build-dev-all
```

## Run
Application will be served on port 3000 after launching the following command 
```bash
$ node app
```

You can reach the site with a secured url:

http://localhost:3000/?email=[user email]&signature=[email signature] 

That should do it :)


## Build (production)
Well, once you are ready for production, let's generate the optimized dist.

There is a single command that build for production & also sends to a remote server.
```bash
$ npm run deploy
```

Aforehand you should have defined the following env variables:
```bash
BABYDUE_RACE_HOST=Your server host to ssh to it
BABYDUE_RACE_LOGIN=Server ssh login
BABYDUE_RACE_PASSWORD=Server ssh password
```
Don't forget to change server path in file to suit your needs.

After ssh to it, this scripts is going to send a tar.gz, untar it,
and execute some commands on the remote server to prepare data, config & logs.

## Tests (WIP)
```bash
$ npm test
```



# Annex: API Resources

## /bets
### GET /bets/
Retrieve a map date/bets of the current placed bets

### POST /bets/
Place a bet, if no other bet is in the way
Params:
- email (aaa@bbb.com)
- date (2016-01-01)
- gender ("m", "f", "d" -> as male, female or dragon ;))

### PUT /bets/:email
Update bet with same restrictions as POST
Params:
- email (aaa@bbb.com)
- date (2016-01-01)
- gender ("m", "f", "d" -> as male, female or dragon ;))

## /highscores
### GET /highscores/
Retrieve a list of top 10 best times, with emails

### GET /highscores/:email
Retrieve best time for given email

### PUT /highscores/:email
Update user's best time with given parameter (only if better than current)
Params:
- email (aaa@bbb.com)
- time (100)
- scoreSignature


## /login
### GET /login/
Validate current user's credentials


## /users
### GET /users/
Retrieve a list of users data models indexed by email 
with name, language, lastTime, (best) time.

### GET /users/:email
Retrieve user data model for a single email

## /winner
### GET /winner/
[WIP] Retrieve a winner of the bet calendar

