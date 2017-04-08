# feathers-hook-fetch

## Usage

Call the `fetch` hook with an object that describes the properties to be added to each result.

For each property, add a `$fetch` property that is a function returning a Promise that will eventually resolve with the data to be added.

### Populate a property with a single object

```js
const fetch = require('feathers-hook-fetch')

service.hooks({
  after: {
    all: [
      fetch({
        ownerUser: {
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
        ownerUser: {
          $fetch: function (app) {
            return app.service('users').get(this.owner)
          },
          addresses: {
            $fetch: function (app) {
              return app.service('addresses').find({
                paginate: false,
                query: {
                  _id: { $in: this.addresses },
                  $sort: { createdAt: -1 },
                }
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

If you just want to populate a single property, you could use a custom hook like this:

```js
async hook => {
  const items = hook.method === 'find' ? hook.result.data || hook.result : [hook.result]

  await Promise.all(items.map(async item => {
    item.contacts = await app.service('contacts').find({
      query: { parentId: item.id },
      paginate: false
    })
  }))

  return hook
}
```
