export default options => async hook => {
  const computeProperties = async (item, options) => {
    await Promise.all(Object.keys(options).map(async property => {
      let fetch, properties

      if (Array.isArray(options[property])) {
        [fetch, properties] = options[property]
      } else {
        fetch = options[property]
      }

      try {
        item[property] = await fetch(item)
      } catch (e) {
        item[property] = null
        console.error(e)
        return
      }

      if (properties) {
        await computeResults(item[property], properties)
      }
    }))
  }

  const computeResults = (item, options) => {
    const items = Array.isArray(item.data) ? item.data : (Array.isArray(item) ? item : [item])

    return Promise.all(items.map(item => computeProperties(item, options)))
  }

  await computeResults(hook.result, options)

  return hook
}
