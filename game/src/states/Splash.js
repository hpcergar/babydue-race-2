import Phaser from 'phaser'
import {TYPE_TILEMAP_JSON} from '../providers/Asset'

export default class extends Phaser.State {
    init (args) {}

    preload (game) {
        // load your assets
        this.game.attr.prefabs = this.game.attr.assetProvider.preloadSubassets()
        this.game.attr.data = this.game.attr.prefabs.find(prefab => prefab.type === TYPE_TILEMAP_JSON).getData()
        this.game.attr.playerPoints = this.game.attr.data.layers.find(layer => layer.name === 'PlayerPoints').objects
    }

    create (game) {
    // TODO Undo, swap lines
    // this.state.start('MainMenu')
    // this.state.start('HighScores')
    this.state.start('Game')
    // this.state.start('GameStartTransition')
    }
}
