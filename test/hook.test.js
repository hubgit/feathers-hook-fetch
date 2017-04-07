const fetch = require('../dist/index.js')

describe('hook', function () {
  it('should return a function', function () {
    const result = fetch({
      _ownerUser: {
        $fetch: function (app) {
          return app.service('users').get(this.owner)
        }
      }
    })

    expect(typeof result).toBe('function')
  })

  it('should update a result', function () {
    const result = {
      _id: 'test-item',
      title: 'Test',
      owner: 'user-1'
    }

    const users = {
      'user-1': {
        _id: 'user-1',
        name: 'Test User',
        addresses: ['address-1', 'address-2'],
        _userAddresses: null
      }
    }

    const hook = {
      result: result,
      app: {
        service: name => ({
          get: id => Promise.resolve(users[id])
        })
      }
    }

    return fetch({
      _ownerUser: {
        $fetch: function (app) {
          return app.service('users').get(this.owner)
        }
      }
    })(hook).then(() => {
      expect(hook.result._ownerUser).toEqual(users['user-1'])
    })
  })

  it('should update multiple results', function () {
    const result = {
      data: [
        {
          _id: 'item-1',
          title: 'Test',
          owner: 'user-1'
        },
        {
          _id: 'item-1',
          title: 'Test',
          owner: 'user-2'
        }
      ]
    }

    const users = {
      'user-1': {
        _id: 'user-1',
        name: 'Test User 1'
      },
      'user-2': {
        _id: 'user-2',
        name: 'Test User 2',
        addresses: ['address-1', 'address-2']
      }
    }

    const addresses = [
      {
        _id: 'address-1',
        location: 'Earth'
      },
      {
        _id: 'address-2',
        location: 'Mars'
      }
    ]

    const hook = {
      result: result,
      app: {
        service: name => ({
          get: id => Promise.resolve(users[id]),
          find: query => Promise.resolve({ data: addresses })
        })
      }
    }

    return fetch({
      _ownerUser: {
        $fetch: function (app) {
          return app.service('users').get(this.owner)
        },
        _userAddresses: {
          $fetch: function (app) {
            return app.service('addresses').find({
              _id: { $in: this.addresses },
              $sort: { createdAt: -1 },
              $limit: 5
            })
          }
        }
      }
    })(hook).then(() => {
      expect(hook.result.data[0]._ownerUser).toEqual(users['user-1'])
      expect(hook.result.data[1]._ownerUser).toEqual(users['user-2'])
    })
  })

  it('should continue if fetching a nested property fails', function () {
    const result = {
      _id: 'test-item',
      title: 'Test',
      owner: 'user-1'
    }

    const users = {
      'user-1': {
        _id: 'user-1',
        name: 'Test User',
        addresses: ['address-1', 'address-2'],
        _userAddresses: 'foo' // this should be replaced by "null"
      }
    }

    const hook = {
      result: result,
      app: {
        service: name => ({
          get: id => Promise.resolve(users[id])
        })
      }
    }

    return fetch({
      _ownerUser: {
        $fetch: function (app) {
          return app.service('users').get(this.owner)
        },
        _userAddresses: {
          $fetch: function (app) {
            return app.service('addresses').find({ _id: { $in: this.addresses } })
          }
        }
      }
    })(hook).then(() => {
      expect(hook.result._ownerUser._userAddresses).toBe(null)
    })
  })
})
