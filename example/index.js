const feathers = require('feathers')
const hooks = require('feathers-hooks')
const memory = require('feathers-memory')
const fetch = require('../dist')

const app = feathers().configure(hooks())

const paginate = {
  default: 10,
  max: 20
}

// addresses
app.use('addresses', memory({ paginate }))
const addresses = app.service('addresses')

addresses.create([
  {
    id: 'address-1',
    name: 'Address One'
  },
  {
    id: 'address-2',
    name: 'Address Two'
  },
  {
    id: 'address-3',
    name: 'Address Three'
  }
])

// users
app.use('users', memory({ paginate }))
const users = app.service('users')

users.create([
  {
    id: 'user-1',
    name: 'User One',
    addresses: ['address-1', 'address-2']
  },
  {
    id: 'user-2',
    name: 'User Two',
    addresses: ['address-1']
  }
])

// articles
app.use('articles', memory({ paginate }))
const articles = app.service('articles')

articles.create([
  {
    id: 'article-1',
    name: 'Article 1',
    owner: 'user-1'
  },
  {
    id: 'article-2',
    name: 'Article 2',
    owner: 'user-2'
  }
])

// hooks
articles.hooks({
  after: {
    all: [
      fetch({
        ownerUser: {
          $fetch: function (app) {
            return app.service('users').get(this.owner)
          },
          userAddresses: {
            $fetch: function (app) {
              return app.service('addresses').find({
                paginate: false,
                query: {
                  id: { $in: this.addresses }
                }
              })
            }
          }
        }
      })
    ]
  }
})

articles.find().then(items => {
  console.log(JSON.stringify(items, null, 2))
})
