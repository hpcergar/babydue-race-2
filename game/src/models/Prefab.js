'use strict'

export default class {
  constructor (key, type, source, phaserEntity, data) {
    this.key = key
    this.type = type
    this.source = source
    this.entity = phaserEntity
    this._data = data
  }

  setChildren (children) {
    this.children = children
  }

  getEntity () {
    return this.entity
  }

  setEntity (entity) {
    this.entity = entity
  }

  getChildren () {
    return this.children
  }

  getData () {
    return this._data
  }

  setData (value) {
    this._data = value
  }
}
