
const POINTS_COIN = 1
const POINTS_STAR = 10
const COLLECTIBLE_GROUP = 'collectibles'

export default class {
  constructor (game, map, score) {
    // Starts
    this.game = game
    this.map = map
    this.score = score
    this.coins = {}
    this.stars = {}

    // Coins
    this.createCollectible('Coin', 2, 30, 30, POINTS_COIN)
    // Stars
    this.createCollectible('Star', 32, 45, 45, POINTS_STAR)
  }

  /**
     *
     * @param name
     * @param tileId
     * @param width
     * @param height
     * @param points
     */
  createCollectible (name, tileId, width, height, points) {
    if (!this[COLLECTIBLE_GROUP]) {
      this[COLLECTIBLE_GROUP] = this.game.add.physicsGroup()
    }

    this.map.createFromObjects('Collectibles', name, 'autumn-objects', tileId, true, true, this[COLLECTIBLE_GROUP])
    this[COLLECTIBLE_GROUP].forEach((collectible) => {
      // This is not efficient, we should not loop over every one again
      if (!collectible.attr) {
        collectible.body.immovable = true
        collectible.body.setSize(width, height, 0, 0)
        collectible.attr = {points: points}
      }
    })
  }

  collect (player, collectible) {
    let points = collectible.attr.points
    collectible.kill()

    // Add points to score
    this.score.add(points)
  }

  update (player) {
    this.game.physics.arcade.overlap(player, this[COLLECTIBLE_GROUP], this.collect, null, this)
  }
}
