import express from 'express'
import config from './config'
import processEnv from 'dotenv'
processEnv.config()
import {Pool} from 'pg'
import serverRenderer from './renderers/serverRenderer'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import fs from 'fs'
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
app.use(express.json({ limit: "4mb" }))
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

app.post('/api/users/:userName', async (req: any, res: any) => {
    console.log('postUser')
    try {
        const { userName } = req.params
        const { password } = req.body
        const { dateOfBirth } = req.body
        console.log(userName)
        console.log(password)
        console.log(dateOfBirth)
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        const addUser = await pool.query(`
        INSERT INTO users (id, username, password, date_of_birth, time_of_signup) VALUES (uuid_generate_v4(), $1, $2, $3, CURRENT_DATE) RETURNING *
        `,[userName, hashedPassword, new Date(dateOfBirth)])
        console.log('savin')
        if (addUser) {
            res.status(200)
            res.json("Successful! User has been added")
        } else {
            res.status(404)
            res.json('Could not add user.')
        }
    } catch (e: any) {
        console.log(e.message)
        res.status(404)
        if (e.message.match('violates unique constraint') && e.message.match('password')) {
            res.json('Failed. Password must be unique.')
        } else if (e.message.match('violates unique constraint') && e.message.match('username')) {
            res.json('Failed. Username must be unique.')
        } else {
            res.json('Failed. Unknown errror.')
        }
    }
})

app.post('/api/images/:id', async (req: any, res: any) => {
    try {
        const {id} = req.params
        const {symbol_file, symbol_image_type} = req.body
        try {
            const symbolFileIndex = symbol_file.lastIndexOf('base64,')
            const symbolFileGet = symbol_file.substring(symbolFileIndex)
            const symbolFileFormat = symbolFileGet.split('base64,').join('')
            const imageBuffer =  Buffer.from(symbolFileFormat, 'base64')
            fs.writeFileSync(`public/images/user-images/${id}.${symbol_image_type}`, imageBuffer)
            res.status(200)
            res.json('File written successfully')
        } catch (e) {
            res.status(400)
            res.json('ERROR WRITING FILE')
            console.log('ERROR WRITING FILE: ' + e)
        }
    } catch (e) {
        res.status(400)
        res.json('Could not save image' + e)
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