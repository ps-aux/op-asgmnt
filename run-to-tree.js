const { toTree } = require('./src/to-tree')
const { mongo } = require('./db/mongo')

const visit = (n, onVisit) => {
  onVisit(n)
  n.children.forEach(c => visit(c, onVisit))
}

const storeTree = (root, db) => {
  visit(root, c => {
    delete c._childrenMap
  })
  return db.collection('synset-tree').insertOne(root)
}

mongo().then(({ db, close }) =>
  toTree(db.collection('synset').find())
    .then(root => storeTree(root, db))
    .then(close))

