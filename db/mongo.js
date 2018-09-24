const { MongoClient } = require('mongodb')

const ENV_VAR_NAME = 'MONGO_CONNECTION_URL'

const url = process.env[ENV_VAR_NAME]

if (!url)
  throw new Error(`Missing ${ENV_VAR_NAME}`)

const dbName = url.match(/^.*\/(.*)$/)[1]

const mongo = () =>
  MongoClient.connect(url, { useNewUrlParser: true })
    .then(client => ({
      db: client.db(dbName),
      close: () => client.close()
    }))

module.exports.mongo = mongo


