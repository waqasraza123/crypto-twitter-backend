const express = require("express");
const router = express.Router();

const Post = require("../models/post");
const authMiddleware = require("../middlewares/jwtAuthentication")

//all the routes are prefixed by /posts

/**
 * create a post
 * required: title, content, userId
 */
router.post("/", async (req, res) => {
    try{
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            userId: req.body.userId
        })

        //post saved
        res.status(200).json({
            message: "Post saved.",
            post: post
        });

    }catch (error){
        console.log(error);
        res.status(500).json({
            message: "Failed to save Post!"
        });
    }
});

/**
 * returns all posts
 * required: userId
 * /posts/?userId=1
 */
router.get("/", async (req, res) => {

    try {
        const userId = req.query.userId
        const posts = await Post.find({userId: userId}).sort({updatedAt: "desc"}).exec()
        res.status(200).json(posts)
    }catch (error){
        res.status(500).json({message: "Failed to retrieve posts."})
    }

})

module.exports = router;