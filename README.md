# feathers-hook-fetch

## Usage

Call the `fetch` hook with an object that describes the properties to be added to each result.

For each property, add a function returning a Promise that will eventually resolve with the data to be added.

For nested properties, use an array where the first item is the fetch function and the second item is a description of the nested properties.

### Populate a property with a single object

```js
const app = require('feathers')()
const fetch = require('feathers-hook-fetch')

service.hooks({
  after: {
    all: [
      // an object describing properties to fetch
      fetch({
        // arrow function that fetches the object
        _authorUser: post => app.service('users').get(post.author)
      })
    ]
  }
})
```

### Populate a nested property with a de-paginated query result

```js
const app = require('feathers')()
const fetch = require('feathers-hook-fetch')

service.hooks({
  after: {
    all: [
      // an object describing properties to fetch
      fetch({
        // an array
        _authorUser: [
          // 1. arrow function to fetch the object
          post => app.service('users').get(post.author),
          // 2. an object describing other properties to fetch
          {
            _userAddresses: user => app.service('addresses').find({
              query: { user: user._id, $sort: { createdAt: -1 } },
              paginate: false
            })
          }
        ]
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
    item._ownerUser = await app.service('users').get(item.owner)

    item._ownerUser._userAddresses = await app.service('addresses').find({
      // query: { id: { $in: item._ownerUser.addresses } },
      query: { user: item._ownerUser._id },
      paginate: false
    })
  }))

  return hook
}
```
