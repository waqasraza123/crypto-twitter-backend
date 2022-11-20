/**
 * auth routes
 */
const express = require("express")
const jwt = require("jsonwebtoken");
const router = express.Router()
const refreshTokens = [];
const tokenExpiryTime = process.env.TOKEN_EXPIRY_TIME;

/**
 * Login Route
 * Required : email
 */
router.post("/login", (req, res) => {
    const email = req.body.email;

    const user = {
        email: email
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    //temp store for tokens
    //tokens must be stored in the db
    refreshTokens.push(refreshToken);

    return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});

});

/**
 * Refresh Token Route
 * creates a new access token
 * required : refresh_token
 */
router.post("/token", (req, res) => {
    const refreshToken = req.body.refresh_token;

    //if the token is empty
    if(refreshToken == null){
        return res.status(401).json({message: "UnAuthorized!"});
    }

    //if the token is expired
    if(!refreshTokens.includes(refreshToken)){
        return res.status(403).json({message: "UnAuthorized!"});
    }

    //the token is valid
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        //failed to verify the token
        if(err){
            return res.status(403).json({message: "UnAuthorized"});
        }

        //refresh token verified
        const accessToken = generateAccessToken({email: user.email});
        res.status(200).json({accessToken: accessToken})
    });

});

/**
 * revoke access
 *
 * Delete the refresh token
 * required : refresh_token
 */
router.post("/logout", (req, res) => {
    //delete the token from the database
    //...

    //temp solution
    const refreshToken = req.body.refresh_token;
    refreshTokens.filter( token => {
        return token !== refreshToken;
    });


    //token deleted
    res.status(204).json({message: "Token Deleted!"});
});

/**
 * generates a token with jwt
 * @param user
 * @returns {*}
 */
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        'expiresIn': tokenExpiryTime
    });
}

module.exports = router;