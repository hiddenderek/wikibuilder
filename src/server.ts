import express, { ErrorRequestHandler } from 'express'
import config from './config'
import processEnv from 'dotenv'
processEnv.config()
import useragent from 'express-useragent'
import https from 'https'
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
app.use(useragent.express());
app.use(express.json({ limit: "20mb" }))
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
app.get('/api/currentUser', authenticateToken, async (req: any, res: any) => {
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
            res.status(500)
            res.json('ERROR WRITING FILE')
            console.log('ERROR WRITING FILE: ' + e)
        }
    } catch (e) {
        res.status(500)
        res.json('Error saving image' + e)
    }
})

app.get('/api/wiki/count', async (req: any, res: any) => {
    try {
        const getWikiCount = await pool.query(`SELECT count(*) AS exact_count FROM pages`)
        if (getWikiCount?.rows[0]) {
            res.status(200)
            res.json(getWikiCount.rows[0].exact_count)
        } else {
            res.status(404)
            res.json('Could not find table')
        }
    } catch (e: any) {
        res.status(500)
        res.json('Failed counting wikis: ' + e.message)
    }
})

app.get('/api/wiki/search', async (req: any, res: any) => {
    try {
        let parameters = []
        if (req?.query?.search) { 
            parameters.push(`%${req.query.search}%`) 
        }
        if (req?.query?.page && !req?.query?.countwikis) {
            parameters.push(Number(req.query.page) * 12)
        }
        const getWikis = await pool.query(`
            SELECT * FROM pages 
            ${req?.query?.search ? `WHERE title ILIKE $1` : ""}  
            ORDER BY title ASC ${req?.query?.countwikis ? "" : "LIMIT 12"} 
            ${req?.query?.page && !req?.query?.countwikis ? `OFFSET ${req?.query?.search ? "$2" : "$1"}` : ""}
        `, parameters)
        if (getWikis.rows) {
            res.status(200)
            res.json(getWikis.rows)
        } else {
            res.status(404)
            res.json('Could not find wikis.')
        }
    } catch (e: any) {
        res.status(500)
        res.json('Failed searching for wikis: ' + e.message)
    }
})

app.get('/api/wiki/featured', async (req: any, res: any) => {
    try {
        const getWikiCount = await pool.query(`SELECT count(*) AS exact_count FROM pages`)
        const date = new Date().toJSON().slice(0,10).split('-')
        const length = getWikiCount.rows[0].exact_count
        const increment = length / 372
        const currentDateVal = ((Number(date[1].slice(0, 1) === "0" ? date[1].slice(1, 2) : date[1]) - 1) * 31) + Number(date[2])
        const index = (currentDateVal * increment).toFixed(0)
        const getDiscoverWikis = await pool.query(`
            SELECT * FROM (
                SELECT title, intro_text, intro_table_data, page_section_data, ROW_NUMBER() OVER (ORDER BY title) FROM pages
            ) AS Q1 WHERE row_number = $1
        `, [index])
        if (getDiscoverWikis?.rows) {
            res.status(200)
            res.json(getDiscoverWikis.rows)
        } else {
            res.status(404)
            res.json('Could not find rows')
        }
    } catch (e: any) {
        res.status(500)
        res.json('Failed finding wikis: ' + e.message)
    }
})

app.get('/api/wiki/discover', async (req: any, res: any) => {
    try {
        const getDiscoverWikis = await pool.query(`
            SELECT * FROM pages TABLESAMPLE SYSTEM_ROWS(8)
        `)
        if (getDiscoverWikis?.rows) {
            res.status(200)
            res.json(getDiscoverWikis.rows)
        } else {
            res.status(404)
            res.json('Could not find rows')
        }
    } catch (e: any) {
        res.status(500)
        res.json('Failed finding wikis: ' + e.message)
    }
})

app.get('/api/wiki/contributions/user/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params
        const { created } = req?.query
        const getUserId = await pool.query(`
        SELECT id FROM users WHERE username = $1
    `, [id])
        if (getUserId.rows[0]) {
            const getContributions = await pool.query(`
                SELECT c.action_type, to_char(c.time_executed, 'MM/DD/YYYY HH12:MI AM')  AS time_executed, p.title, p.intro_text FROM pages p RIGHT JOIN page_contributions c ON c.page_id = p.id WHERE c.user_id = $1 ${created ? "AND c.action_type = 'Created Page.'" : ""} ORDER BY c.time_executed DESC LIMIT 25
            `, [getUserId.rows[0].id])

            if (getContributions.rows) {
                res.status(200)
                res.json(getContributions.rows)
            } else {
                res.status(404)
                res.json('Could not find rows.')
            }
        } else {
            res.status(404)
            res.json('No user specified.')
        }
    } catch (e: any) {
        res.status(500)
        res.json('Error getting wikis: ' + e.message)
    }
})

