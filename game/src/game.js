import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import MainMenuState from './states/MainMenu'
import GameState from './states/Game'
import GameStartTransitionState from './states/GameStartTransition'
import HighScoresState from './states/HighScores'
import PollsState from './states/Polls'
import {calculateAttr} from './utils'
import Messages from './translations/messages'

import config from './config'

export class Game extends Phaser.Game {
    constructor(options) {

        let attr = calculateAttr(config.resolutions);


        // super(attr.width, attr.height, Phaser.CANVAS)
        // Test for overlay full screen
        super(window.innerWidth, window.innerHeight, Phaser.CANVAS, '', null, false, false)

        this.attr = _.extend(attr, options)
        this.attr.translator = new Messages(options.lang)

        this.state.add('Boot', BootState, false)
        this.state.add('Splash', SplashState, false)
        this.state.add('MainMenu', MainMenuState, false)
        this.state.add('Game', GameState, false)
        this.state.add('GameStartTransition', GameStartTransitionState, false)
        this.state.add('HighScores', HighScoresState, false)
        this.state.add('Polls', PollsState, false)

        // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
        this.state.start('Boot')
    }


      translate(msg) {
        return this.attr.translator.translate(msg)
    }
}

