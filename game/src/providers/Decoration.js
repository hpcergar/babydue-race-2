'use strict'

export default class {
  constructor (map, layerName, layer = undefined) {
    // ORDER Matters for layer objects!
    map.createFromObjects(layerName, 'Scarecrow', 'autumn-objects', 20, true, true, layer)
    map.createFromObjects(layerName, 'Tree', 'autumn-objects', 17, true, true, layer)
    map.createFromObjects(layerName, 'Tree-yellow', 'autumn-objects', 21, true, true, layer)
    map.createFromObjects(layerName, 'Directions-tower', 'autumn-objects', 14, true, true, layer)
    map.createFromObjects(layerName, 'End-tower', 'autumn-objects', 22, true, true, layer)
    map.createFromObjects(layerName, 'Mech-Jump', 'autumn-objects', 27, true, true, layer)
    map.createFromObjects(layerName, 'Mech-Slow', 'autumn-objects', 10, true, true, layer)
    map.createFromObjects(layerName, 'Door', 'autumn-objects', 4, true, true, layer)
    map.createFromObjects(layerName, 'DoorMask', 'autumn-objects', 29, true, true, layer)

    map.createFromObjects(layerName, 'Flower-yellow-small', 'autumn-objects', 13, true, true, layer)
    map.createFromObjects(layerName, 'Tree-florished', 'autumn-objects', 28, true, true, layer)
    map.createFromObjects(layerName, 'Tree-green-florished', 'autumn-objects', 34, true, true, layer)

    map.createFromObjects(layerName, 'Tile-white', 'autumn-objects', 6, true, true, layer)
    map.createFromObjects(layerName, 'Bunny', 'autumn-objects', 23, true, true, layer)
  }
}
