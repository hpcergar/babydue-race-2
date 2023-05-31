import Constants from "../../constants";

export class Transition {
    sprite;

    constructor (game) {
        // Starts
        this.game = game
        this.sprite = game.add.sprite(0, 0, 'players')
        this.sprite.visible = false
        this.sprite.characterName = Constants.characters.CHARACTER_JULEN
        this.sprite.animations.add(
            Constants.animations.ANIMATION_DASH,
            ['julen-dash-1'],
            5,
            true
        );
        this.sprite.animations.play(Constants.animations.ANIMATION_DASH)
        this.sprite.tint = 0x85a7d6
        this.sprite.scale.x = this.sprite.scale.y = 1.1
    }

    run (startPosition, endPosition) {
        this.sprite.visible = true
        this.sprite.position.x = startPosition.x
        this.sprite.position.y = startPosition.y - 15
        let tween = this.game.add.tween(this.sprite).to({
            x: endPosition.x + 20,
            y: endPosition.y - 15
        }, 100, Phaser.Easing.Quadratic.InOut)

        tween.onComplete.addOnce(() => {
            this.sprite.visible = false
        })

        tween.start()
    }
}
