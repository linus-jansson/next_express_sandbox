import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import session from 'express-session'

import { v4 as uuidv4 } from 'uuid';

import next from 'next'; // handling next.js instance
import bodyParser from 'body-parser'; // body parser for post requests
import http from 'http'; // http server
import MongoStore from 'connect-mongo'; // session store for mongodb

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
    let time_to_live = 60 * 60 * 1000; // 1 hour
    server.use(session({
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
            ttl: time_to_live
        }),
        secret: process.env.SESSION_SECRET,
        genid: () => { return uuidv4() },
        saveUninitialized: false,
        resave: true,
        cookie: {
            secure: false,
            maxAge: time_to_live,
            sameSite: true,
        }
    }))

    server.use(express.json());

    /* User logs in */
    server.post('/api/login', (req, res) => {
        req.session.authed = true;
        res.status(200).json({ id: req.sessionID, authed: req.session.authed, });
    })

    /* User logs out */
    server.get('/api/logout', (req, res) => {
        req.session.destroy();
        req.status(200).json({ status: 'Logged out' });
    })

    /* Check if user is logged in */
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

