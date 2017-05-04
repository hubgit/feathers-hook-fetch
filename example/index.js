const feathers = require('feathers')
const hooks = require('feathers-hooks')
const memory = require('feathers-memory')
const fetch = require('../lib')

const app = feathers().configure(hooks())

const setup = async () => {
  const paginate = {
    default: 10,
    max: 20
  }

  // addresses
  app.use('addresses', memory({ paginate }))
  const addresses = app.service('addresses')

  await addresses.create([
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

  await users.create([
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

  await articles.create([
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
          _owner: [
            article => app.service('users').get(article.owner),
            {
              _addresses: user => app.service('addresses').find({
                query: { id: { $in: user.addresses } },
                paginate: false
              })
            }
          ]
        })
      ]
    }
  })

  return articles
}

setup().then((articles) => {
  articles.find().then(items => {
    console.log(JSON.stringify(items, null, 2))
  })
})
