const express = require('express')
const next = require('next')

const routes = require('./lib/routes')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
//const handle = app.getRequestHandler()
const handler = routes.getRequestHandler(app)

app.prepare()
.then(() => {
  const server = express()
  server.use(handler)
  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> CUSTOM ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
