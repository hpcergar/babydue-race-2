export default class {
    constructor (game, debug = false, startX, startY) {
        // Starts
        this.game = game

        // STATES
        this.debug = debug
        this.sprite = this.game.add.sprite(startX, startY, 'playerAria')
        this.game.physics.arcade.enable(this.sprite)
    }

    getSprite () {
        return this.sprite
    }

    setActive () {
        this.sprite.visible = true
    }

    setInactive () {
        this.sprite.visible = false
    }
}
