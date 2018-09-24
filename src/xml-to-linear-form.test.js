import { xmlToLinearForm } from './xml-to-linear-form'

const fs = require('fs')

const inputFile = 'data/test-xml.xml'

it('xml parsed to linear form properly', async () => {
  const data = await xmlToLinearForm(fs.createReadStream(inputFile))
  expect(data).toMatchObject(
    [{ name: 'a', size: 5 },
      { name: 'a > b0', size: 3 },
      { name: 'a > b0 > c0', size: 1 },
      { name: 'a > b0 > c0 > d', size: 0 },
      { name: 'a > b0 > c1', size: 0 },
      { name: 'a > b1', size: 0 }]
  )
})
