import express from 'express'
import config from './config'
import jwt from 'jsonwebtoken'
import processEnv from 'dotenv'
import https from 'https'
processEnv.config()
import dayjs from 'dayjs'
import cors from 'cors'
import serverRenderer from './renderers/serverRenderer'
import { Pool } from 'pg'
import fs from 'fs'
import { isArray } from 'util';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const app = express()
const pool = new Pool({
    user: "postgres",
    password: "D@c77357",
    host: "postgres",
    port: 5432,
    database: "wikibuilder"
})

app.use(cookieParser())
app.use(express.static('public'));
app.use(express.json())
app.set('view engine', 'ejs');
app.use(cors({
    credentials: true,
    origin: `https://${config.hostname}:${config.port}`
}))
//gets a new access token after the original expires.
app.post('/token', async (req, res)=>{
    try { 
        const {refreshToken} = JSON.parse(req.cookies.secureCookie)
        if (refreshToken == null) return res.sendStatus(401)
        //checks if the refesh token is included in the databse refresh token list. If not, return a 403 error. No access to refreshing.
        const saveToken = await pool.query(`
        SELECT * FROM refreshtokens WHERE refresh_token = $1
        `, [refreshToken]) 
        if (!(saveToken.rows.length > 0)) {
            console.log('refresh DATABASE error! ')
            return res.sendStatus(403)
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, user: any)=>{
            if (err) {
                console.log('verifyERROR! ' + err)
                return res.sendStatus(403)
            }
            const accessToken = generateAccessToken({name: user!.name})
            const JWT = {accessToken, refreshToken}
            res.cookie("secureCookie", JSON.stringify(JWT), {
                secure: process.env.NODE_ENV !== "development",
                httpOnly: true,
                expires: dayjs().add(1, "days").toDate()
            })
            res.status(200)
            res.json('Refresh successful!')
        })

    } catch(e) {
        res.sendStatus(400)
        console.log('REFRESH ERROR: ' + e)
    }
})

app.post('/api/login', async (req: any, res: any) => {
    try {
        const { id } = req.params
        const { userName, password } = req.body
        const getUser = await pool.query(`
        SELECT id, password FROM users WHERE username = '${userName}' 
        `)
        if (getUser.rows[0]) {
            const userId = getUser.rows[0].id
            console.log('uesr found!')
            const storedPassword = getUser.rows[0]?.password
            console.log(storedPassword)
            console.log(password)
            try {
                const validPassword = await bcrypt.compare(password, storedPassword)
                console.log(validPassword)
                if (validPassword) {
                    const user = { name: userName }
                    const accessToken = generateAccessToken(user)
                    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string)
                    const JWT = {accessToken, refreshToken}
                    const saveToken = await pool.query(`
                        INSERT INTO refreshtokens (id, refresh_token, user_id) VALUES ( uuid_generate_v4(), $1, $2)
                    `, [refreshToken, userId])
                    res.cookie("secureCookie", JSON.stringify(JWT), {
                        secure: process.env.NODE_ENV !== "development",
                        httpOnly: true,
                        expires: dayjs().add(1, "days").toDate()
                    })
                    res.status(200)
                    res.json(JSON.stringify(user))
                } else {
                    res.status(404)
                    res.json('Incorrect password.')
                }
            } catch (e) {
                console.log(e)
                res.status(400)
                res.json('Something went wrong. Error: ' + e)
            }
        } else {
            res.status(404)
            res.json('Could not find user name.')
        }
    } catch (e) {
        console.log(e)
        res.status(400)
        res.json('Login failed. Error code: 400')
    }
})

app.delete('/api/logout', async (req: any, res: any) =>{
    try {
        const { refreshToken } = JSON.parse(req.cookies.secureCookie) 
        if (refreshToken === null) return res.sendStatus(401)
        const deleteToken = await pool.query(`
            DELETE FROM refreshtokens WHERE refresh_token = $1
        `, [refreshToken])
        res.clearCookie("secureCookie")
        res.sendStatus(204)
    } catch (e) {
        res.status(400)
        res.json('Logout failed. Error code: 400')
        console.log('LOGOUT ERROR: ' + e)
    }

})

app.get('/*', async (req: any, res: any) => {
    let contentGet = serverRenderer()
    console.log(contentGet.initialContent)
    console.log('hmmmm')
    res.render('index', { data: contentGet.initialContent });
})

https.createServer({
    key: fs.readFileSync("./src/ssl/dchapman-portfolio_key.pem"),
    cert: fs.readFileSync("./src/ssl/dchapman-portfolio_site.crt")
  },app).listen(config.authPort, function listenHandler() {
      console.info(`Running on ${config.authPort}`)
  })

function generateAccessToken(user: {name: string}) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '15s'})
}
export default app