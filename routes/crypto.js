const express = require("express")
const axios = require("axios")
const router = express.Router()

const authMiddleware = require("../middlewares/jwtAuthentication")
const apiBaseURL = process.env.COINMARKETCAP_API_URL;
const APIKEY = process.env.COINMARKETCAP_API;

/**
 * returns all cryptocurrency list
 * required : API_KEY
 */
router.get('/all', (req, res) => {

    let response = null;

    //make the request to coin market cap api
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

router.get("/meta", async (req, res) => {
    const currencyId = req.query.currencyId

    try{
        const response = await axios.get(apiBaseURL + "/v2/cryptocurrency/info?id=" + currencyId, {
            headers: {
                'X-CMC_PRO_API_KEY': APIKEY,
            }
        })
        if(response){
            console.log(response.data)
            res.status(200).json(response.data)
        }
    }catch (error){
        console.log(error)
        res.send(500)
    }

})


module.exports = router;