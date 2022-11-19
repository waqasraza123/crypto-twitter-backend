const express = require("express");
const router = express.Router();
const User = require("../models/user");

//all the routes are prefixed by /users

//Get all users
router.get("/", async function (req, res){
    try {
        //wait for the results
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (exception){
        //handle errors here
        res.status(500).json(
            {
                message: exception.message
            }
        )
    }

});

//Get one user
router.get("/:id", function (req, res){});

//Create one
router.post("/", function (req, res){});

//Update one user
router.patch("/:id", function (req, res){});

//Delete one user
router.delete("/:id", function (req, res){});


module.exports = router;