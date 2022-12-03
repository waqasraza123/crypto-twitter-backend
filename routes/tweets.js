const express = require("express");
const router = express.Router();

const Tweet = require("../models/tweet");
const authMiddleware = require("../middlewares/jwtAuthentication")

//all the routes are prefixed by /posts

/**
 * create a tweet
 * required: content, userId
 */
router.post("/", async (req, res) => {

    try{
        const tweet = await Tweet.create({
            content: req.body.content,
            author: req.body.userId
        })

        //post saved
        res.status(200).json({
            message: "Tweet Published!",
            tweet: tweet
        });

    }catch (error){
        console.log(error);
        res.status(500).json({
            message: "Failed to publish tweet!"
        });
    }
});

/**
 * returns all tweets
 */
router.get("/", async (req, res) => {

    try {
        const tweets = await Tweet.find()
            .populate("author", "_id name email")
            .sort({updatedAt: "desc"}).exec()
        res.status(200).json(tweets)
    }catch (error){
        res.status(500).json({message: "Failed to retrieve tweets."})
    }

})

module.exports = router;