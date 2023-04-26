
export default class {
  constructor (game, debug = undefined) {
    this.game = game
    this.debug = debug
    game.input.gamepad.start();
  }

  isDown () {
    return this.game.input.activePointer.isDown
        || this.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_A)
        || this.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_B)
        || this.game.input.keyboard.addKey(Phaser.Keyboard.UP).isDown
        || this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).isDown
        || (this.debug == null && this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown)
  }

  isUp () {
    return this.game.input.activePointer.isUp
        || this.game.input.gamepad.pad1.isUp(Phaser.Gamepad.XBOX360_A)
        || this.game.input.gamepad.pad1.isUp(Phaser.Gamepad.XBOX360_B)
        || this.game.input.keyboard.addKey(Phaser.Keyboard.UP).isUp
        || this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).isUp
        || (this.debug == null && this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isUp)
  }

  isSpacebarDown () {
    return this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown
  }
}
