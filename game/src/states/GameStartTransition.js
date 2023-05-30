/* globals __DEV__ */
import Phaser from 'phaser'
import SAT from 'SAT'
import TilemapProvider from '../providers/Tilemap'
import DecorationProvider from '../providers/Decoration'
import Background from '../sprites/Background'
import Player from '../sprites/Player'
import Overlay from '../sprites/Overlay'
import TextPanel from '../services/TextPanel'
import Scale from '../services/Scale'
import Config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000000'
    this.assetScale = 64
    this.prefabs = this.game.attr.prefabs
    this.game.plugins.add(Phaser.Plugin.ArcadeSlopes)
  }

  preload () {
    this.scaleService = new Scale(this.game)
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE
    this.scale.align(true, true)
    this.scale.setResizeCallback(this.onResize, this)
    this.scale.refresh()

    if (!this.game.device.desktop) // In mobile force the orientation
    {
      this.scale.forceOrientation(true, false)
      this.scale.enterIncorrectOrientation.add(() => {
        this.scaleService.disableFullScreen()
        this.resize()
      })
      this.scale.leaveIncorrectOrientation.add(() => {
        this.scaleService.enableFullScreen()
        this.resize()
      })
    }

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    //
    // Rendered layers
    //

    // Background
    new Background(this.game, this.map)
    // Add the tilemap and tileset image. The first parameter in addTilesetImage
    // is the name you gave the tilesheet when importing it into Tiled, the second
    // is the key to the asset in Phaser
    this.map = this.game.add.tilemap('level')

    // ATTENTION! ORDER Matters for layer objects below!!!
    // Decoration: Background layer
    new DecorationProvider(this.map, 'Behind')
    // Ground
    this.tilemapProvider = new TilemapProvider(this.map, this.game)
    // Player
    this.player = new Player(this.game)
    // Decoration: Foreground layer
    new DecorationProvider(this.map, 'Foreground')
    // Overlay, for transitions
    this.overlay = new Overlay(this.game)
    // Bring player on top of overlay
    this.game.world.bringToTop(this.player.getSecondaryCharacterSprite())
    this.game.world.bringToTop(this.player.getPrimaryCharacterSprite())
    this.player.getSecondaryCharacterSprite().tint = 0xffffff
    this.maxPlayersOffset = this.player.getSecondaryCharacterSprite().position.x

    // For collisions
    this.mainLayer = this.tilemapProvider.getMainLayer()

    // Setup text panel
    this.textPanel = new TextPanel(
      this.game,
      [
        this.game.translate('start-intro-1'),
        this.game.translate('start-intro-2')
      ],
      () => this.state.start('Game'),
      {
        shouldWaitForUser: true
      }
    )

    let flashDuration = 500
    // Start transition
    this.camera.flash('#000000', flashDuration)

    // Force update user scale
    this.onResize(this.game.scale, new Phaser.Rectangle(0, 0, this.game.width, this.game.height), true)

    // Display text panel after a small delay
    setTimeout(() => {
      this.textPanel.start()
    }, flashDuration)

    // Full screen
    this.game.input.onTap.add(this.scaleService.goFullScreen, this.scaleService)
  }

  /**
     *
     * @param scaleManager
     * @param parentBounds
     * @param force
     */
  onResize (scaleManager, parentBounds, force = false) {
    this.scaleService.resize(scaleManager, parentBounds, force, (width, height) => {
      let layersMap = this.tilemapProvider.getLayers()
      layersMap['Ground'].resize(width, height)

      if( width < 550 ) {
        this.player.getSecondaryCharacterSprite().position.x = 40
        this.player.getPrimaryCharacterSprite().position.x = this.player.getSecondaryCharacterSprite().position.x + Config.player.secondary_player_offset - 10
      } else {
        this.player.getSecondaryCharacterSprite().position.x = this.maxPlayersOffset
        this.player.getPrimaryCharacterSprite().position.x = this.maxPlayersOffset + Config.player.secondary_player_offset
      }

      this.overlay.resize()
      this.mainLayer.resizeWorld()
    })
  }

  update () {
    // To keep player on the ground
    this.game.physics.arcade.collide(this.player.getPrimaryCharacterSprite(), this.mainLayer)
    this.game.physics.arcade.collide(this.player.getSecondaryCharacterSprite(), this.mainLayer)

    this.textPanel.update()
  }
}
