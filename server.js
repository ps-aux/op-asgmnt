const express = require('express')
const { mongo } = require('./db/mongo')

const app = express()

const _db = mongo()

const withDb = f => _db.then(f)

const assets = __dirname + '/build/public'

app.use(express.static(assets))
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.header('content-type', 'application/json')
    res.header('Access-Control-Allow-Origin', '*')
  }
  next()
})

app.get('/api/search',
  (req, res) => withDb(({ db }) => {
    const { q } = req.query
    db.collection('synset')
      .find({ name: { $regex: q } })
      .toArray()
      .then(items => {
        res.send(items)
      })
  }))

app.get('/api/tree',
  (req, res) => withDb(({ db }) =>
    db.collection('synset-tree')
      .findOne({})
      .then(tree => res.send(tree))))

app.get('*', (re, res) => {
  res.sendFile(assets + '/index.html')
})

const port = 3000
app.listen(port,
  () => console.log(`Listening on ${port}`))