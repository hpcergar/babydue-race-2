'use strict'
import phaserSlopes from 'phaserSlopes'

const GROUND_LAYER = 'Ground'

export default class {
  constructor (map, game) {
    // Add tilesets images (not objects nor sprite sheets)
    map.tilesets.forEach(t => {
      if (t.properties.length > 0) {
        let type = t.properties.find(p => p.name === 'type')
        if (type && type.value === 'image') {
          map.addTilesetImage(t.name, t.name)
        }
      }
    })

    // create map layers
    this.layers = {}
    map.layers.forEach(layer => {
      this.layers[layer.name] = map.createLayer(layer.name)

      // TODO Debug
      // this.layers[layer.name].debug = true

      let properties = undefined !== layer.properties.length ? layer.properties : []
      properties.forEach(p => {
        if (p.name === 'main' && p.value === true) {
          this.mainLayer = layer.name
        }

        if (p.name === 'collision' && p.value === true) {
          let collision_tiles = []
          let firstGid = properties.find(subp => subp.name === 'firstGid')
          layer.data.forEach(data_row => { // find tiles used in the layer
            data_row.forEach(tile => {
              // check if it's a valid tile index and isn't already in the list
              if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                collision_tiles.push(tile.index)
              }
            })
          })
          map.setCollision(collision_tiles, true, layer.name)

          game.slopes.convertTilemapLayer(this.layers[layer.name], 'ninja', firstGid ? firstGid.value : undefined)
          this.layers[layer.name].visible = false
        }
      })
    })

    // Set world bounds to main layer
    if (this.mainLayer !== undefined) {
      this.layers[this.mainLayer].resizeWorld()
    }
  }

  getLayers () {
    return this.layers
  }

  getMainLayer () {
    return this.layers[this.mainLayer]
  }

  getGroundLayer () {
    return this.layers[GROUND_LAYER]
  }
}
