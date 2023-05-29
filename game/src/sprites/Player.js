import Input from '../services/Input'
import Points from '../services/Points'
import Constants from '../constants'
import {Aria} from './characters/Aria'
import {Julen} from './characters/Julen'

const SECONDARY_PLAYER_OFFSET = 40
export default class {
    /**
     * @type Aria|Julen
     */
    primaryCharacter;
    /**
     * @type Aria|Julen
     */
    secondaryCharacter;

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

        this.loadCharacters(game, debug, startX, startY)
        this.enableCharacter(this.characters[Constants.characters.CHARACTER_JULEN])
        this.enableSecondaryCharacter(
            this.characters[Constants.characters.CHARACTER_ARIA],
            this.characters[Constants.characters.CHARACTER_JULEN]
        )

        // PHYSICS
        this.velocity = Constants.mechanics.GAME_VELOCITY
        this.speedUp = false
        // Start stopped
        this.getPrimaryCharacterSprite().body.velocity.x = 0

        // this.game.debug.bodyInfo(this.getSprite(), 32, 32);
        // this.game.debug.body(this.getSprite());
        // this.game.debug.reset();

        // ANIMATIONS
        this.getPrimaryCharacterSprite().animations.play(Constants.animations.ANIMATION_IDLE)
        this.lookingRight = true

        // CONTROLS
        this.cursors = this.game.input.keyboard.createCursorKeys()
    }

    loadCharacters(game, debug, startX, startY) {
        this.characters = {}
        this.characters[Constants.characters.CHARACTER_JULEN] = new Julen(game, debug, startX, startY)
        this.characters[Constants.characters.CHARACTER_ARIA] = new Aria(game, debug, startX, startY)
    }

    enableCharacter(character, previousCharacter) {
        if (previousCharacter !== undefined) {
            this.copyCharacterProperties(previousCharacter, character)
        }
        character.setActive();
        this.primaryCharacter = character

        this.getPrimaryCharacterSprite().animations.play(Constants.animations.ANIMATION_IDLE)
        // Make the camera follow the sprite
        this.game.camera.follow(this.getPrimaryCharacterSprite())
    }

    copyCharacterProperties(from, to) {
        to.sprite.position = Object.assign({}, from.sprite.position)
        to.sprite.slopeId = from.sprite.slopeId
        to.sprite.body.velocity.x = from.sprite.body.velocity.x
        to.sprite.body.velocity.y = from.sprite.body.velocity.y
        to.sprite.scale.x = from.sprite.scale.x
    }

    enableSecondaryCharacter(character, primaryCharacter) {
        if (character === undefined) {
            return
        }

        character.setInactive()
        let to = this.secondaryCharacter = character
        let from = primaryCharacter

        to.sprite.position = Object.assign({}, from.sprite.position)
        to.sprite.position.x -= SECONDARY_PLAYER_OFFSET
        to.sprite.body.velocity.x = from.sprite.body.velocity.x
        to.sprite.body.velocity.y = from.sprite.body.velocity.y
        to.sprite.scale.x = from.sprite.scale.x
        to.sprite.animations.play(from.sprite.animations.name)
    }

    switchCharacters() {
        let previousCharacter = this.primaryCharacter
        let nextCharacter = this.secondaryCharacter
        this.enableCharacter(nextCharacter, previousCharacter)
        this.enableSecondaryCharacter(previousCharacter, nextCharacter)
    }

    getPrimaryCharacterSprite() {
        return this.primaryCharacter.getSprite()
    }

    getSecondaryCharacterSprite() {
        return this.secondaryCharacter.getSprite()
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

        let isHittingGround = this.primaryCharacter.isHittingGround(hitting)

        // For debug
        // if (this.debug) {
        //     this.getSprite().body.velocity.x = 0
        // }



        // Disable last jump bug on slopes
        if (hitting && this.getPrimaryCharacterSprite().slopeId) {
            // Only on ascending, to avoid jumping on descending
            this.getPrimaryCharacterSprite().body.velocity.y = this.getPrimaryCharacterSprite().body.velocity.y >= 0
                ? this.getPrimaryCharacterSprite().body.velocity.y
                : 0
        }

        let slopeUpFactor = this.slopeUpFactor(this.getPrimaryCharacterSprite().slopeId, this.getPrimaryCharacterSprite().body.velocity.y)
        if (this.isPlayable /*&& this.debug === false*/) {
            this.getPrimaryCharacterSprite().body.velocity.x = this.velocity - slopeUpFactor
        }

        if (isHittingGround) {
            // If on the ground, allow jump or mechanic: jump
            if (this.isInputPressed()) {
                this.switchCharacters()
            }
            this.primaryCharacter.update(this.getGameStateForPlayer(isHittingGround))
        }

        this.secondaryCharacter.updateAsSecondary(this.primaryCharacter, SECONDARY_PLAYER_OFFSET)


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
    }

    getGameStateForPlayer(isHittingGround) {
        return {
            velocity: this.velocity,
            isHittingGround
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
        this.getPrimaryCharacterSprite().body.velocity.x = this.velocity
    }

    setCollisionData(ground) {
        if (ground.slope && ground.slope.type > 0) {
            this.getPrimaryCharacterSprite().slopeId = ground.slope.type
            this.getPrimaryCharacterSprite().slope = ground.slope
        } else {
            this.getPrimaryCharacterSprite().slopeId = false
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
                this.getPrimaryCharacterSprite().angle = 45
                break
            case 2:
                this.inclination = Constants.slopes.SLOPE_ASCENDING
                this.getPrimaryCharacterSprite().angle = -45
                break
            // Mechanic jump
            default:
                this.inclination = Constants.slopes.SLOPE_NONE
                if (this.getPrimaryCharacterSprite().angle !== 0) {
                    this.getPrimaryCharacterSprite().angle = 0
                }
        }
    }

    isBeyondSpeedUpPoint() {
        return this.getPrimaryCharacterSprite().position.x >= this.speedUpX
    }

    isBeyondEndPoint() {
        return this.getPrimaryCharacterSprite().position.x >= this.endX
    }

    startEndAnimation() {
        this.isPlayable = false
        this.getPrimaryCharacterSprite().body.velocity.x = Constants.animations.END_ANIMATION_VELOCITY
        this.getPrimaryCharacterSprite().animations.play(Constants.animations.ANIMATION_RUNNING)
    }

    goToPoint(name, callback = undefined) {
        const [pointX, ] = this.points.getPoint(name)
        let tween = this.game.add.tween(this.getPrimaryCharacterSprite()).to({
            x: pointX,
            y: this.getPrimaryCharacterSprite().position.y
        }, 750, Phaser.Easing.Quadratic.InOut)

        if (callback) {
            tween.onComplete.addOnce(callback)
        }
        tween.start()
    }
}
