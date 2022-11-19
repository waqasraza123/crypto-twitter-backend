require("dotenv").config()
require("./config/database")
require("./models/user")

const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')
const usersRouter = require('./routes/users');

const port = 8000
const apiBaseURL = process.env.COINMARKETCAP_API_URL;
const APIKEY = process.env.COINMARKETCAP_API;

/****************
 * Middlewares
 *
 * *************
 */
//cors settings to allow the origins
app.use(
    cors({origin: ['http://localhost:3000', 'http://127.0.0.1:3000']})
);

//express.json() is a built-in middleware function in Express starting from v4.16.0.
//It parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json());

app.use("/users", usersRouter);

/*******************
 * API Endpoints
 *
 * ******************
 */

//returns a list of all available cryptocurrencies
app.get('/api/v1/cryptocurrency/listings/latest', (req, res) => {

    let response = null;

    //make the request to coinmarketcap api
    let promise = new Promise(async (resolve, reject) => {

        try{
            response = await axios.get( apiBaseURL +  '/v1/cryptocurrency/listings/latest', {
                headers: {
                    'X-CMC_PRO_API_KEY': APIKEY,
                },
            });
        }
        catch (error){
            //error
            response = null;
            //pass the error to reject
            console.log(error);
            reject(error);
        }

        if (response) {
            // success
            const json = response.data;
            //pass the result to resolve
            console.log(json);
            resolve(json);
        }
    })

    // once the promise has been completed -> data or error
    //has two functions as arguments
    promise.then(
        result => res.send(result),
        error => res.send(error)
    );
});


/**
 * start the server
 */
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});