import {Character} from './Character'
import Constants from '../../constants'
export class Aria extends Character {
    constructor (game, debug = false, startX, startY) {
        super(game, debug)

        this.sprite = game.add.sprite(startX, startY, 'players')
        this.sprite.characterName = Constants.characters.CHARACTER_ARIA
        this.sprite.animations.add(
            Constants.animations.ANIMATION_IDLE,
            ['aria-idle'],
            5,
            true
        );
        this.sprite.animations.add(
            Constants.animations.ANIMATION_RUNNING,
            Phaser.Animation.generateFrameNames('aria-run-', 1, 8),
            7,
            true
        );
        this.sprite.animations.add(
            Constants.animations.ANIMATION_JUMPING,
            Phaser.Animation.generateFrameNames('aria-jump-', 1, 7),
            5,
            false
        );
        this.sprite.animations.add(
            Constants.animations.ANIMATION_DASH,
            Phaser.Animation.generateFrameNames('aria-dash-', 1, 2),
            5,
            true
        );
        this.sprite.animations.add(
            Constants.animations.ANIMATION_ATTACK,
            Phaser.Animation.generateFrameNames('aria-run-', 1, 8),
            7,
            false
        );
        this.game.physics.arcade.enable(this.sprite)
        // Set gravity center in the middle
        this.sprite.anchor.x = 0.2
        this.sprite.anchor.y = 0.25
        this.sprite.body.setSize(20, 55, 10, 0)
        this.enablePhysics()
    }

    update (gameState) {
        // Mechanic: jump (boing!)
        let nextAnimation = null,
            currentAnimation = this.getSprite().animations.name,
            wasJumping = currentAnimation === Constants.animations.ANIMATION_JUMPING,
            wasDashing = currentAnimation === Constants.animations.ANIMATION_DASH;

        if (false === gameState.isHittingGround) {
            return
        }

        if (this.getSprite().slopeId === Constants.slopes.SLOPE_TYPE_JUMP) {
            this.getSprite().body.velocity.y = Constants.mechanics.JUMP
            nextAnimation = Constants.animations.ANIMATION_JUMPING
        } else if (gameState.isHittingGround && wasJumping) {
            nextAnimation = Constants.animations.ANIMATION_RUNNING
        }

        // Mechanic: Rock
        if (this.getSprite().slopeId === Constants.slopes.SLOPE_TYPE_ROCK) {
            this.getSprite().body.velocity.x = 0
        }

        // Mechanic: drag
        if (this.getSprite().slopeId === Constants.slopes.SLOPE_TYPE_SLOW && this.getSprite().body.velocity.x !== 0) {
            this.getSprite().body.velocity.x = (this.getSprite().body.velocity.x >= 0 ? 1 : -1) * (gameState.velocity / 8)
        }

        // Mechanic: fast
        if (this.getSprite().slopeId === Constants.slopes.SLOPE_TYPE_FAST && this.getSprite().body.velocity.x !== 0) {
            // This could be improved with a longer effect, with a setTimeout to remove it
            this.getSprite().body.velocity.x = (this.getSprite().body.velocity.x >= 0 ? 1 : -1) * (gameState.velocity * 2)
            nextAnimation = Constants.animations.ANIMATION_DASH
        } else if(gameState.isHittingGround && wasDashing) {
            nextAnimation = Constants.animations.ANIMATION_RUNNING
        }

        let isIdle = this.getSprite().body.velocity.x === 0
        if (nextAnimation === null && !isIdle && currentAnimation === Constants.animations.ANIMATION_IDLE) {
            nextAnimation = Constants.animations.ANIMATION_RUNNING
        }

        if (nextAnimation != null && nextAnimation !== currentAnimation) {
            this.getSprite().animations.play(nextAnimation) // We could throw an event to update both characters
        }
    }
}
