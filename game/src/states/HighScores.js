import HighscoresService from '../services/HighscoresService'
import ScoreService from '../services/Score'
import Input from '../services/Input'
import Config from '../config'
import Scale from '../services/Scale'

export default class extends Phaser.State {
  create () {
    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.renderer.renderSession.roundPixels = true
    this.scaleService = new Scale(this.game, {minScaleFactor: 0.4})
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
    this.scale.align(true, true)
    this.scale.setResizeCallback(this.onResize, this)
    this.scale.refresh()

    this.input = new Input(this.game)

    // Set the game background colour
    this.game.stage.backgroundColor = Config.background.color
    this.fontScale = 1
    this.heightScale = 1
    this.renderHeader()

    // this.font = 'arcade';
    this.font = 'Press Start 2P'

    this.loadingText = this.game.add.text(this.game.width / 2, 200, this.game.translate('Loading...'))
    this.loadingText.anchor.set(0.5)
    this.loadingText.font = this.font
    this.loadingText.fontSize = 40 * this.fontScale
    this.loadingText.fill = '#504c39'

    this.scoreService = new ScoreService()
    this.highscoresService = new HighscoresService()
    this.results = this.highscoresService.getTop10()
    this.renderHighScores(this.results)

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
      this.renderHeader(width, height)
      this.renderHighScores(this.results, width, height)
    })
  }

  renderHeader (width = this.game.width, height = this.game.height, scale = 1) {
    let headerOffset = 80 * this.heightScale

    if (this.header && this.header.visible === false) {
      this.header.destroy()
      this.header = null
    }

    if (!this.header) {
      this.header = this.game.add.text(width * 0.5, headerOffset, '←  High Scores  ')
      // Go to home
      this.header.inputEnabled = true
      this.header.events.onInputUp.add(() => this.game.state.start('MainMenu'))
    }

    this.header.x = width * 0.5
    this.header.y = headerOffset
    this.header.anchor.set(0.5)
    this.header.align = 'center'
    this.header.font = Config.font.title.font
    this.header.fontSize = 90 * this.fontScale
    this.header.fill = '#504c39'
    this.header.strokeThickness = 0

    if (this.header.width + 20 > width) {
      this.renderHeader(width, height, scale * 0.8)
    }
  }

  renderHighScores (toplist, width = this.game.width, height = this.game.height, scale = 1) {
    if (this.loadingText) {
      this.loadingText.destroy()
    }

    let topListOffset = 90 * this.heightScale
    let text = ''
    _.each(toplist, _.bind((item, index) => {
      let value = (index + 1) + '. ' + this.scoreService.pad(item.score) + '\t' + item.name + '  '
      text += '\n' + value
    }))

    if (this.highscores && this.highscores.visible === false) {
      this.highscores.destroy()
      this.highscores = null
    }

    if (!this.highscores) {
      this.highscores = this.game.add.text()
      this.highscores.checkWorldBounds = true
      this.highscores.events.onOutOfBounds.add(() => {
        this.renderHighScores(toplist, width, height, scale * 0.8)
      }, this)
    }

    this.highscores.x = width / 2
    this.highscores.y = topListOffset
    this.highscores.text = text
    this.highscores.font = Config.font.title.font
    this.highscores.fontSize = 50 * scale
    this.highscores.align = 'left'
    this.highscores.fill = '#e5b900'
    this.highscores.stroke = '#504c39'
    this.highscores.strokeThickness = 4

    this.highscores.lineSpacing = 10 * scale
    this.highscores.fixedToCamera = true // so it will move with camera
    this.highscores.anchor.setTo(0.5, 0)

    if (this.highscores.width + 20 > width || this.highscores.height + 20 > height) {
      this.renderHighScores(toplist, width, height, scale * 0.8)
    }
  }
}
