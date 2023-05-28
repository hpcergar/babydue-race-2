import Menu from '../objects/MainMenu/Menu'
import _ from 'lodash'
import Config from '../config'
import HighscoresService from '../services/HighscoresService'
import Scale from '../services/Scale'


export default class extends Phaser.State {
  preload () {
    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.renderer.renderSession.roundPixels = true
    this.scaleService = new Scale(this.game, {minScaleFactor: 0.4})
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
    this.scale.align(true, true)
    this.scale.setResizeCallback(this.onResize, this)
    this.scale.refresh()

    // Set the game background colour
    this.game.stage.backgroundColor = Config.background.color
    this.fontScale = 1

    this.highscoresService = new HighscoresService()
    let canVote = !!this.highscoresService.getUserTime()

    this.scaleDownFactor = 0.7
    this.aria = this.game.add.sprite(this.game.width * 0.5, this.game.camera.y + (50 * this.scaleDownFactor), 'aria-start-screen')
    this.aria.width = Config.assets.list['aria-start-screen'].width * this.scaleDownFactor
    this.aria.height = Config.assets.list['aria-start-screen'].height * this.scaleDownFactor

    this.julen = this.game.add.sprite(this.game.width * 0.5, this.game.camera.y + (75 * this.scaleDownFactor), 'julen-start-screen')
    this.julen.width = Config.assets.list['julen-start-screen'].width * this.scaleDownFactor
    this.julen.height = Config.assets.list['julen-start-screen'].height * this.scaleDownFactor

    console.log(this.game.width, this.game.height * 2 / 3)
    console.log(this.game.attr.heightScale)
    let mainMenuOptions = {
      'items': [
        {
          'label': this.game.translate('Play & Vote'),
          'callback': _.bind(this.startGame, this)
        },
        {
          'label': this.game.translate('High scores'),
          'callback': _.bind(this.showHighScores, this)
        }
      ]
    }

    // Add link to votes if can vote (has already played once)
    if (canVote) {
      mainMenuOptions.items.push({
        'label': this.game.translate('See polls'),
        'callback': _.bind(this.showPolls, this)
      })
    }

    this.mainMenu = new Menu(mainMenuOptions, this.game, this.world)

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
      this.aria.x = (this.game.width * 0.5) - (this.aria.width / 2) + (50 * this.scaleDownFactor)
      this.julen.x = (this.game.width * 0.5) - (this.julen.width / 2) - (80 * this.scaleDownFactor)
      this.mainMenu.redraw()
    })
  }

  startGame () {
    this.state.start('GameStartTransition')
  }

  showHighScores () {
    this.state.start('HighScores')
  }

  showPolls () {
    this.state.start('Polls')
  }
}
