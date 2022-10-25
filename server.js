import express from 'express'
import session from 'express-session'

import { v4 as uuidv4 } from 'uuid';
const SECRET = uuidv4().toString();

import next from 'next';
import bodyParser from 'body-parser';
import http from 'http';

const server = express();
const http_server = http.createServer(server);

const dev = process.env.NODE_ENV !== 'production'

const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {

    /* Set up body-parser */
    server.use(bodyParser.urlencoded({
        extended: true
    }));

    // https://github.com/expressjs/session
    server.use(session({
        secret: SECRET,
        genid: () => { return uuidv4() }, // BUG: Different for same user on different routes
        saveUninitialized: true,
        resave: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 10, // 10 minutes
        }
    }))

    server.use(express.json());

    /* API router */
    server.post('/api/login', (req, res) => {
        req.session.authed = true;
        res.status(200).json({ id: req.sessionID, authed: req.session.authed, });
    })


    server.get('/api/logout', (req, res) => {
        req.session.destroy();
        req.status(200).json({ status: 'Logged out' });
    })

    server.get('/api/isloggedin', (req, res) => {
        res.json({ id: req.sessionID, authed: req.session.authed, });
    })

    /* Handle all requests through next */
    server.get("*", (req, res) => {
        return nextHandler(req, res)
    });

    /* Listen on port 8000 */
    http_server.listen(8000, (err) => {
        if (err) throw err
        console.log("Server is running on port 8000")
    });

});

