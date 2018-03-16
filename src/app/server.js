const express = require('express')
const next = require('next')

const conf = require('./next.config')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, conf })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  server.get('/match/:key', (req, res) => {
    const actualPage = '/match'
    const queryParams = { key: req.params.key } 
    app.render(req, res, actualPage, queryParams)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> CUSTOM ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
