## ninjadb, a super simple json database

### a wrapper for lowdb to make it easier. For use in tiny projects.


install
```
npm install ninjadb --save
```

usage
```
const ninjadb = require('ninjadb')
const users = ninjadb.create('users')

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

users.find({ name: 'ninja' })

//you can also activate id's with
users.options({ id: true })
```