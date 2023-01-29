export default class {
  constructor (game) {
    // Starts
    this.game = game
    this.score = 0
    this.digitNumber = 7
    this.isHidden = false
    this.topOffset = 20
    this.rightOffset = 20
    this.characterWidth = 25
  }

  create () {
    const [labelX, labelY] = this.getLabelPosition()
    this.label = this.game.add.text(labelX, labelY, 'Score')
    this.label.font = 'Press Start 2P'
    this.label.fontSize = 24
    this.label.fill = '#cc4c28'
    this.label.fixedToCamera = true

    const [scoreX, scoreY] = this.getScorePosition()
    this.scoretext = this.game.add.text(scoreX, scoreY, '0')
    this.scoretext.font = 'Press Start 2P'
    this.scoretext.fontSize = 24
    this.scoretext.fill = '#343537'
    this.scoretext.fixedToCamera = true
  }

  getLabelPosition () {
    return [this.game.width - (this.characterWidth * this.digitNumber) - this.rightOffset - 140, this.topOffset]
  }

  getScorePosition () {
    return [this.game.width - (this.characterWidth * this.digitNumber) - this.rightOffset, this.topOffset]
  }

  add (points) {
    this.score += points
  }

  get () {
    return this.score
  }

  redraw () {
    if (this.label && this.scoretext) {
      const [labelX, labelY] = this.getLabelPosition()
      this.label.cameraOffset.x = labelX
      this.label.cameraOffset.y = labelY

      const [scoreX, scoreY] = this.getScorePosition()
      this.scoretext.cameraOffset.x = scoreX
      this.scoretext.cameraOffset.y = scoreY
    }
  }

  remove () {
    if (this.label) this.label.kill()
    if (this.scoretext) this.scoretext.kill()
  }

  hide () {
    this.isHidden = true
    this.remove()
  }

  show () {
    this.isHidden = false
    this.create()
    this.update()
  }

  /**
     * Left pad with zeros
     * @param score
     * @returns {string}
     */
  pad (score) {
    let zeros = '' + Math.pow(10, this.digitNumber)
    return (zeros + score).substr(-this.digitNumber)
  }

  update () {
    if (this.isHidden === false) {
      this.scoretext.setText(this.pad(this.score))
      this.scoretext.parent.bringToTop(this.scoretext)
    }
  }
}
