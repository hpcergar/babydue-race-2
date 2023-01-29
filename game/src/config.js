export default {
    resolutions: [
        // {
        //     width: 960,
        //     height: 640,
        // },
        {
            width: 1350,
            height: 900,
        }
    ],
    scales: {
        list: [
            64,
            128
        ],
        default: 64,
        minScaleFactor: 0.6
    },
    player: {
        // gameVelocity: 400, // For more interesting game ¬¬'
        gameVelocity: 320,
        endAnimationVelocity: 20,
    },
    localStorageName: 'phaseres6webpack',
    font: {
        webfonts: ['Bangers', 'Press Start 2P'],
        title: {font: 'Bangers'},
        text: {font: 'Press Start 2P', size: 14}
    },

    background: {
        color: '#ffffff'
    },
    assets: {
        prefixes: {
            main:"assets/",
            spritesheet: "sprites/",
            tilemap: "tilemaps/",
            "tilemap-json": "tilemaps/",
        },
        list: {
            level: {
                type: "tilemap-json",

                source: ":scale/autumn/autumn.json"
                // Debug: Undo switch back
                // source: ":scale/autumn/autumn-sandbox.json"
            },
            player: {
                type: "spritesheet",
                source: "aria.png",
                width: 64,
                height: 64,
            },
            "black-pixel": {
                type: "spritesheet",
                source: "black-pixel.gif",
                width: 1,
                height: 1,
            },
            door: {
                type: "spritesheet",
                source: "door.png",
                width: 64,
                height: 94,
            },
            "aria-start-screen": {
                type: "spritesheet",
                source: "aria-start-screen.png",
                width: 525,
                height: 537,
            },
            tick: {
                type: "spritesheet",
                source: "tick.gif",
                width: 64,
                height: 30,
            }
        }
    },
    // TODO Unused
    groups:[
        'coins',
        'stars',
        'enemies',
        'players'
    ],
    api: {
        url: ''
    }
}
