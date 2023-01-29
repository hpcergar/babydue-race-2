import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'
import AssetProvider from '../providers/Asset'

export default class extends Phaser.State {
    init() {
        this.stage.backgroundColor = '#000000'
        this.fontsReady = false
        this.fontsLoaded = this.fontsLoaded.bind(this)
    }

    preload() {
        if (config.font.webfonts.length) {
            WebFont.load({
                google: {
                    families: config.font.webfonts
                },
                active: this.fontsLoaded
            })
        }

        let text = this.add.text(this.world.centerX, this.world.centerY, this.game.translate('Loading...'), { font: '60px Arial', fill: '#dddddd', align: 'center' })
        text.anchor.setTo(0.5, 0.5)

        this.game.attr.assetProvider = new AssetProvider(this.game, config.scales.default, config.assets.prefixes)
    }

    render() {
        if ((config.font.webfonts.length && this.fontsReady) || !config.font.webfonts.length) {
            this.state.start('Splash')
        }
    }

    fontsLoaded() {
        this.fontsReady = true
    }
}