/**
 * auth routes
 */
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user");
const {execMap} = require("nodemon/lib/config/defaults");

const router = express.Router();
const refreshTokens = [];
const tokenExpiryTime = process.env.TOKEN_EXPIRY_TIME;

/**
 * Login Route
 * Required : email, password
 */
router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const userDtaToSign = {
        email: email
    };

    //return if the fields are empty
    if(!email || !password){
        return res.status(400).json({message: "Email or Password is not correct!"});
    }

    //find the user with email
    const user = await User.findOne({email: email});

    //return if the user is not found
    if(user == null){
        return res.status(400).json({message: "User does not exist!"});
    }

    //compare the password if user is found
    if(await bcrypt.compare(password, user.password)){
        //if the password matched

        //create new tokens
        const accessToken = generateAccessToken(userDtaToSign);
        const refreshToken = jwt.sign(userDtaToSign, process.env.REFRESH_TOKEN_SECRET);

        //save the tokens on the user
        const updatedUser = await User.findOneAndUpdate(
            {email: email}, //find by email
            {accessToken: accessToken, refreshToken: refreshToken}, //update this data
            {new: true} //return updated instance
        )

        return res.status(200).json(updatedUser);
    }else{
        return res.status(401).json({message: "Email or Password is not correct!"});
    }

});


/**
 * Register Route
 * required : email, password
 */
router.post("/register", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    //user object to be signed with jwt
    const userDtaToSign = {
        email: email
    };

    //return if the fields are empty
    if(!email || !password){
        return res.status(400).json({message: "Email or Password is not correct!"});
    }

    //check if the user already exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).send("User already registered.");

    //hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //generate access & refresh tokens
    const accessToken = generateAccessToken(userDtaToSign);
    const refreshToken = jwt.sign(userDtaToSign, process.env.REFRESH_TOKEN_SECRET);

    //save the user & tokens in database
    try {
        const user = await User.create(
            {
                name: name,
                email: email,
                password: hashedPassword,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        );

        if(user){
            res.status(201).json(user);
        }

    }catch (err){
        res.status(500).json({message: err.message});
    }

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
 * required : email
 */
router.post("/logout", async (req, res) => {

    const email = req.body.email;

    //find the user
    const user = await User.findOneAndUpdate(
        {email: email}, //find by email
        {refreshToken: ""}, //update fields
        {new: true} //return updated object
    );

    //if email is null -> return
    if(!email || !user){
        return res.json({
            message: "User does not exist!"
        });
    }

    //token deleted -> user logged out
    res.json({message: "User is logged out!"});
});

/**
 * generates a token with jwt
 * @param userDtaToSign
 * @returns {*}
 */
function generateAccessToken(userDtaToSign){
    return jwt.sign(userDtaToSign, process.env.ACCESS_TOKEN_SECRET, {
        'expiresIn': tokenExpiryTime
    });
}

module.exports = router;