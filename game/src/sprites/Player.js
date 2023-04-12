import Input from '../services/Input'
import Points from '../services/Points'
import Constants from '../constants'
import {Aria} from './characters/Aria'
import {Julen} from './characters/Julen'


export default class {
    /**
     * @type Character
     */
    player;
    constructor(game, debug = false) {
        // Starts
        this.game = game

        // STATES
        this.isPlayable = false
        this.isInputCoolingDown = false
        this.debug = debug

        this.input = new Input(game, debug)
        this.points = new Points(game)

        // Game key points
        const [startX, startY] = this.debug ? this.points.getDebugPoint() : this.points.getStartPoint()
        console.log(startX)
        const [endX] = this.points.getEndPoint()
        const [speedUpX] = this.points.getSpeedUpPoint()

        this.endX = endX
        this.speedUpX = speedUpX

        // Add the sprite to the game and enable arcade physics on it
        this.loadCharacters(game, debug, startX, startY)
        this.enableCharacter(Constants.characters.CHARACTER_JULEN)

        // PHYSICS
        this.velocity = Constants.mechanics.GAME_VELOCITY
        this.speedUp = false
        // Start stopped
        this.getSprite().body.velocity.x = 0

        // this.game.debug.bodyInfo(this.getSprite(), 32, 32);
        // this.game.debug.body(this.getSprite());
        // this.game.debug.reset();

        // ANIMATIONS
        this.getSprite().animations.play(Constants.animations.ANIMATION_STANDING)
        this.lookingRight = true

        // CONTROLS
        this.cursors = this.game.input.keyboard.createCursorKeys()
    }

    loadCharacters(game, debug, startX, startY) {
        this.characters = {}
        let julen = new Julen(game, debug, startX, startY)
        let aria = new Aria(game, debug, startX, startY)
        this.characters[Constants.characters.CHARACTER_JULEN] = julen
        this.characters[Constants.characters.CHARACTER_ARIA] = aria
        aria.setInactive()
    }

    enableCharacter(characterIndex, previousCharacter) {
        this.currentCharacter = characterIndex

        /** @type Aria|Julen **/
        let character = (this.characters[characterIndex])
        if (this.debug) console.log(`Enabling ${characterIndex}`)

        if (previousCharacter !== undefined) {
            this.copyCharacterProperties(previousCharacter, character)
        }
        character.setActive();
        this.player = character

        this.getSprite().animations.play(Constants.animations.ANIMATION_STANDING)
        // Make the camera follow the sprite
        this.game.camera.follow(this.getSprite())
    }

    copyCharacterProperties(from, to) {
        to.sprite.position = Object.assign({}, from.sprite.position)
        to.sprite.slopeId = from.sprite.slopeId
        to.sprite.angle = from.sprite.angle
        to.sprite.body.velocity.x = from.sprite.body.velocity.x
        to.sprite.body.velocity.y = from.sprite.body.velocity.y
        to.sprite.scale.x = from.sprite.scale.x
    }

    disableCharacter(character) {
        if (character !== undefined) {
            character.setInactive()
        }
    }

    switchCharacters() {
        let characterKeys = Object.keys(this.characters)
        characterKeys.some((characterKey) => {
            if (characterKey !== this.currentCharacter) {
                let previousPlayer = this.player
                this.enableCharacter(characterKey, previousPlayer)
                this.disableCharacter(previousPlayer)
                return true
            }
            return false
        })
    }

    getSprite() {
        return this.player.getSprite()
    }

    update(hitting) {
        if (this.isPlayable) {
            this.updatePlaying(hitting)
        }
    }

