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

### Populate a nested property with a paginated query result

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
              app.service('addresses').find({
                _id: { $in: this.addresses },
                $sort: { createdAt: -1 },
                $limit: 5
              })
            }
          }
        }
      })
    ]
  }
})
```
