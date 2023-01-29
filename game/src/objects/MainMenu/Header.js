import Config from '../../config'

const MIN_WIDTH = Config.resolutions[0].width // TODO Use according resolution instead of [0]
const MIN_HEIGHT = Config.resolutions[0].height

class Header {
  constructor (game, world) {
    this.game = game
    this.world = world
    this.items = []
    // this.fontScale = this.game.attr.heightScale || 1;
    // this.heightScale = this.game.attr.heightScale || 1;
    this.fontScale = 1
    this.heightScale = 1

    this.draw()

    return this
  }

  draw () {
    // Check this out
    let headerOffset = this.getTopOffset()

    this.items = []

    let babydueText = this.game.add.text(this.getLeftOffsetText(), headerOffset, ' Babydue ')
    babydueText.anchor.set(0.5)
    babydueText.align = 'center'
    babydueText.font = Config.font.title.font
    babydueText.fontSize = 100 * this.fontScale
    babydueText.fill = '#ca869f'
    this.items.push(babydueText)
    this.babydueText = babydueText

    // Add RACE text
    let babydueSubtext = this.game.add.text(this.getLeftOffsetSubText()/* MIN_WIDTH*0.25+80 */, headerOffset + (78 * this.heightScale), '    RACE ')
    babydueSubtext.anchor.set(0.5)
    babydueSubtext.align = 'center'
    babydueSubtext.font = Config.font.title.font
    babydueSubtext.fontSize = 150 * this.fontScale
    babydueSubtext.fill = '#504c39'
    this.items.push(babydueSubtext)
    this.babydueSubtext = babydueSubtext
  }

  getTopOffset () {
    // Calculate in function of world height
    return 50 * this.heightScale
  }

  getLeftOffsetText () {
    return Math.max(this.game.width * 0.33, 300)
  }

  getLeftOffsetSubText () {
    return Math.max(this.game.width * 0.33, 300)
  }

  redraw (center = false) {
    if (center === false) {
      this.babydueText.x = this.getLeftOffsetText()
      this.babydueSubtext.x = this.getLeftOffsetSubText()
    } else {
      this.babydueText.x = this.game.width * 0.5
      this.babydueSubtext.x = this.game.width * 0.5
    }
  }

  getPosition () {
    let item = this.items[0]
    return [item.x, item.y, item.width, item.height]
  }

  destroy () {
    this.items.forEach(function (navItem, index) {
      navItem.destroy()
    })
  }
}

export default Header