    updatePlaying(hitting) {
        // this.game.debug.bodyInfo(this.getSprite(), 32, 32);
        // this.game.debug.body(this.getSprite());
        // this.game.debug.reset();

        // Speed up if beyond point
        if (this.speedUp === false && this.isBeyondSpeedUpPoint()) {
            this.speedUp = true
            this.velocity = 1.5 * Constants.mechanics.GAME_VELOCITY
        }

        let wasStanding = this.getSprite().body.velocity.x === 0
        let isHittingGround = this.player.isHittingGround(hitting)

        // For debug
        // if (this.debug) {
        //     this.getSprite().body.velocity.x = 0
        // }



        // Disable last jump bug on slopes
        if (hitting && this.getSprite().slopeId) {
            // Only on ascending, to avoid jumping on descending
            this.getSprite().body.velocity.y = this.getSprite().body.velocity.y >= 0
                ? this.getSprite().body.velocity.y
                : 0
        }

        // Rotation, acceleration, etc.
        this.adaptOnSlope(this.getSprite().slopeId)

        let slopeUpFactor = this.slopeUpFactor(this.getSprite().slopeId, this.getSprite().body.velocity.y)
        if (this.isPlayable /*&& this.debug === false*/) {
            this.getSprite().body.velocity.x = this.velocity - slopeUpFactor
        }

        // If on the ground, allow jump or mechanic: jump
        if (isHittingGround) {
            if (this.isInputPressed()) {
                this.switchCharacters()
            }
            this.player.update(this.getGameStateForPlayer())

            /*
                if (this.debug && this.input.isSpacebarDown()) {
                    // Jump
                    let velocityY = Constants.mechanics.JUMP
                    if (this.inclination === Constants.slopes.SLOPE_ASCENDING) {
                        velocityY = Constants.mechanics.JUMP - 100
                    } else if (this.inclination === Constants.slopes.SLOPE_DESCENDING) {
                        velocityY = Constants.mechanics.JUMP + 550
                    }
                    this.getSprite().body.velocity.y = velocityY
                }
            */
        }


        // Manual debug
        // if (this.cursors.left.isDown && this.debug) {
        //     if (this.lookingRight) {
        //         this.getSprite().scale.x *= -1
        //         this.lookingRight = false
        //     }
        //     this.getSprite().body.velocity.x = -this.velocity + slopeUpFactor
        // } else if (this.cursors.right.isDown && this.debug) {
        //     if (!this.lookingRight) {
        //         this.getSprite().scale.x *= -1
        //         this.lookingRight = true
        //     }
        //     this.getSprite().body.velocity.x = this.velocity - slopeUpFactor
        // }

        // Animations
        if (wasStanding && this.getSprite().body.velocity.x !== 0) {
            this.getSprite().animations.play(Constants.animations.ANIMATION_RUNNING)
        } else if (!wasStanding && this.getSprite().body.velocity.x === 0) {
            this.getSprite().animations.play(Constants.animations.ANIMATION_STANDING)
        }
    }

    getGameStateForPlayer() {
        return {
            velocity: this.velocity
        }
    }

    isInputPressed() {
        if (!this.isInputCoolingDown && this.input.isDown()) {
            this.isInputCoolingDown = true
            setTimeout(() => {
                this.isInputCoolingDown = false
            }, Constants.mechanics.INPUT_COOLDOWN)
            return true
        }
        return false;
    }

    run() {
        this.isPlayable = true
        this.getSprite().body.velocity.x = this.velocity
    }

    setCollisionData(ground) {
        if (ground.slope && ground.slope.type > 0) {
            this.getSprite().slopeId = ground.slope.type
        } else {
            this.getSprite().slopeId = false
        }
    }

    /**
     *
     * @param isOnSlope
     * @param y
     * @returns {number}
     */
    slopeUpFactor(isOnSlope, y) {
        return (isOnSlope && y < 0) ? 100 : 0
    }

    /**
     * Adapt angle on slope
     * @param slopeId
     */
    adaptOnSlope(slopeId) {
        // Rotation
        switch (slopeId) {
            case 1:
                this.inclination = Constants.slopes.SLOPE_DESCENDING
                this.getSprite().angle = 45
                break
            case 2:
                this.inclination = Constants.slopes.SLOPE_ASCENDING
                this.getSprite().angle = -45
                break
            // Mechanic jump
            default:
                this.inclination = Constants.slopes.SLOPE_NONE
                if (this.getSprite().angle !== 0) {
                    this.getSprite().angle = 0
                }
        }
    }

    isBeyondSpeedUpPoint() {
        return this.getSprite().position.x >= this.speedUpX
    }

    isBeyondEndPoint() {
        return this.getSprite().position.x >= this.endX
    }

    startEndAnimation() {
        this.isPlayable = false
        this.getSprite().body.velocity.x = Constants.animations.END_ANIMATION_VELOCITY
        this.getSprite().animations.play(Constants.animations.ANIMATION_RUNNING)
    }

    goToPoint(name, callback = undefined) {
        const [pointX, ] = this.points.getPoint(name)
        let tween = this.game.add.tween(this.getSprite()).to({
            x: pointX,
            y: this.getSprite().position.y
        }, 750, Phaser.Easing.Quadratic.InOut)

        if (callback) {
            tween.onComplete.addOnce(callback)
        }
        tween.start()
    }
}
