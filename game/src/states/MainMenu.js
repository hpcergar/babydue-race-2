import Menu from '../objects/MainMenu/Menu'
import Header from '../objects/MainMenu/Header'
import Footer from '../objects/MainMenu/Footer'
import _ from 'lodash'
import Config from "../config";
import {scaleSprite} from "../utils";
import HighscoresService from "../services/HighscoresService";
import Scale from "../services/Scale";

const MIN_WIDTH = Config.resolutions[0].width // TODO Use according resolution instead of [0]
const MIN_HEIGHT = Config.resolutions[0].height

export default class extends Phaser.State {

    preload() {
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        this.game.renderer.renderSession.roundPixels = true
        this.scaleService = new Scale(this.game, {minScaleFactor:0.4})
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.align(true, true);
        this.scale.setResizeCallback(this.onResize, this);
        this.scale.refresh();

        // Set the game background colour
        this.game.stage.backgroundColor = Config.background.color;
        // this.fontScale = this.game.attr.heightScale || 1;
        this.fontScale = 1;

        this.highscoresService = new HighscoresService()
        let canVote = !!this.highscoresService.getUserScore()

        this.header = new Header(this.game, this.world)
        // this.footer = new Footer(this.game, this.world)

        this.object = this.game.add.sprite(Math.max(this.game.width - 800, 500), this.game.camera.y + 50, "aria-start-screen");
        this.object.width = 480
        this.object.height = 491
        // scaleSprite(this.object, this.game.width, this.game.height * 4 / 5, 50, this.fontScale);


        console.log(this.game.width, this.game.height * 2 / 3)
        console.log(this.game.attr.heightScale)
        let mainMenuOptions = {
            'items' : [
                {
                    'label'    : this.game.translate('Play & Vote')
                    ,'callback': _.bind(this.startGame,this)
                }
                ,{
                    'label'    : this.game.translate('High scores')
                    ,'callback': _.bind(this.showHighScores,this)
                }
            ]
        }

        // Add link to votes if can vote (has already played once)
        if(canVote) {
            mainMenuOptions.items.push({
                'label'    : this.game.translate('See polls')
                ,'callback': _.bind(this.showPolls,this)
            })
        }

        this.mainMenu = new Menu(mainMenuOptions, this.game, this.world);

        // Full screen
        this.game.input.onTap.add(this.scaleService.goFullScreen, this.scaleService);
    }

    /**
     *
     * @param scaleManager
     * @param parentBounds
     * @param force
     */
    onResize(scaleManager, parentBounds, force = false) {
        this.scaleService.resize(scaleManager, parentBounds, force, (width, height) => {
            const [menuX, menuY, menuWidth, menuHeight] = this.header.getPosition()
            // this.object.x = Math.max(menuX + menuWidth - 100, 300)
            this.object.x = Math.max(width - 650, 500)
            console.log('resize width', this.mainMenu.getLeftOffset() + menuWidth + this.object.width, width, this.scaleService.scaleFactor.scale)
            // let offsetY = 0
            if(this.mainMenu.getLeftOffset() + menuWidth + this.object.width - 100 > width) {
                this.object.visible = false
            } else {
                this.object.visible = true
                // offsetY = (height - this.object.height - this.object.y - 100) * 0.5
                // console.log('offsetY', offsetY)
                // if(offsetY < 0){
                //     offsetY = 0
                // }
            }

            this.header.redraw(!this.object.visible)
            this.mainMenu.redraw(!this.object.visible)
        })
    }


    startGame() {
        this.state.start('GameStartTransition')
    }

    showHighScores() {
        this.state.start('HighScores')
    }

    showPolls() {
        this.state.start('Polls')
    }
}