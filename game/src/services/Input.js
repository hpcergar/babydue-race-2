
export default class {

    constructor (game) {
        this.game = game
    }

    isDown(){
        return this.game.input.activePointer.isDown
            || this.game.input.keyboard.addKey(Phaser.Keyboard.UP).isDown
            || this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).isDown
            || this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown
            ;
    }

    isUp(){
        return this.game.input.activePointer.isUp
            || this.game.input.keyboard.addKey(Phaser.Keyboard.UP).isUp
            || this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).isUp
            || this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isUp
            ;
    }
}