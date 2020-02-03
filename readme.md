## ninjadb, a super simple json database

#### ninjadb is a wrapper for lowdb to make it easier. For use in tiny projects.


## install
```
npm install ninjadb
```

## usage
```javascript
const ninjadb = require('ninjadb')
const users = ninjadb.create('users.json')

users.push({
  name: 'ninja',
  pass: 'example'
})

users.remove({
  name: 'ninja'
})

users.update({
  name: 'ninja'
},{
  name: 'hello'
})

users.upsert({
  name: 'ninja'
},{
  name: 'ninja',
  pass: 'example'
})

users.find({ name: 'ninja' }) // one ninja

users.filter({ name: 'ninja' }) // all ninjas

//option: enable ids
const users = ninjadb.create('users', {useId: true})

//optional: store your data in another location
const users = ninjadb.create('../data/users.json')
```
