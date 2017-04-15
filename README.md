# feathers-hook-fetch

## Usage

Call the `fetch` hook with an object that describes the properties to be added to each result.

For each property, add `$fetch`: a function returning a Promise that will eventually resolve with the data to be added.

### Populate a property with a single object

```js
const fetch = require('feathers-hook-fetch')

service.hooks({
  after: {
    all: [
      fetch({
        _owner: {
          $fetch: function (app) {
            return app.service('users').get(this.owner)
          }
        }
      })
    ]
  }
})
```

### Populate a nested property with a de-paginated query result

```js
const fetch = require('feathers-hook-fetch')

service.hooks({
  after: {
    all: [
      fetch({
        _owner: {
          $fetch: function (app) {
            return app.service('users').get(this.owner)
          },
          _addresses: {
            $fetch: function (app) {
              return app.service('addresses').find({
                query: {
                  _id: { $in: this.addresses },
                  $sort: { createdAt: -1 },
                },
                paginate: false
              })
            }
          }
        }
      })
    ]
  }
})
```

## Alternatives

```js
async hook => {
  const items = hook.method === 'find' ? hook.result.data || hook.result : [hook.result]

  await Promise.all(items.map(async item => {
    item._owner = await app.service('users').get(item.owner)

    item._owner._addresses = await app.service('addresses').find({
      query: { id: { $in: item._owner.addresses } },
      paginate: false
    })
  }))

  return hook
}
```
