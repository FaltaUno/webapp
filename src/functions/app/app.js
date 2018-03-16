import * as functions from "firebase-functions"
import next from "next"
import routes from './routes'

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev, conf: { distDir: "next" } })
const handler = routes.getRequestHandler(app)

const nextApp = functions.https.onRequest((request, response) => {
  console.log("File: " + request.originalUrl)
  console.log("dev:", dev)
  // log the page.js file or resource being requested

  return app.prepare().then(() => handler(request, response))
})

export { nextApp }
