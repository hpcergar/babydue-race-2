/* globals __DEV__ */
import Phaser from 'phaser'
import SAT from 'SAT'
import TilemapProvider from '../providers/Tilemap'
import DecorationProvider from '../providers/Decoration'
import Background from '../sprites/Background'
import Score from '../services/Score'
import Rocks from '../sprites/Rocks'
import Player from '../sprites/Player'
import Door from '../sprites/Door'
import Overlay from '../sprites/Overlay'
import HighscoresService from '../services/HighscoresService'
import TextPanel from '../services/TextPanel'
import Scale from '../services/Scale'
import ScoreService from '../services/Score'

// import DebugArcadePhysics from 'DebugArcadePhysics'

const BACKGROUND_LAYER = 'Background'
const BEHIND_LAYER = 'Behind'
const MECHANICS_LAYER = 'Mechanics'
const FRONT_LAYER = 'Foreground'

export default class extends Phaser.State {
  init () {
    this.assetScale = 64
    this.prefabs = this.game.attr.prefabs
    this.layers = []

    this.game.plugins.add(Phaser.Plugin.ArcadeSlopes)
    this.scoreService = new ScoreService()

    // debug
    // this.game.plugins.add(Phaser.Plugin.DebugArcadePhysics);
    // this.game.debug.arcade.on()
  }

  preload () {
    this.game.renderer.renderSession.roundPixels = true
    this.game.time.desiredFps = 60
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

    // Add callback to adjust fps if slower
    this.game.fpsProblemNotifier.add(this.handleFpsProblem, this)

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    // STATE
    // Keep these false on production
    this.debug = true
    this.debugFps = false

    if (this.debug || this.debugFps) {
      this.game.time.advancedTiming = true
    }

    // Score (Time)
    this.score = new Score(this.game)
    this.highscoresService = new HighscoresService()
    this.textPanel = {}

    // State flags
    this.isEndAnimation = false

    //
    // Rendered layers
    //

    // Background
    this.layers[BACKGROUND_LAYER] = new Background(this.game, this.map)

    // Add the tilemap and tileset image. The first parameter in addTilesetImage
    // is the name you gave the tilesheet when importing it into Tiled, the second
    // is the key to the asset in Phaser
    this.map = this.game.add.tilemap('level')

    this.layers[BEHIND_LAYER] = this.game.add.group()
    // ATTENTION! ORDER Matters for layer objects below!!!
    // Decoration: Background layer
    new DecorationProvider(this.map, 'Behind', this.layers[BEHIND_LAYER])

    // Ground
    this.tilemapProvider = new TilemapProvider(this.map, this.game)

    // Mechanics (slow-down, jump)
    new DecorationProvider(this.map, 'Mechanics', this.layers[MECHANICS_LAYER])
    // Rocks animation
    this.rocks = new Rocks(this.game, this.map)
    this.door = new Door(this.game)

    // Player (Aria)
    this.player = new Player(this.game, this.debug)

    // Decoration: Foreground layer
    this.layers[FRONT_LAYER] = this.game.add.group()
    new DecorationProvider(this.map, 'Foreground', this.layers[FRONT_LAYER])

    this.mainLayer = this.tilemapProvider.getMainLayer()

    this.score.hide()

    // Overlay, for transitions
    this.overlay = new Overlay(this.game)

    this.game.world.bringToTop(this.player.getSprite())

    // Full screen
    this.game.input.onTap.add(this.scaleService.goFullScreen, this.scaleService)

    // Start transition
    // Force update user scale
    this.resize()
    this.overlay.fade(1000, () => {
      this.score.show()
      this.game.world.bringToTop(this.layers[FRONT_LAYER])
      if (this.debug) {
        this.startPlayableGame()
      } else {
        // Normal flow
        this.startBeginTransition()
      }
    })
  }

  handleFpsProblem () {
    console.log('Desired fps', this.game.time.desiredFps, 'Suggested fps', this.game.time.suggestedFps)
    this.game.time.desiredFps = 40
    this.game.forceSingleUpdate = false
  }

  resize () {
    this.onResize(this.game.scale, new Phaser.Rectangle(0, 0, this.game.width, this.game.height), true)
  }

  /**
     *
     * @param scaleManager
     * @param parentBounds
     * @param force
     */
  onResize (scaleManager, parentBounds, force = false) {
    this.scaleService.resize(scaleManager, parentBounds, force, (width, height) => {
      console.log('scaled up (width, height)')
      let layersMap = this.tilemapProvider.getLayers()
      layersMap['Ground'].resize(width, height)

      this.overlay.resize()
      this.mainLayer.resizeWorld()
      this.score.redraw()
    })
  }

  render () {
    // TODO Remove
    if (this.debug || this.debugFps) {
      this.game.debug.text('FPS: ' + this.game.time.fps || 'FPS: --', 40, 40, '#00ff00')
      // this.game.debug.text("Game width: " + this.game.width + " height: " + this.game.height, 50, 50);
      if (this.game.time.suggestedFps !== null) {
        this.game.debug.text('suggested FPS: ' + game.time.suggestedFps, 2, 28, '#00ff00')
        this.game.debug.text('desired FPS: ' + game.time.desiredFps, 2, 42, '#00ff00')
      }
    }
  }

