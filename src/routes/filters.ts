import express from 'express'
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

router.get('/api/wiki/count', async (req: any, res: any) => {
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

router.get('/api/wiki/search', async (req: any, res: any) => {
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

router.get('/api/wiki/featured', async (req: any, res: any) => {
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

router.get('/api/wiki/discover', async (req: any, res: any) => {
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

export default router