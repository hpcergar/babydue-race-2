
export default class {
  constructor (game, debug = undefined) {
    this.game = game
    this.debug = debug
  }

  isDown () {
    return this.game.input.activePointer.isDown
        || this.game.input.keyboard.addKey(Phaser.Keyboard.UP).isDown
        || this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).isDown
        || (this.debug == null && this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown)
  }

  isUp () {
    return this.game.input.activePointer.isUp
        || this.game.input.keyboard.addKey(Phaser.Keyboard.UP).isUp
        || this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).isUp
        || (this.debug == null && this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isUp)
  }

  isSpacebarDown () {
    return this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown
  }
}
