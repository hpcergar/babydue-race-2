import {Character} from './Character'
import Constants from '../../constants'
export class Julen extends Character {
    LAST_ATTACK_FRAME_NAME = 'julen-attack-6'

    constructor (game, debug = false, startX, startY) {
        super(game, debug)

        this.sprite = game.add.sprite(startX, startY, 'players')
        this.sprite.animations.add(
            Constants.animations.ANIMATION_IDLE,
            ['julen-idle'],
            5,
            true
        );
        this.sprite.animations.add(
            Constants.animations.ANIMATION_RUNNING,
            Phaser.Animation.generateFrameNames('julen-run-', 1, 8),
            7,
            true
        );
        this.sprite.animations.add(
            Constants.animations.ANIMATION_JUMPING,
            Phaser.Animation.generateFrameNames('julen-jump-', 1, 7),
            5,
            false
        );
        this.sprite.animations.add(
            Constants.animations.ANIMATION_DASH,
            Phaser.Animation.generateFrameNames('julen-dash-', 1, 2),
            5,
            true
        );
        this.sprite.animations.add(
            Constants.animations.ANIMATION_ATTACK,
            Phaser.Animation.generateFrameNames('julen-attack-', 1, 6),
            8,
            false
        );
        this.game.physics.arcade.enable(this.sprite)
        // Set gravity center in the middle
        this.sprite.anchor.x = 0.2
        this.sprite.anchor.y = 0.25
        this.sprite.body.setSize(20, 55, 10, -2)
        this.enablePhysics()
    }

    update (gameState) {
        let nextAnimation = null,
            currentAnimation = this.getSprite().animations.name,
            currentFrameName = this.getSprite().animations.frameName;

        if (false === gameState.isHittingGround) {
            return
        }

        // TODO Interact with Rock
        // Mechanic: Rock
        if (this.getSprite().slopeId === Constants.slopes.SLOPE_TYPE_ROCK) {
            nextAnimation = Constants.animations.ANIMATION_ATTACK
        }

        // TODO Refactor up
        let isIdle = this.getSprite().body.velocity.x === 0
        if (nextAnimation === null && !isIdle) {
            nextAnimation = Constants.animations.ANIMATION_RUNNING
        }

        if (nextAnimation != null && nextAnimation !== currentAnimation) {
            // Allow attack to end
            if (currentAnimation === Constants.animations.ANIMATION_ATTACK
                && currentFrameName !== this.LAST_ATTACK_FRAME_NAME) {
                return;
            }

            this.getSprite().animations.play(nextAnimation) // We could throw an event to update both characters
        }
    }
}
