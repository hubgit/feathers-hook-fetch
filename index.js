const debug = require('debug')('feathers-hook-fetch')

export default function (options) {
  return function (hook) {
    // return a promise that resolves to the hook
    return computeResults(hook.result, options).then(result => {
      hook.result = result
      return hook
    })

    // returns a promise that resolves to an item (or array of items)
    function computeResults (item, options) {
      // an object with paginated items
      if (Array.isArray(item.data)) {
        // process each item concurrently
        return Promise.all(item.data.map(item => {
          return computeProperties(item, options)
        }))
      }

      // a single item
      return computeProperties(item, options)
    }

    // returns a promise that resolves to the item
    function computeProperties (item, options) {
      const properties = Object.keys(options)

      // process each property
      properties.forEach(async property => {
        const propertyOptions = options[property]

        let data = await fetchProperty(propertyOptions.$fetch, item)

        delete propertyOptions.$fetch

        if (data !== null) {
          data = await computeResults(data, propertyOptions)
        }

        item[property] = data
      })

      return Promise.resolve(item)
    }

    // returns a promise that resolves to the data
    function fetchProperty (fetcher, item) {
      try {
        return fetcher.call(item, hook.app)
      } catch (e) {
        // console.error(e)
        debug(e)
        return Promise.resolve(null)
      }
    }
  }
}