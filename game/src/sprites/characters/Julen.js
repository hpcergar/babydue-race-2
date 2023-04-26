import {Character} from './Character'
import Constants from '../../constants'
export class Julen extends Character {
    constructor (game, debug = false, startX, startY) {
        super(game, debug)

        this.sprite = game.add.sprite(startX, startY, 'playerJulen')
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
        // TODO Interact with Rock

    }
}
