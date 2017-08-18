const low = require('lowdb')
const _   = require('underscore')
const uuid = require('uuid')

exports.create = name => {
  let _id = false
  const db = low(name + '.json')
  const dbname = 'data'
  db.defaults({ data: [] }).write()
  
  const options = settings => {
    _id = settings.id
  }

  const push = data => {
    if(_id) data.id = uuid()
    db.get(dbname).push(data).write()
  }

  const update = (target, data) => {
    if(_id) data.id = uuid()
    db.get(dbname).find(target).assign(data).write()
  }

  const find = target => {
    return db.get(dbname).find(target).value()
  }

  const remove = target => {
    db.get(dbname).remove(target).write()
  }
  
  const upsert = (target, data) => {
    if(!find(target)){
      push(data)
    } else {
      update(target, data)
    }
  }

  return { push, update, find, remove, upsert, options }
}