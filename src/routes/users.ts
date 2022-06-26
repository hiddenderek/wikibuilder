import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import PoolGet from 'pg'
const Pool = PoolGet.Pool
const pool = new Pool({
    user: "postgres",
    password: "D@c77357",
    host: "postgres",
    port: 5432,
    database: "wikibuilder"
})
const router = express.Router()

router.use(function timeLog(req, res, next) {
    next();
  });

function authenticateToken(req: any, res: any, next: any) {
    const token = JSON.parse(req.cookies.secureCookie)
    if (token == null) {
        console.log('NULL AUTHENTICATE')
        return res.sendStatus(401)
    }
    jwt.verify(token.accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            console.log('ERROR AUTHENTICATING: ' + err)
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

router.get('/api/currentUser', authenticateToken, async (req: any, res: any) => {
    try {
        console.log('get current user')
        if (req?.user?.name) {
            res.status(200)
            res.json(req.user.name)
        } else {
            console.log('COULD NOT FIND USER')
            res.sendStatus(404)
        }
        
    } catch (e) {
        res.status(500)
        res.json('current user error: ' + e)
        console.log('current user error: ' + e)
    }
})

router.post('/api/users/:userName', async (req: any, res: any) => {
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
        INSERT INTO users (id, username, password) VALUES (uuid_generate_v4(), $1, $2) RETURNING *
        `,[userName, hashedPassword])
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
        if (e.message.match('violates unique constraint') && e.message.match('password')) {
            res.status(400)
            res.json('Failed. Password must be unique.')
        } else if (e.message.match('violates unique constraint') && e.message.match('username')) {
            res.status(400)
            res.json('Failed. Username must be unique.')
        } else {
            res.status(500)
            res.json('Failed. Errror:' + e.message)
        }
    }
})

export default router