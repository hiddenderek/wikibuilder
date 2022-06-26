import express from 'express'
import jwt from 'jsonwebtoken'
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

router.get('/api/wiki/contributions/user/:id', async (req: any, res: any) => {
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

router.get('/api/wiki/contributions/page/:id', async (req: any, res: any) => {
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

export default router