'use strict'

export default class {
  constructor (map, layerName, layer = undefined) {
    // ORDER Matters for layer objects!
    map.createFromObjects(layerName, 'Star-deco', 'autumn-objects', 2, true, true, layer)
    map.createFromObjects(layerName, 'Sea-shell-deco', 'autumn-objects', 3, true, true, layer)
    map.createFromObjects(layerName, 'Reef-deco', 'autumn-objects', 9, true, true, layer)
    map.createFromObjects(layerName, 'Tree', 'autumn-objects', 17, true, true, layer)
    map.createFromObjects(layerName, 'Tree-yellow', 'autumn-objects', 21, true, true, layer)
    map.createFromObjects(layerName, 'Palm-tree', 'autumn-objects', 0, true, true, layer)
    map.createFromObjects(layerName, 'Directions-tower', 'autumn-objects', 14, true, true, layer)
    map.createFromObjects(layerName, 'End-tower', 'autumn-objects', 22, true, true, layer)
    map.createFromObjects(layerName, 'Mech-Jump', 'autumn-objects', 27, true, true, layer)
    map.createFromObjects(layerName, 'Mech-Slow', 'autumn-objects', 10, true, true, layer)
    map.createFromObjects(layerName, 'Mech-Fast', 'autumn-objects', 30, true, true, layer)
    map.createFromObjects(layerName, 'Mech-Rock', 'autumn-objects', 26, true, true, layer)
    map.createFromObjects(layerName, 'Door', 'autumn-objects', 4, true, true, layer)
    map.createFromObjects(layerName, 'DoorMask', 'autumn-objects', 29, true, true, layer)

    map.createFromObjects(layerName, 'Flower-yellow-small', 'autumn-objects', 13, true, true, layer)
    map.createFromObjects(layerName, 'Tree-florished', 'autumn-objects', 28, true, true, layer)
    map.createFromObjects(layerName, 'Tree-green-florished', 'autumn-objects', 34, true, true, layer)
    map.createFromObjects(layerName, 'Sign', 'autumn-objects', 15, true, true, layer)

    map.createFromObjects(layerName, 'Tile-white', 'autumn-objects', 6, true, true, layer)
    map.createFromObjects(layerName, 'Bunny', 'autumn-objects', 23, true, true, layer)
  }
}
