
const MARGIN = 100

export default class {
  constructor (game) {
    // Starts
    this.game = game

    // Add the sprite to the game and enable arcade physics on it
    this.overlay = this.game.add.sprite(0, 0, 'black-pixel')
    this.resize()

    this.overlay.height = 4 * this.overlay.height // Ugly quick hack
  }

  resize () {
    this.overlay.width = this.setDimensionValue(this.overlay.width, this.game.camera.width)
    this.overlay.height = this.setDimensionValue(this.overlay.height, this.game.camera.height)
    this.overlay.position.x = this.game.camera.x - MARGIN
    this.overlay.position.y = this.game.camera.y - MARGIN
  }

  setDimensionValue (value, cameraValue) {
    return cameraValue > value
      ? cameraValue + 2 * MARGIN
      : value
  }

  /**
     *
     */
  resizeBig () {
    let width = this.overlay.width
    this.overlay.width = 4 * width // Quick fix: avoid empty spaces on camera travelling
    this.overlay.position.x = this.overlay.position.x - width * 1.5
  }

  update () {
    // Resize with camera if visible
    if (this.overlay.alpha > 0) {
      this.resize()
    }
  }

  getObject () {
    return this.overlay
  }

  fade (duration = 1000, callback = () => {}, alpha = 0) {
    this.resize()
    let overlayFadeIn = this.game.add.tween(this.overlay).to({alpha: alpha}, duration, 'Linear')
    overlayFadeIn.onComplete.addOnce(callback)
    overlayFadeIn.start()
  }
}
