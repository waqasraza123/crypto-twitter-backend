/**
 * auth routes
 */
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user");

const router = express.Router();
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
        return res.status(400).json({message: "Email or Password is empty!"});
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
 * returns new accessToken
 * required : refresh_token & email
 */
router.post("/token", async (req, res) => {
    const refreshToken = req.body.refresh_token;
    const email = req.body.email;

    //if the token is empty
    if(refreshToken == null){
        return res.status(401).json({message: "Token is empty!"});
    }

    //if the token is expired
    const user = await User.findOne({email: email});
    if(user == null){
        return res.json({message: "User does not exist!"});
    }

    //verify the refreshToken
    if(refreshToken === user.refreshToken){
        //the token is valid
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            //failed to verify the token
            if(err){
                return res.status(403).json({message: "UnAuthorized"});
            }

            //refresh token verified
            const accessToken = generateAccessToken({email: user.email});
            console.log(accessToken);
            res.status(200).json({accessToken: accessToken})
        });
    }
    else{
        return res.sendStatus(500);
    }
});

/**
 * revoke access
 *
 * Delete the access token
 * required : email
 */
router.post("/logout", async (req, res) => {

    const email = req.body.email;

    //find the user
    const user = await User.findOneAndUpdate(
        {email: email}, //find by email
        {accessToken: ""}, //update fields
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