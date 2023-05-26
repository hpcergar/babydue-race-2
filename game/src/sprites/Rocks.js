import Constants from "../constants";

const ROCKS_GROUP = 'Rocks'

export default class {
  constructor (game, map) {
    this.game = game
    this.map = map
    this.createRock('Mech-Rock', 26)


    // Rock animations stack
    let rockStack = []
    for (let i=0; i < 3; i++) {
      let explodingRockSprite = game.add.sprite(999999, 999999, 'rock-explosion')
      // Set gravity center in the middle
      explodingRockSprite.anchor.x = 0
      explodingRockSprite.anchor.y = 0.25
      let animation = explodingRockSprite.animations.add(
          Constants.animations.ANIMATION_EXPLODE,
          Phaser.Animation.generateFrameNames('rock-', 1, 7),
          20,
          false
      );
      animation.onComplete.add(() => {
        explodingRockSprite.position.x = 999999
        explodingRockSprite.position.y = 999999
        explodingRockSprite.alpha = 1
        rockStack.push(explodingRockSprite)
      })
      rockStack.push(explodingRockSprite)
    }

    this.rockStack = rockStack
  }

  /**
     *
     * @param name
     * @param tileId
     */
  createRock (name, tileId) {
    if (!this[ROCKS_GROUP]) {
      this[ROCKS_GROUP] = this.game.add.physicsGroup()
    }

    this.map.createFromObjects(ROCKS_GROUP, name, 'autumn-objects', tileId, true, true, this[ROCKS_GROUP])
    this[ROCKS_GROUP].forEach((rock) => {
      if (!rock.body.immovable) {
        rock.body.immovable = true
      }
    })
  }

  destroy (player, rock) {
    if (player.characterName !== Constants.characters.CHARACTER_JULEN) {
      return
    }
    let explodingRockSprite = this.rockStack.pop()
    explodingRockSprite.position.x = rock.position.x - 3
    explodingRockSprite.position.y = rock.position.y - 57
    explodingRockSprite.animations.play(Constants.animations.ANIMATION_EXPLODE)
    rock.kill()
  }

  update (player) {
    this.game.physics.arcade.overlap(player, this[ROCKS_GROUP], this.destroy, null, this)
  }
}
