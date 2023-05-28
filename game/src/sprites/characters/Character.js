const GRAVITY = 1000
export class Character {
    sprite;
    game;
    debug;
    secondaryCharacterLastSpeed = null;


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
        // TODO cleanup
        // this.sprite.visible = true
        // this.sprite.body.moves = true
        // this.sprite.body.static = false
        this.sprite.tint = 0xffffff
    }

    setInactive () {
        // TODO cleanup
        // this.sprite.body.moves = false
        // this.sprite.body.static = true
        // this.sprite.visible = false
        this.sprite.tint = 0x85a7d6

        this.secondaryCharacterLastSpeed = null
    }

    isHittingGround (hitting) {
        return hitting && this.getSprite().body.touching.down
    }

    updateAsSecondary(primaryCharacter, offset) {
        if ( this.secondaryCharacterLastSpeed === null ) {
            this.sprite.body.velocity.x = this.secondaryCharacterLastSpeed = primaryCharacter.sprite.body.velocity.x
        }

        if (primaryCharacter.sprite.body.velocity.x !== this.sprite.body.velocity.x
            || primaryCharacter.sprite.body.velocity.y !== this.sprite.body.velocity.y) {
            this.sprite.body.velocity.x = primaryCharacter.sprite.body.velocity.x
            this.sprite.body.velocity.y = primaryCharacter.sprite.body.velocity.y
        }

        if (this.sprite.position.x > primaryCharacter.sprite.position.x - offset) {
            this.sprite.position.x = primaryCharacter.sprite.position.x - offset
        }

        if( this.sprite.animations.name !== primaryCharacter.sprite.animations.name ) {
            this.sprite.animations.play(primaryCharacter.sprite.animations.name)
        }
    }
}