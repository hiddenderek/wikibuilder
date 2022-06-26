import express from 'express'
import jwt from 'jsonwebtoken'
import fs from 'fs'
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

router.get('/api/wiki/pages/:id', async (req: any, res: any) => {
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

router.post('/api/wiki/pages/:id', authenticateToken, async (req: any, res: any) => {
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

router.patch('/api/wiki/pages/:id', authenticateToken, async (req: any, res: any) => {
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

router.delete('/api/wiki/pages/:id', async (req: any, res: any) => {
    
})

router.post('/api/images/:id', async (req: any, res: any) => {
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

export default router