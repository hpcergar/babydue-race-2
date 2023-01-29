import Input from '../services/Input'
import Points from '../services/Points'
import Config from '../config'

const ANIMATION_STANDING = 'standing'
const ANIMATION_RUNNING = 'running'

const GAME_VELOCITY = Config.player.gameVelocity
const GRAVITY = 1000
const JUMP = -550
const JUMP_MECHANIC = 2 * JUMP
const END_ANIMATION_VELOCITY = Config.player.endAnimationVelocity

const SLOPE_NONE = 0
const SLOPE_ASCENDING = 1
const SLOPE_DESCENDING = 2

const SLOPE_TYPE_JUMP = 22
const SLOPE_TYPE_SLOW = 20

export default class {
    constructor (game, debug = false) {
        // Starts
        this.game = game
        
        // STATES
        this.isPlayable = false
        this.debug = debug

        this.input = new Input(this.game)
        this.points = new Points(this.game)

        // Game key points
        const [startX, startY] = this.debug ? this.points.getDebugPoint() : this.points.getStartPoint()
        // this.debug = false // TODO Remove
        console.log(startX)
        const [endX, endY] = this.points.getEndPoint()
        const [speedUpX, speedUpY] = this.points.getSpeedUpPoint()

        this.endX = endX
        this.speedUpX = speedUpX

        //Add the sprite to the game and enable arcade physics on it
        this.player = this.game.add.sprite(startX, startY, 'player');
        this.game.physics.arcade.enable(this.player);
        // Make the camera follow the sprite
        // TODO Use if we manage to solve too much starting Y offset in mobiles
        // this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
        this.game.camera.follow(this.player);

        // PHYSICS
        // Set gravity center in the middle
        this.player.anchor.x = 0.4;
        this.player.anchor.y = 0.25;
        this.player.body.setSize(40, 64, 6, 0)
        // Little jump after a big jump
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = GRAVITY;
        this.velocity = GAME_VELOCITY;
        this.speedUp = false;
        // Start stopped
        this.player.body.velocity.x = 0;

        // this.game.debug.bodyInfo(this.player, 32, 32);
        // this.game.debug.body(this.player);
        // this.game.debug.reset();

        // ANIMATIONS
        this.player.animations.add(ANIMATION_RUNNING, [0,1,2,3,0,1,2,3,0,1,2,3,4,1,2,3], 5, true)
        this.player.animations.add(ANIMATION_STANDING,[0,0,0,0,0,0,0,0,0,0,0,0,4], 5, true)
        this.player.animations.play(ANIMATION_STANDING);
        this.lookingRight = true;

        // SLOPES
        // Enable slopes collision on this player
        this.game.slopes.enable(this.player);
        this.player.body.slopes.preferY = true;
        this.player.body.slopes.pullDown = GRAVITY / 2;
        this.player.slopeId = false

        // CONTROLS
        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    getObject() {
        return this.player;
    }

    update (hitting) {
        if(this.isPlayable){
            this.updatePlaying(hitting)  
        } 
    }

    updatePlaying (hitting) {

        // this.game.debug.bodyInfo(this.player, 32, 32);
        // this.game.debug.body(this.player);
        // this.game.debug.reset();

        // Speed up if beyond point
        if(false === this.speedUp && this.isBeyondSpeedUpPoint()){
            this.speedUp = true
            this.velocity = 1.5 * GAME_VELOCITY
        }

        let wasStanding = this.player.body.velocity.x === 0

        if(this.debug){
            this.player.body.velocity.x = 0;
        }

        let hittingGround = hitting && this.player.body.touching.down,
            slopeUpFactor

        // Disable last jump bug on slopes
        if(hitting && this.player.slopeId){
            // Only on ascending, to avoid jumping on descending
            this.player.body.velocity.y = this.player.body.velocity.y >= 0
                ? this.player.body.velocity.y
                : 0;
        }

        // Rotation, acceleration, etc.
        this.adaptOnSlope(this.player.slopeId)

        // If on the ground, allow jump or mechanic: jump
        if(hittingGround){
            // Mechanic: jump (boing!)
            if(this.player.slopeId === SLOPE_TYPE_JUMP){
                this.player.body.velocity.y = JUMP_MECHANIC
                this.vibrate()
            }
            // Jump
            else
                if (this.input.isDown())
            {
                this.player.body.velocity.y = this.inclination === SLOPE_ASCENDING ? JUMP - 100
                    : this.inclination === SLOPE_DESCENDING ? JUMP + 550
                        : JUMP
            }
        }

        //
        slopeUpFactor = this.slopeUpFactor(this.player.slopeId, this.player.body.velocity.y)


        if(this.isPlayable && false === this.debug){
            this.player.body.velocity.x = this.velocity - slopeUpFactor;
        }

        // Manual debug
        if (this.cursors.left.isDown && this.debug)
        {
            if(this.lookingRight) {  this.player.scale.x *= -1;  this.lookingRight = false;}
            this.player.body.velocity.x = -this.velocity + slopeUpFactor;
        }
        else if (this.cursors.right.isDown && this.debug)
        {
            if(!this.lookingRight) {  this.player.scale.x *= -1;  this.lookingRight = true;}
            this.player.body.velocity.x = this.velocity - slopeUpFactor;
        }

        // Mechanic: drag
        if(this.player.slopeId === SLOPE_TYPE_SLOW && this.player.body.velocity.x !== 0){
            this.player.body.velocity.x = (this.player.body.velocity.x >= 0 ? 1 : -1) * (this.velocity / 8)
            this.vibrate()
        }

        // Animations
        if(wasStanding && this.player.body.velocity.x !== 0) {
            this.player.animations.play(ANIMATION_RUNNING)
        } else if (!wasStanding && this.player.body.velocity.x === 0){
            this.player.animations.play(ANIMATION_STANDING)
        }
    }

    run() {
        this.isPlayable = true
        this.player.body.velocity.x = this.velocity;
    }

    vibrate() {
        // Vibration
        // if("vibrate" in window.navigator) {
        //     window.navigator.vibrate(100);
        // }
    }

    setCollisionData(ground) {
        if (ground.slope && ground.slope.type > 0) {
            this.player.slopeId = ground.slope.type
        } else {
            this.player.slopeId = false
        }
    }

    /**
     *
     * @param isOnSlope
     * @param y
     * @returns {number}
     */
    slopeUpFactor(isOnSlope, y){
        return (isOnSlope && y < 0) ? 100 : 0
    }

    /**
     * Adapt angle on slope
     * @param slopeId
     */
    adaptOnSlope(slopeId) {
        // Rotation
        switch(slopeId) {
            case 1:
                this.inclination = SLOPE_DESCENDING
                this.player.angle = 45;
                break;
            case 2:
                this.inclination = SLOPE_ASCENDING
                this.player.angle = -45;
                break;
            // Mechanic jump
            default:
                this.inclination = SLOPE_NONE
                if(this.player.angle !== 0) {
                    this.player.angle = 0
                }
        }
    }

    isBeyondSpeedUpPoint() {
        return this.player.position.x >= this.speedUpX
    }

    isBeyondEndPoint() {
        return this.player.position.x >= this.endX
    }

    startEndAnimation() {
        this.isPlayable = false
        this.player.body.velocity.x = END_ANIMATION_VELOCITY
        this.player.animations.play(ANIMATION_RUNNING)
    }

    goToPoint(name, callback = undefined) {
        const [pointX, pointY] = this.points.getPoint(name)
        let tween = this.game.add.tween(this.player).to({
            x: pointX,
            y: this.player.position.y
        }, 750, Phaser.Easing.Quadratic.InOut);

        if(callback){
            tween.onComplete.addOnce(callback)
        }
        tween.start();

    }

}