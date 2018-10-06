const express = require("express");
const path = require("path");
const next = require("next");
const i18nextMiddleware = require("i18next-express-middleware");
const Backend = require("i18next-node-fs-backend");
const routes = require("./lib/routes");
const i18nHelper = require("./locales/helper");
const { i18nInstance } = require("./lib/i18n");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const routesHandler = routes.getRequestHandler(app);

const i18nConfig = {
  fallbackLng: "en",
  preload: ["en", "es"], // preload all langages
  ns: i18nHelper.namespaces, // need to preload all the namespaces
  backend: {
    loadPath: path.join(__dirname, "/locales/{{lng}}/{{ns}}.json"),
    addPath: path.join(__dirname, "/locales/{{lng}}/{{ns}}.missing.json")
  },
  interpolation: i18nHelper.interpolation
};
i18nInstance
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(i18nConfig, () => {
    app
      .prepare()
      .then(() => {
        const server = express();

        // Firebase messaging - GCM ID
        server.get("/manisfest.json", (req, res) => {
          app.serveStatic(req, res, "static/manifest.json");
        });

        // Firebase messaging - Service worker
        server.get("/firebase-messaging-sw.js", (req, res) => {
          app.serveStatic(req, res, "static/firebase-messaging-sw.js");
        });

        // enable middleware for i18next
        server.use(i18nextMiddleware.handle(i18nInstance));

        // serve locales for client
        server.use(
          "/locales",
          express.static(path.join(__dirname, "/locales"))
        );

        // missing keys
        server.post(
          "/locales/add/:lng/:ns",
          i18nextMiddleware.missingKeyHandler(i18nInstance)
        );

        server.use(routesHandler);

        server.listen(3000, err => {
          if (err) throw err;
          console.log("> Ready on http://localhost:3000");
        });
      })
      .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
      });
  });
