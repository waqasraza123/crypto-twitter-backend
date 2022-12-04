require("dotenv").config()
require("./config/database")

const express = require('express')
const app = express() //run express server
const cors = require('cors')
const jwt = require('jsonwebtoken')

const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const cryptoRouter = require('./routes/crypto')
const postsRouter = require('./routes/posts')
const tweetRouter = require('./routes/tweets')

const port = 8000

/****************
 * Middlewares
 *
 * *************
 */
//cors settings to allow the origins
app.use(
    cors({origin: ['http://localhost:3000', 'http://127.0.0.1:3000']})
);

//accepts json on our server
app.use(express.json());

//serve files/images/static
//otherwise files won't load in browser
app.use('/uploads', express.static('uploads'));

/**
 * routers
 */
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/crypto", cryptoRouter);
app.use("/posts", postsRouter);
app.use("/tweets", tweetRouter);

/**
 * start the server
 */
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});