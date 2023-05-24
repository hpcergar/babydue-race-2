import Points from '../services/Points'

const ANIMATION_IDLE = 'idle'
const ANIMATION_OPENING = 'opening'
const ANIMATION_OPEN = 'open'

export default class {
  constructor (game) {
    // Starts
    this.game = game
    this.points = new Points(this.game)

    // Add the sprite to the game and enable arcade physics on it
    const [doorX, doorY] = this.points.getPoint('doorPoint')

    // Let's let it render anywhere outside camera
    this.object = this.game.add.sprite(doorX, doorY - 93, 'door')

    // Define animations
    this.object.animations.add(ANIMATION_IDLE, [0], 5, false)
    this.object.animations.add(ANIMATION_OPENING, [0, 1, 2, 3, 4, 5, 6, 7], 5, false)
    this.object.animations.add(ANIMATION_OPEN, [7], 5, false)

    this.object.animations.frame = 0
  }

  getObject () {
    return this.object
  }

  open () {
    this.object.animations.play(ANIMATION_OPENING, 10, false)
  }
}
