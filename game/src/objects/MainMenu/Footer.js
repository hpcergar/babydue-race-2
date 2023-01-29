class Footer {

    constructor(game, world) {
        this.game = game;
        this.world = world;
        this.items = [];
        this.fontScale = this.game.attr.heightScale || 1;
        this.heightScale = this.game.attr.heightScale || 1;

        this.draw();

        return this;
    }

    draw() {

        // let firstLine = "C o p y r i g h t  ©  2 0 1 8  -  P a ú l  &  E l i  ";
        let firstLine = "Copyright © 2023 - Paúl & Eli";
        let footerHeight = this.getHeight()

        let graphics = this.game.add.graphics(0, 0);
        this.drawRectangle(graphics)
        this.rectangle = graphics

        this.items = []


        let firstLineText = this.game.add.text(this.game.width / 2, this.game.world.height - footerHeight + (30 * this.heightScale), firstLine);
        firstLineText.anchor.set(0.5);
        firstLineText.align = 'center';
        firstLineText.font = 'arcade';
        firstLineText.fontSize = 20 * this.fontScale;
        firstLineText.fill = '#FFFFFF';

        this.items.push(firstLineText)
    }

    getHeight() {
        // Calculate in function of world height
        return 60 * this.heightScale
    }

    drawRectangle(graphics) {
        let footerHeight = this.getHeight()
        graphics.beginFill(0xe5b900);
        graphics.lineStyle(2, 0xe5b900, 1);
        graphics.drawRect(0, this.game.world.height - footerHeight, this.game.width, footerHeight);
        graphics.endFill();
    }

    destroy() {
        this.items.forEach(function (navItem, index) {
            navItem.destroy();
        });
    }

}

export default Footer;