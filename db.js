const low = require('lowdb')
const _   = require('underscore')
const uuid = require('uuid')

const defaultSettings = {
  useId: false,
  crypt: false
}

exports.create = (name, _settings) => {
  const db = low(name + '.json')
  db.defaults({ data: [] }).write()
  const coll = db.get('data')

  const settings = Object.assign({}, defaultSettings, _settings)

  const push = (item) => {
    if (settings.useId) {
      item.id = uuid()
    }
    coll.push(item).write()
  }

  const insert = (items) => {
    items.forEach(push)
  }

  const update = (target, item) => {
    coll.find(target).assign(item).write()
  }

  const find = target => {
    if(!target) return coll.value()
    return coll.find(target).value()
  }

  const remove = target => {
    coll.remove(target).write()
  }

  const upsert = (target, item) => {
    if(!find(target)){
      push(item)
    } else {
      update(target, item)
    }
  }

  return {push, insert, update, find, remove, upsert}
}
