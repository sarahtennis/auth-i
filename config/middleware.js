const express = require('express');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const helmet = require('helmet');
const morgan = require('morgan');

const restrictedAccess = require('../middleware/restrictedMiddleware.js');

const db = require('../database/dbConfig.js')

const restrictedRouter = require('../routers/restrictedRouter.js');
const authRouter = require('../routers/authRouter.js');

const sessionConfig = {
    name: 'superSecret',
    secret: `(>'.')><('.')><('.'<)`,
    cookie: {
        maxAge: 1000 * 60 * 10, // 10 minutes
        secure: false // true for production
    },
    httpOnly: true, // no js
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'userSessions',
        sidfieldname: 'sessionId',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60, // 1 hour
    })
}

module.exports = server => {
    server.use(session(sessionConfig));
    server.use(express.json());
    server.use('/api/restricted/', restrictedAccess);
    server.use(cors());
    server.use(helmet());
    server.use(morgan('dev'));

    server.use('/api/restricted', restrictedRouter);
    server.use('/api', authRouter);
};