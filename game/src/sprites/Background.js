'use strict'

export default class {
  constructor (game, map) {
    this.game = game
    this.game.stage.backgroundColor = '#009ecc'
    this.backgroundTilesprite = this.game.add.sprite(0, -100, 'background')
    this.backgroundTilesprite.width = 1350
    this.backgroundTilesprite.height = 900

    this.backgroundTilesprite.fixedToCamera = true
  }

  update () {
    // Simulate parallax
    // this.backgroundTilesprite.tilePosition.set(this.game.camera.x * -0.5, 0)
  }
}
