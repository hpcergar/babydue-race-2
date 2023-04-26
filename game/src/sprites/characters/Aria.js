import {Character} from './Character'
import Constants from '../../constants'
export class Aria extends Character {
    constructor (game, debug = false, startX, startY) {
        super(game, debug)

        this.sprite = game.add.sprite(startX, startY, 'playerAria')
        this.game.physics.arcade.enable(this.sprite)
        // Set gravity center in the middle
        this.sprite.anchor.x = 0.4
        this.sprite.anchor.y = 0.25
        this.sprite.body.setSize(40, 64, 6, 0)
        this.enablePhysics()

        this.sprite.animations.add(Constants.animations.ANIMATION_RUNNING, [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 4, 1, 2, 3], 5, true)
        this.sprite.animations.add(Constants.animations.ANIMATION_STANDING, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4], 5, true)
    }

    update (gameState) {
        // Mechanic: jump (boing!)
        if (this.getSprite().slopeId === Constants.slopes.SLOPE_TYPE_JUMP) {
            this.getSprite().body.velocity.y = Constants.mechanics.JUMP
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
        }
    }
}
