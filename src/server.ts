import express from 'express'
import config from './config'
import processEnv from 'dotenv'
processEnv.config()
import {Pool} from 'pg'
import serverRenderer from './renderers/serverRenderer'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
const jwt = require('jsonwebtoken')
const app = express()
const pool = new Pool({
    user: "postgres",
    password: "D@c77357",
    host: "localhost",
    port: 5432,
    database: "oasis_builder"
})
app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())
app.set('view engine', 'ejs')


function authenticateToken(req: any, res: any, next: any) {
    const token = JSON.parse(req.cookies.secureCookie)
    if (token == null) return res.sendStatus(401)
    jwt.verify(token.accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.get('/*', async (req: any, res: any) => {
    let contentGet = serverRenderer()
    console.log(contentGet.initialContent)
    console.log('hmmmm')
    res.render('index', { data: contentGet.initialContent });
})

app.listen(config.port, function listenHandler() {
    console.info(`Running on ${config.port}`)
})

export default app