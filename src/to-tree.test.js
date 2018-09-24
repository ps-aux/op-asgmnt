import { toTree } from './to-tree'

const data = [
  {
    name: 'a',
    size: 1
  },
  {
    name: 'a > b0',
    size: 2
  },
  {
    name: 'a > b0 > c0',
    size: 3
  },
  {
    name: 'a > b0 > c1',
    size: 4
  },
  {
    name: 'a > b0 > c1 > d0',
    size: 5
  },
  {
    name: 'a > b1',
    size: 6
  },
]

const cursor = items => ({
  forEach: cb => new Promise(res => {
    items.forEach((i, idx) => {
      cb(i)
      if (idx === items.length - 1) {
        res()
      }
    })
  })
})

it('create tree', async () => {
  const res = await toTree(cursor(data))
  expect(res).toMatchObject({
    name: 'a',
    size: 1,
    children: [{
      name: 'b0',
      size: 2,
      children: [{
        name: 'c0',
        size: 3,
        children: []
      },
        {
          name: 'c1',
          size: 4,
          children: [
            {
              name: 'd0',
              size: 5,
              children: []
            }
          ]
        }]
    },
      {
        name: 'b1',
        size: 6,
        children: [],
      }
    ]
  })

})