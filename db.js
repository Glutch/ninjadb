const low = require('lowdb')
const _ = require('underscore')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const os = require('os')

const dbPath = path.join(os.homedir(), '/.ninjadb')

const defaultSettings = {
  useId: false,
  crypt: false,
  electron: false,
  path: ''
}

exports.create = (name, _settings) => {
  const settings = Object.assign({}, defaultSettings, _settings)

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath)
  }

  const dir = settings.electron
    ? path.join(dbPath, settings.path)
    : path.join(__dirname, '../../', settings.path)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const db = low(path.join(dir, name) + '.json')

  db.defaults({ data: [] }).write()
  const coll = db.get('data')

  const push = item => {
    if (settings.useId) {
      item.id = uuid()
    }
    coll.push(item).write()
  }

  const insert = items => {
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

  return { push, insert, update, find, filter, remove, upsert }
}

exports.createKeyValueStore = name => {
  const db = low(name + '.json')
  db.defaults({data: [{}]}).write()
  const valueByKey = db.get('data').find({})

  const get = () => {
    return valueByKey.value()
  }

  const update = item => {
    valueByKey.assign(item).write()
  }

  const set = item => {
    const values = get()
    const undefinedByKey = Object.keys(values).reduce((prev, key) => {
      return Object.assign({}, prev, {[key]: undefined})
    }, {})
    update(undefinedByKey)
    update(item)
  }

  return { get, update, set }
}
