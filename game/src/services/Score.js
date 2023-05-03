export default class {
  constructor (game) {
    // Starts
    this.game = game
    this.isHidden = false
    this.topOffset = 20
    this.rightOffset = 20
    this.characterWidth = 25

    this.isStarted = false;
    this.startTime = 0
    this.elapsedTime = 0
    this.textualElapsedTime = this.format(0)
  }

  create () {
    const [labelX, labelY] = this.getLabelPosition()
    this.label = this.game.add.text(labelX, labelY, 'Time')
    this.label.font = 'Press Start 2P'
    this.label.fontSize = 24
    this.label.fill = '#cc4c28'
    this.label.fixedToCamera = true

    const [timeX, timeY] = this.getTimePosition()
    this.timetext = this.game.add.text(timeX, timeY, '0')
    this.timetext.font = 'Press Start 2P'
    this.timetext.fontSize = 24
    this.timetext.fill = '#343537'
    this.timetext.fixedToCamera = true
  }

  getLabelPosition () {
    return [this.game.width - (this.characterWidth * this.textualElapsedTime.length) - this.rightOffset - 140, this.topOffset]
  }

  getTimePosition () {
    return [this.game.width - (this.characterWidth * this.textualElapsedTime.length) - this.rightOffset, this.topOffset]
  }

  get () {
    return this.elapsedTime
  }

  redraw () {
    if (this.label && this.timetext) {
      const [labelX, labelY] = this.getLabelPosition()
      this.label.cameraOffset.x = labelX
      this.label.cameraOffset.y = labelY

      const [timeX, timeY] = this.getTimePosition()
      this.timetext.cameraOffset.x = timeX
      this.timetext.cameraOffset.y = timeY
    }
  }

  remove () {
    if (this.label) this.label.kill()
    if (this.timetext) this.timetext.kill()
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
     * Transform timestamp into human-readable format
     * @param time
     * @returns {string}
     */
  format (time) {
    let tempTime = time;
    let milliseconds = tempTime % 1000;
    tempTime = Math.floor(tempTime / 1000);
    let seconds = tempTime % 60;
    tempTime = Math.floor(tempTime / 60);
    let minutes = tempTime % 60;
    // tempTime = Math.floor(tempTime / 60);
    // let hours = tempTime % 60;

    return ('' + minutes).padStart(2, '0')
        + ":"
        + ('' + seconds).padStart(2, '0')
        + "."
        + ('' + milliseconds).substring(0, 3).padStart(3, '0');
  }

  start() {
    this.startTime = Date.now()
    this.isStarted = true
  }

  stop() {
    this.isStarted = false
  }

  updateTime() {
    if( this.isStarted ){
      this.elapsedTime = Date.now() - this.startTime
    }
  }

  update () {
    if (this.isHidden === false) {
      this.updateTime()
      this.textualElapsedTime = this.format(this.elapsedTime)
      this.timetext.setText(this.textualElapsedTime)
      this.timetext.parent.bringToTop(this.timetext)
    }
  }
}
