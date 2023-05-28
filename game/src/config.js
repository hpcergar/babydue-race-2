export default {
  resolutions: [
    {
      width: 1350,
      height: 900
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
    endAnimationVelocity: 20
  },
  localStorageName: 'phaseres6webpack',
  font: {
    webfonts: ['Bangers', 'Press Start 2P'],
    title: {font: 'Bangers'},
    text: {font: 'Press Start 2P', size: 14}
  },
  ui: {
    inactive_item_fill: '#5c9c27',
    inactive_item_stroke: '#2a2828',
    active_item_fill: '#e5b900',
    active_item_stroke: '#901616'
  },
  background: {
    color: '#ffffff'
  },
  assets: {
    prefixes: {
      main: 'assets/',
      image: 'images/',
      spritesheet: 'sprites/',
      'spritesheet-atlas-json': 'sprites/',
      tilemap: 'tilemaps/',
      'tilemap-json': 'tilemaps/'
    },
    list: {
      level: {
        type: 'tilemap-json',

        // source: ':scale/autumn/autumn.json' // TODO Clean up folder?
        source: ':scale/summer/summer.json'
      },
      'water-farground': {
        type: 'image',
        source: 'water-farground.png'
      },
      players: {
        type: 'spritesheet-atlas-json',
        source: 'spritesheet-optimized.png',
        map: 'sprites-optimized-json-tp-array.json'
      },
      'rock-explosion': {
        type: 'spritesheet-atlas-json',
        source: 'rock-spritesheet.png',
        map: 'rock-spritesheet-optimized-json-tp-array.json'
      },
      'black-pixel': {
        type: 'spritesheet',
        source: 'black-pixel.gif',
        width: 1,
        height: 1
      },
      door: {
        type: 'spritesheet',
        source: 'door.png',
        width: 64,
        height: 94
      },
      'aria-start-screen': {
        type: 'spritesheet',
        source: 'aria-start-screen.png',
        width: 344,
        height: 439
      },
      'julen-start-screen': {
        type: 'spritesheet',
        source: 'julen-start-screen.png',
        width: 320,
        height: 404
      },
      tick: {
        type: 'spritesheet',
        source: 'tick.gif',
        width: 64,
        height: 30
      }
    }
  },
  // TODO Unused
  groups: [
    'coins',
    'stars',
    'enemies',
    'players'
  ],
  api: {
    url: ''
  }
}
