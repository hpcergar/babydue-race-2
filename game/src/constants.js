import Config from './config'

const JUMP = -550

export default {
    animations: {
        ANIMATION_STANDING: 'standing',
        ANIMATION_RUNNING: 'running',
    },
    characters: {
        CHARACTER_ARIA: 'playerAria',
        CHARACTER_JULEN: 'playerJulen',
    },
    mechanics: {
        GAME_VELOCITY: Config.player.gameVelocity,
        JUMP,
        JUMP_MECHANIC: 2 * JUMP,
        END_ANIMATION_VELOCITY: Config.player.endAnimationVelocity,
        INPUT_COOLDOWN: 500
    },
    slopes: {
        SLOPE_NONE: 0,
        SLOPE_ASCENDING: 1,
        SLOPE_DESCENDING: 2,
        SLOPE_TYPE_JUMP: 22,
        SLOPE_TYPE_SLOW: 20
    }
}