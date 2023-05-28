'use strict'

export default class {
  constructor (game, map) {
    this.game = game
    let farground = this.game.cache.getImage('water-farground')

    this.bgMiddlegroundTilesprite = this.game.add.tileSprite(
        11000,
        1850,
        5000,
        farground.height / 2,
        'water-farground'
    )
    this.bgMiddlegroundTilesprite.tileScale.x = 0.5
    this.bgMiddlegroundTilesprite.tileScale.y = 0.5
    this.bgMiddlegroundTilesprite.tilePosition.x = -1000

    this.backgroundTilesprite = this.game.add.tileSprite(
        11000,
        2050,
        5000,
        farground.height / 2,
        'water-farground'
    )
    this.backgroundTilesprite.tileScale.x = 0.5
    this.backgroundTilesprite.tileScale.y = 0.5
  }
}
