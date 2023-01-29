import Config from '../../config'

const MIN_WIDTH = Config.resolutions[0].width // TODO Use according resolution instead of [0]
const MIN_HEIGHT = Config.resolutions[0].height

class Menu {

	constructor(options, game, world){
		this.game = game;
		this.world = world;
		this.options = options;
		this.items = [];
		this.active = null;
        // this.fontScale = this.game.attr.widthScale || 1;
        // this.heightScale = this.game.attr.heightScale || 1;
        this.heightScale = 1;
        this.fontScale =  1;


		// Create an isActive property on each element
		this.options.items.forEach(function(navItem,index){
			navItem.isActive = false;
		});

		this.registerKeyhandler();

		this.drawMenu();

        // Set the first menu as active
        this.itemOnActive(this.items[0]);
		return this;
	}

	drawMenu() {
		let navigationOffset = this.getTopOffset();

		if (this.options.title) {
			let topOffset = navigationOffset - 40;
			let text = this.game.add.text(this.getLeftOffset(), topOffset, this.options.title + ' ');
		    text.anchor.set(0.5);
		    text.align = 'center';
		    text.font = Config.font.title.font;
		    text.fontSize = 25 * this.fontScale;
		    text.fill = '#455c3d';
    		text.strokeThickness = 0;

    		this.items.push(text);
		}

		this.options.items.forEach((navItem,index) => {
			let topOffset = navigationOffset + index * 120 * this.heightScale;
            let text = this.game.add.text(this.getLeftOffset(), topOffset, navItem.label + ' ');
            text.inputEnabled = true;
		    text.anchor.set(0.5);
		    text.align = 'center';
		    text.font = Config.font.title.font;
		    text.fontSize = 80 * this.fontScale;
		    text.fill = '#e5b900';
		    text.stroke = '#504c39';
    		text.strokeThickness = 0;
    		text.index = index
			text.callback = navItem.callback
			text.events.onInputUp.add(text.callback)
    		text.events.onInputOver.add(_.bind(this.itemOnActive, this, text))

    		this.items.push(text);
		},this);
	}

	redraw(center = false){
		this.items.forEach((text) => {
            if (false === center) {
                text.x = this.getLeftOffset()
            } else {
                text.x = this.game.width * 0.5
            }

		})
	}

	getLeftOffset() {
		return Math.max(this.game.width*0.33, 300)
	}

	getTopOffset() {
		// Calculate in function of world height
		return 300 * this.heightScale
	}


	itemOnActive(item) {
        if(this.items[this.active] != item && null != this.active){
            this.itemOnInactive(this.items[this.active])
		}
		item.isActive = true
        item.strokeThickness = 6
		this.active = item.index
	}

	itemOnInactive(item) {
        item.isActive = false
        item.strokeThickness = 0
	}

	getNextIndex() {
		let activeIndex = this.getActiveIndex();
		return (activeIndex == this.items.length-1) ? 0 : activeIndex+1;
	}

	getPrevIndex() {
		let activeIndex = this.getActiveIndex();
		return activeIndex == 0 ? this.items.length-1 : activeIndex-1;
	}

	getActiveIndex() {
		return this.active || 0;
	}

	moveCursor(newIndex) {
        this.itemOnActive(this.items[newIndex]);
	}

	registerKeyhandler() {
		this.game.input.keyboard.onUpCallback = _.bind(function(e){
			if(e.keyCode == Phaser.Keyboard.UP) {
	  			this.moveCursor(this.getPrevIndex());
			}
			if(e.keyCode == Phaser.Keyboard.DOWN) {
	  			this.moveCursor(this.getNextIndex());
			}
			if(e.keyCode == Phaser.Keyboard.ENTER) {
                this.items[this.getActiveIndex()].callback()
			}
		},this);
	}

	destroy() {
		this.game.input.keyboard.reset();
		this.items.forEach(function(navItem, index){
			navItem.destroy();
		});
	}

}

export default Menu;