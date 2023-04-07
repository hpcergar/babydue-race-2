const GRAVITY = 1000
export class Character {
    sprite;
    game;
    debug;

    constructor (game, debug = false) {
        // Starts
        this.game = game
        // STATES
        this.debug = debug
    }

    enablePhysics() {
        this.sprite.body.collideWorldBounds = true
        this.sprite.body.gravity.y = GRAVITY
        // Enable slopes collision on this player
        this.game.slopes.enable(this.sprite)
        this.sprite.body.slopes.preferY = true
        this.sprite.slopeId = false
        this.sprite.body.slopes.pullDown = GRAVITY / 2
    }

    getSprite () {
        return this.sprite
    }

    setActive () {
        this.sprite.visible = true
        this.sprite.body.moves = true
        this.sprite.body.static = false
    }

    setInactive () {
        this.sprite.body.moves = false
        this.sprite.body.static = true
        this.sprite.visible = false
        if( this.debug ) console.log(`Disabling ` + this.constructor["name"])
    }
}