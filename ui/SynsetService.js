const SynsetService = ({ apiRoot }) => {

  const fetchJson = path => fetch(`${apiRoot}/api${path}`)
    .then(r => r.json())

  let tree

  return {
    tree: () => {
      if (tree)
        return Promise.resolve(tree)

      return fetchJson('/tree')
        .then(res => {
          tree = res
          return res
        })

    },
    search: ({ query }) => fetchJson(`/search?q=${query}`)
  }
}

export default SynsetService