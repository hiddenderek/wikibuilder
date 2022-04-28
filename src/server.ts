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
    host: "postgres",
    port: 5432,
    database: "wikibuilder"
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
app.get('/bob', async (req: any, res: any) => {
    try {
        const userGet = await pool.query('SELECT * FROM users')
        if (userGet.rows) {
            res.status(200)
            res.json(userGet.rows)
        } else {
            res.status(404)
            res.json('No rows found.')
        }
    } catch (e) {
        res.status(400)
        res.json('Could not get data: ' + e)
    }
})

app.post('/users/:id', async (req: any, res: any) => {
    try {
        const {id} = req.params
        const userPost = await pool.query(`
          INSERT INTO users (id, username, password, email) VALUES (uuid_generate_v4(), $1, '1234', 'baaaldskjhf@dac-inc.com') RETURNING *
        `,[id])
        if (userPost.rows) {
            res.status(200)
            res.json(userPost.rows)
        } else {
            res.status(404)
            res.json('Could not find table')
        }
    } catch (e) {
        res.status(400)
        res.json('Could not post user' + e)
    }
})
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