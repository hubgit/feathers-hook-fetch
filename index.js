export default function (options) {
  return async function (hook) {
    const computeProperties = async (item, options) => {
      await Promise.all(Object.keys(options).map(async property => {
        const { $fetch, ...propertyOptions } = options[property]

        try {
          item[property] = await $fetch.call(item, hook.app)
        } catch (e) {
          item[property] = null
          console.error(e)
          return
        }

        await computeResults(item[property], propertyOptions)
      }))
    }

    const computeResults = (item, options) => {
      const items = Array.isArray(item.data) ? item.data : (Array.isArray(item) ? item : [item])

      return Promise.all(items.map(item => computeProperties(item, options)))
    }

    await computeResults(hook.result, options)

    return hook
  }
}
