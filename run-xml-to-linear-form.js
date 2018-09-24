const fs = require('fs')
const { xmlToLinearForm } = require('./src/xml-to-linear-form')
const { mongo } = require('./db/mongo')

const inputFile = 'data/structure_released.xml'

xmlToLinearForm(fs.createReadStream(inputFile))
  .then(async data => {
    console.log(`inserting ${data.length} entries`)
    const { db, close } = await mongo()
    await db.collection('synset').insertMany(data)
    close()
  })