app.get('/api/wiki/contributions/page/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params
            const getContributions = await pool.query(`
            SELECT c.action_type,  to_char(c.time_executed, 'MM/DD/YYYY HH12:MI AM')  AS time_executed, u.username, p.intro_text FROM pages p RIGHT JOIN page_contributions c ON c.page_id = p.id RIGHT JOIN users u ON c.user_id = u.id WHERE p.title = $1 ORDER BY c.time_executed DESC LIMIT 25
            `, [id])

            if (getContributions.rows) {
                res.status(200)
                res.json(getContributions.rows)
            } else {
                res.status(404)
                res.json('Could not find rows.')
            }
    } catch (e: any) {
        res.status(500)
        res.json('Error getting wikis: ' + e.message)
    }
})

app.get('/api/wiki/pages/:id', async (req: any, res: any) => {
    try {
        const {id} = req.params
        const wikiGet = await pool.query(`
            SELECT * FROM pages WHERE title = $1
        `, [id])
        if (wikiGet.rows[0]) {
            res.status(200)
            res.json(wikiGet.rows[0])
        } else {
            res.status(404)
            res.json('Could not find wiki.')
        }
    } catch (e: any) {
        res.status(500)
        res.json('Error getting wiki. Error: ' + e.message)
    }

})

app.post('/api/wiki/pages/:id', authenticateToken, async (req: any, res: any) => {
    try {
        const { id } = req.params
        const excludedChars = ['?', '#', '&', '@', '^', '*', '/', '\\', '(', ')', '<', '>', '%']
        let excludedCharsCheck = false
        for (let i = 0; i < excludedChars.length; i++) {
            if (id.includes(excludedChars[i])) {
                excludedCharsCheck = true
            }
        }
        if (!excludedCharsCheck) {
            const { introText, introTableData, pageSectionData } = req.body
            const getUserId = await pool.query(`
            SELECT id FROM users WHERE username = $1
        `, [req?.user?.name])
            if (getUserId.rows[0]) {
                const createWiki = await pool.query(`
            INSERT INTO pages (id, title, intro_text, intro_table_data, page_section_data, user_id) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5) RETURNING *
            `, [id, introText, introTableData, pageSectionData, getUserId.rows[0].id])

                if (createWiki.rows[0]) {
                    const recordContributor = await pool.query(`
                INSERT INTO page_contributions (id, page_id, user_id, action_type, time_executed) VALUES (uuid_generate_v4(), $1, $2, 'Created Page.', CURRENT_TIMESTAMP)
                `, [createWiki.rows[0].id, getUserId.rows[0].id])

                    res.status(201)
                    res.json('Page Created successfully')
                } else {
                    res.status(404)
                    res.json('Page not found')
                }
            } else {
                res.status(404)
                res.json('User not found')
            }
        } else {
            res.status(400)
            res.json('Special characters are not allowed in the title.')
        }

    } catch (e: any) {
        res.status(500)
        res.json('Error creating wiki: ' + e.message)
    }

})

app.patch('/api/wiki/pages/:id', authenticateToken, async (req: any, res: any) => {
    try {
        const { id } = req.params
        const excludedChars = ['?', '#', '&', '@', '^', '*', '/', '\\', '(', ')', '<', '>', '%']
        let excludedCharsCheck = false
        for (let i = 0; i < excludedChars.length; i++) {
            if (id.includes(excludedChars[i])) {
                excludedCharsCheck = true
            }
        }
        if (!excludedCharsCheck) {
            const { pageTitle, introText, introTableData, pageSectionData, action } = req.body
            const getUserId = await pool.query(`
            SELECT id FROM users WHERE username = $1
        `, [req?.user?.name])
            const getPageId = await pool.query(`
            SELECT id FROM pages WHERE title = $1
        `, [id])
            if (getUserId.rows[0] && getPageId.rows[0]) {
                const createWiki = await pool.query(`
            UPDATE pages SET title = $1, intro_text = $2, intro_table_data = $3, page_section_data = $4 WHERE id = $5 RETURNING *
            `, [pageTitle, introText, introTableData, pageSectionData, getPageId.rows[0].id])

                if (createWiki.rows[0]) {
                    const recordContributor = await pool.query(`
                INSERT INTO page_contributions (id, page_id, user_id, action_type, time_executed) VALUES (uuid_generate_v4(), $1, $2, $3, CURRENT_TIMESTAMP)
                `, [getPageId.rows[0].id, getUserId.rows[0].id, action])

                    res.status(201)
                    res.json('Page Saveds successfully')
                } else {
                    res.status(404)
                    res.json('Page not found')
                }
            } else {
                res.status(404)
                res.json('User or page not found: ' + id)
            }
        } else {
            res.status(405)
            res.json('Special characters are not allowed in the title.')
        }
    } catch (e: any) {
        res.status(500)
        res.json('Error saving wiki: ' + e.message)
    }
})

app.delete('/api/wiki/pages/:id', async (req: any, res: any) => {
    
})


app.get('/*', async (req: any, res: any) => {
    let contentGet = serverRenderer()
    console.log(contentGet.initialContent)
    console.log('hmmmm')
    res.render('index', { data: contentGet.initialContent, isMobile: req.useragent.isMobile, isDesktop: req.useragent.isDesktop  });
})

https.createServer({
    key: fs.readFileSync("./src/ssl/dchapman-portfolio_key.pem"),
    cert: fs.readFileSync("./src/ssl/dchapman-portfolio_site.crt")
  },app).listen(config.port, function listenHandler() {
      console.info(`Running on ${config.port}`)
  })

export default app