  update () {
    let hitGround = this.game.physics.arcade.collide(this.player.getSprite(), this.mainLayer, (player, ground) => this.player.setCollisionData(ground))

    if (!this.isEndAnimation) {
      this.rocks.update(this.player.getSprite())
      this.player.update(hitGround)
      this.score.update()
    } else if (this.textPanel && this.textPanel.update) {
      this.textPanel.update()
    }

    this.layers[BACKGROUND_LAYER].update()

    this.overlay.update()

    // End game
    if (this.player.isPlayable && this.player.isBeyondEndPoint()) {
      this.score.stop()
      this.startEndAnimation()
    }
  }

  /**
     *
     */
  startBeginTransition () {
    this.countDownNumber(3, () =>
      this.countDownNumber(2, () =>
        this.countDownNumber(1, () =>
          this.countDownNumber(this.game.translate('Despegue'), () => {
            // Remove full screen handler
            this.scaleService.disableFullScreen()
            this.startPlayableGame()
          }))))
  }

  startPlayableGame () {
    this.score.start()
    this.player.run()
  }

  /**
     *
     * @param number
     * @param callback
     */
  countDownNumber (number, callback) {
    let numberText = this.game.add.text(this.game.width / 2, this.game.height / 2, number)
    numberText.font = 'Press Start 2P'
    numberText.fontSize = 30
    numberText.anchor.set(0.5)
    numberText.align = 'center'
    numberText.fill = '#cc4c28'
    numberText.fixedToCamera = true
    numberText.alpha = 0
    numberText.stroke = '#504c39'
    numberText.strokeThickness = 1

    this.add.tween(numberText).to({alpha: 1}, 500, Phaser.Easing.Back.Out, true)
    let scaleTweenIn = this.add.tween(numberText.scale).to({x: 2, y: 2}, 500, Phaser.Easing.Back.Out)
    scaleTweenIn.onComplete.addOnce(() => {
      setTimeout(() => {
        let scaleTweenOut = this.add.tween(numberText).to({
          width: numberText.width * 3,
          height: numberText.height * 3,
          alpha: 0
        }, 300, Phaser.Easing.Circular.Out)
        scaleTweenOut.onComplete.addOnce(() => {
          numberText.kill()
          callback()
        })
        scaleTweenOut.start()
      }, 500)
    })
    scaleTweenIn.start()
  }

  startEndAnimation () {
    this.isEndAnimation = true
    this.player.startEndAnimation()

    // let playerObject = this.player.getObject()
    this.game.world.bringToTop(this.overlay.getObject())
    this.game.world.bringToTop(this.player.getSprite())
    let time = this.score.get()

    // Push new score to API
    let bestTime = this.highscoresService.getUserTime()
    let position = this.highscoresService.getUserPositionInTop10(time)
    this.highscoresService.saveTime(time)

    // Score text & position if <= 10th
    let text = this.getEndText(time, position, bestTime)

    // Start transition
    // 1. Display overlay
    this.overlay.fade(1000, () => {
      let playerObject = this.player.getSprite()
      // 2. Move camera to have player on the left
      this.game.camera.follow(null)
      playerObject.body.velocity.x = 0
      this.overlay.resizeBig() // Quick fix: avoid empty spaces on camera travelling
      let moveCameraToRight = this.game.add.tween(this.game.camera).to({
        x: playerObject.body.x - 70,
        y: this.game.camera.y
      }, 750, Phaser.Easing.Quadratic.InOut)

      moveCameraToRight.onComplete.addOnce(() => {
        // 3. Display end message with time & position
        this.textPanel = new TextPanel(this.game, text, () => {
          // 4. Follow player again
          this.game.camera.follow(playerObject, Phaser.Camera.FOLLOW_LOCKON, 0.1)
          // 5. Fade out overlay & start door transition
          this.overlay.fade(1000, () => this.startDoorTransition(), 0)
        }, {
          shouldWaitForUser: true,
          offsetX: this.game.camera.x,
          destroyOnComplete: true
        })
        this.textPanel.start()
      })
      moveCameraToRight.start()
    }, 1)
  }

  startDoorTransition () {
    // Not needed
    // this.game.world.bringToTop(this.layers[FRONT_LAYER]);

    // Stop player in front of the door
    this.player.goToPoint('playerInFrontOfDoor', () => {
      // Display layers accordingly
      this.game.world.bringToTop(this.tilemapProvider.getGroundLayer())
      this.game.world.bringToTop(this.door.getObject())
      this.game.world.bringToTop(this.player.getSprite())
      this.game.world.bringToTop(this.layers[FRONT_LAYER])

      this.game.camera.follow(null)

      // Door animation
      this.door.open()

      setTimeout(() => {
        // Pass player through the door
        this.player.goToPoint('playerAfterDoor', () => {
          // Camera flash & go to state
          this.camera.fade('#000000')
          this.state.start('Polls')
        })
      }, 1000)
    })
  }

  /**
     * Calculate text after having finished level
     * @param time
     * @param position
     * @param bestTime
     * @returns {*[]}
     */
  getEndText (time, position, bestTime) {
    let text = this.game.translate('Congratulations').replace(':time', this.scoreService.format(time)),
      isBestTime = (bestTime && time <= bestTime) || !bestTime

    if (position !== false && isBestTime) {
      text = text.concat('\n' + this.game.translate('You are in the top 10').replace(':position', position))
    }

    if (!isBestTime && bestTime) {
      text = text.concat('\n\n' + this.game.translate('Your best time is').replace(':time', this.scoreService.format(bestTime)))
    }

    return [text] // As single page, you could add multiple for each displayed page
  }
}
