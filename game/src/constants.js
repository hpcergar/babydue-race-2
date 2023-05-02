import Config from './config'

const JUMP = -650

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
        INPUT_COOLDOWN: 200
    },
    slopes: {
        SLOPE_NONE: 0,
        SLOPE_ASCENDING: 1,
        SLOPE_DESCENDING: 2,
        SLOPE_TYPE_JUMP: 22,    // HALF_TOP
        SLOPE_TYPE_ROCK: 19,    // QUARTER_TOP_RIGHT_LOW
        SLOPE_TYPE_SLOW: 20,    // QUARTER_TOP_RIGHT_HIGH
        SLOPE_TYPE_FAST: 18     // QUARTER_TOP_LEFT_HIGH

        /**
         * To know which ID goes here, check the arcade slopes Phaser.Plugin.ArcadeSlopes.TileSlope.typeNames
         * and compare it to the Ninja physics debug sheet image
         *
         * Phaser.Plugin.ArcadeSlopes.TileSlopeFactory.prototype.convertTilemapLayer uses an offset - firstGid (in this game we use 26)
         * to define the Ninja mapping:
         *
         *    mapping[offset + 2] =  'FULL';
         *    mapping[offset + 3] =  'HALF_BOTTOM_LEFT';
         *    mapping[offset + 4] =  'HALF_BOTTOM_RIGHT';
         *    mapping[offset + 6] =  'HALF_TOP_LEFT';
         *    mapping[offset + 5] =  'HALF_TOP_RIGHT';
         *          // Notice there are 10 missing! all the "rounded" tiles are not handled, avoid them!
         *    mapping[offset + 15] = 'QUARTER_BOTTOM_LEFT_LOW';
         *    mapping[offset + 16] = 'QUARTER_BOTTOM_RIGHT_LOW';
         *    mapping[offset + 17] = 'QUARTER_TOP_RIGHT_LOW';
         *    mapping[offset + 18] = 'QUARTER_TOP_LEFT_LOW';
         *    mapping[offset + 19] = 'QUARTER_BOTTOM_LEFT_HIGH';
         *    mapping[offset + 20] = 'QUARTER_BOTTOM_RIGHT_HIGH';
         *    mapping[offset + 21] = 'QUARTER_TOP_RIGHT_HIGH';
         *    mapping[offset + 22] = 'QUARTER_TOP_LEFT_HIGH';
         *    mapping[offset + 23] = 'QUARTER_LEFT_BOTTOM_HIGH';
         *    mapping[offset + 24] = 'QUARTER_RIGHT_BOTTOM_HIGH';
         *    mapping[offset + 25] = 'QUARTER_RIGHT_TOP_LOW';
         *    mapping[offset + 26] = 'QUARTER_LEFT_TOP_LOW';
         *    mapping[offset + 27] = 'QUARTER_LEFT_BOTTOM_LOW';
         *    mapping[offset + 28] = 'QUARTER_RIGHT_BOTTOM_LOW';
         *    mapping[offset + 29] = 'QUARTER_RIGHT_TOP_HIGH';
         *    mapping[offset + 30] = 'QUARTER_LEFT_TOP_HIGH';
         *    mapping[offset + 31] = 'HALF_BOTTOM';
         *    mapping[offset + 32] = 'HALF_RIGHT';
         *    mapping[offset + 33] = 'HALF_TOP';
         *    mapping[offset + 34] = 'HALF_LEFT';
         *
         *    These match the ID in the ninja collision tilemap ID + 1. Example: HALF_TOP has ID=32 in Tiled
         *
         *    Then, search for the constant Phaser.Plugin.ArcadeSlopes.TileSlope.[MyConstant], to get the value that
         *    must be filled in the constants
         *      Example: Phaser.Plugin.ArcadeSlopes.TileSlope.HALF_TOP = 22
         */
    }
}