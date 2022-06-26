import express, { ErrorRequestHandler } from 'express'
import config from './config'
import processEnv from 'dotenv'
processEnv.config()
import useragent from 'express-useragent'
import https from 'https'
import serverRenderer from './renderers/serverRenderer'
import cookieParser from 'cookie-parser'
import contributions from './routes/contributions'
import filters from './routes/filters'
import pages from './routes/pages'
import users from './routes/users'
import fs from 'fs'
const app = express()

app.use(cookieParser())
app.use(express.static('public'))
app.use(useragent.express());
app.use(express.json({ limit: "20mb" }))
app.use(contributions)
app.use(filters);
app.use(pages);
app.use(users);
app.set('view engine', 'ejs')

app.get('/*', async (req: any, res: any) => {
    let contentGet = serverRenderer()
    res.render('index', { data: contentGet.initialContent, isMobile: req.useragent.isMobile, isDesktop: req.useragent.isDesktop  });
})

https.createServer({
    key: fs.readFileSync("./src/ssl/dchapman-portfolio_key.pem"),
    cert: fs.readFileSync("./src/ssl/dchapman-portfolio_site.crt")
  },app).listen(config.port, function listenHandler() {
      console.info(`Running on ${config.port}`)
  })

export default app