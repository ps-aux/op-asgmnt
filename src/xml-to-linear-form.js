const XmlStream = require('xml-stream')
const { fromEvent, merge } = require('rxjs')
const { filter, map, takeWhile } = require('rxjs/operators')
const { complement, propEq, path } = require('ramda')

const getCategory = path(['attrs', 'words'])

const hasFinished = ctx => e =>
  e.type === 'end' && ctx.currentPath.length === 1

const onEvent = ({ type, category, all, open, current, separator = ' > ' }) => {
  if (type === 'start') {
    current.push(category)
    const entry = { name: current.join(separator), size: 0 }
    all.push(entry)
    open.forEach(e => {
      e.size = e.size + 1
    })
    open.push(entry)
  } else if (type === 'end') {
    current.pop()
    open.pop()
  } else {
    throw new Error('Unknown event type')
  }
}

const xmlToLinearForm = fileStream => new Promise((resolve, reject) => {
  const ctx = {
    all: [],
    open: [],
    currentPath: []
  }

  const xml = new XmlStream(fileStream)

  merge(
    fromEvent(xml, 'startElement').pipe(
      map(args => ({
        name: args[0],
        attrs: args[1],
        type: 'start'
      }))
    ),
    fromEvent(xml, 'endElement').pipe(
      map(name => ({
        name,
        type: 'end'
      }))
    ))
    .pipe(
      takeWhile(complement(hasFinished(ctx))),
      filter(propEq('name', 'synset')),
      map(e => ({
        type: e.type,
        category: getCategory(e)
      })),
    ).subscribe({
    next: e => onEvent({
      type: e.type,
      category: e.category,
      all: ctx.all,
      open: ctx.open,
      current: ctx.currentPath
    }),
    error: reject,
    complete: () => resolve(ctx.all)
  })
})

module.exports = {
  xmlToLinearForm
}
