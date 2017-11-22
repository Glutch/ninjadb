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

  const filter = target => {
    return coll.filter(target).value()
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

  return {push, insert, update, find, filter, remove, upsert}
}

exports.createKeyValueStore = (name) => {
  const db = low(name + '.json')
  db.defaults({data: [{}]}).write()
  const valueByKey = db.get('data').find({})

  const get = () => {
    return valueByKey.value()
  }

  const update = (item) => {
    valueByKey.assign(item).write()
  }

  const set = (item) => {
    const values = get()
    const undefinedByKey = Object.keys(values).reduce((prev, key) => {
      return Object.assign({}, prev, {[key]: undefined})
    }, {})
    update(undefinedByKey)
    update(item)
  }

  return {get, update, set}
}
