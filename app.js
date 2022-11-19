require("dotenv").config()
require("./config/database")
require("./models/UserModel")

const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')

const port = 8000
const apiBaseURL = "https://pro-api.coinmarketcap.com";
const APIKEY = process.env.COINMARKETCAP_API;

/**
 * cors settings to allow the origins
 */
app.use(
    cors({origin: ['http://localhost:3000', 'http://127.0.0.1:3000']})
);

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