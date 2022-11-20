/**
 * auth routes
 */
const express = require("express")
const jwt = require("jsonwebtoken");
const router = express.Router()

/**
 * Login Route
 * Required : email
 */
router.post("/login", (req, res) => {
    const email = req.body.email;

    const user = {
        email: email
    };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //set the expiration time
    });
    return res.status(200).json(accessToken);

});

module.exports = router;