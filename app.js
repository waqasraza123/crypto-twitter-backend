require("dotenv").config()
require("./config/database")
require("./models/user")

const express = require('express')
const app = express() //run express server
const cors = require('cors')
const jwt = require('jsonwebtoken')

const usersRouter = require('./routes/users')
const cryptoRouter = require('./routes/crypto')
const authRouter = require('./routes/auth')

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

//routes
app.use("/users", usersRouter);
app.use("/crypto", cryptoRouter);
app.use("/auth", authRouter);

/**
 * start the server
 */
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});