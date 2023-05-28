import Config from '../../config'

class Menu {
  constructor (options, game, world) {
    this.game = game
    this.world = world
    this.options = options
    this.items = []
    this.active = null
    this.heightScale = 1
    this.fontScale = 1

    // Create an isActive property on each element
    this.options.items.forEach(function (navItem, index) {
      navItem.isActive = false
    })

    this.registerKeyhandler()

    this.drawMenu()

    // Set the first menu as active
    this.itemOnActive(this.items[0])
    return this
  }

  drawMenu () {
    let navigationOffset = this.getTopOffset()

    if (this.options.title) {
      let topOffset = navigationOffset - 40
      let text = this.game.add.text(this.getLeftOffset(), topOffset, this.options.title + ' ')
      text.anchor.set(0.5)
      text.align = 'center'
      text.font = Config.font.title.font
      text.fontSize = 25 * this.fontScale
      text.fill = '#455c3d'
      text.strokeThickness = 0

      this.items.push(text)
    }

    this.options.items.forEach((navItem, index) => {
      let topOffset = navigationOffset + index * 120 * this.heightScale
      let text = this.game.add.text(this.getLeftOffset(), topOffset, navItem.label + ' ')
      text.inputEnabled = true
      text.anchor.set(0.5)
      text.align = 'center'
      text.font = Config.font.title.font
      text.fontSize = 80 * this.fontScale
      text.fill = Config.ui.inactive_item_fill
      text.stroke = Config.ui.inactive_item_stroke
      text.strokeThickness = 6
      text.index = index
      text.callback = navItem.callback
      text.events.onInputUp.add(text.callback)
      text.events.onInputOver.add(_.bind(this.itemOnActive, this, text))

      this.items.push(text)
    }, this)
  }

  redraw () {
    this.items.forEach((text) => {
      text.x = this.getLeftOffset()
    })
  }

  getLeftOffset () {
    return this.game.width * 0.5
  }

  getTopOffset () {
    // Calculate in function of world height
    return 400 * this.heightScale
  }

  itemOnActive (item) {
    if (this.items[this.active] != item && this.active != null) {
      this.itemOnInactive(this.items[this.active])
    }
    item.isActive = true
    item.fill = Config.ui.active_item_fill
    item.stroke = Config.ui.active_item_stroke
    this.active = item.index
  }

  itemOnInactive (item) {
    item.isActive = false
    item.fill = Config.ui.inactive_item_fill
    item.stroke = Config.ui.inactive_item_stroke
  }

  getNextIndex () {
    let activeIndex = this.getActiveIndex()
    return (activeIndex == this.items.length - 1) ? 0 : activeIndex + 1
  }

  getPrevIndex () {
    let activeIndex = this.getActiveIndex()
    return activeIndex == 0 ? this.items.length - 1 : activeIndex - 1
  }

  getActiveIndex () {
    return this.active || 0
  }

  moveCursor (newIndex) {
    this.itemOnActive(this.items[newIndex])
  }

  registerKeyhandler () {
    this.game.input.keyboard.onUpCallback = _.bind(function (e) {
      if (e.keyCode == Phaser.Keyboard.UP) {
        this.moveCursor(this.getPrevIndex())
      }
      if (e.keyCode == Phaser.Keyboard.DOWN) {
        this.moveCursor(this.getNextIndex())
      }
      if (e.keyCode == Phaser.Keyboard.ENTER) {
        this.items[this.getActiveIndex()].callback()
      }
    }, this)
  }

  destroy () {
    this.game.input.keyboard.reset()
    this.items.forEach(function (navItem, index) {
      navItem.destroy()
    })
  }
}

export default Menu
