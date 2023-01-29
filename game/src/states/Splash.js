import Phaser from 'phaser'
// import {TYPE_TILEMAP_JSON} from
import { centerGameObjects } from '../utils'
import {TYPE_TILEMAP_JSON} from '../providers/Asset'
import {orientation} from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    // this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    // this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    // centerGameObjects([this.loaderBg, this.loaderBar])

    // this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
      this.game.attr.prefabs = this.game.attr.assetProvider.preloadSubassets();
      this.game.attr.data = this.game.attr.prefabs.find(prefab => prefab.type === TYPE_TILEMAP_JSON).getData()
      this.game.attr.playerPoints = this.game.attr.data.layers.find(layer => layer.name === 'PlayerPoints').objects
  }

  create () {
    // TODO Undo, swap lines
      this.state.start('MainMenu')
      // this.state.start('HighScores')
      // this.state.start('Game')
      // this.state.start('GameStartTransition')
  }
}
