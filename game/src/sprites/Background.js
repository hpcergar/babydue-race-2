'use strict';

export default class {
    constructor(game, map) {
        this.game = game
        this.game.stage.backgroundColor = '#db4e16';
        this.backgroundTilesprite = this.game.add.sprite(0, -200, 'background');
        this.backgroundTilesprite.width = 1350;
        this.backgroundTilesprite.height = 900;

        this.backgroundTilesprite.fixedToCamera = true
    }

    update() {
        // Simulate parallax
        // this.backgroundTilesprite.tilePosition.set(this.game.camera.x * -0.5, 0)
    }
}