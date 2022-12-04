const express = require("express")
const router = express.Router()
const User = require("../models/user")
const upload = require("../config/multer")
const authMiddleware = require("../middlewares/jwtAuthentication")


//all the routes are prefixed by /users

/**
 * returns all users
 * required : nothing
 */
router.get("/",  async function (req, res){
    try {
        //wait for the results
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (err){
        //handle errors here
        //500 server error code
        res.status(500).json(
            {
                message: err.message
            }
        )
    }

});

/**
 * returns one user
 * required : email
 */
router.get("/user",  async function (req, res){
    const email = req.body.email;

    try{
        const user = await User.find({email: email}).populate("posts").populate("tweets");
        if(user){
            res.status(200).json(user);
        }
    }catch(err){
        res.status(500).json({message: err.message})
    }

});

/**
 * updates a user
 * required : email and/or other data to update
 */

router.post("/user",  upload.single("photo"), async function (req, res){

    const email = req.body.email;
    const filter = {email: email};
    let newData = req.body;
    const photo = req.file

    //add the filename to data
    //filename is coming from multer filename => returns random filename with extension
    //newData.photo = photo.filename
    if(photo){
        //photo was uploaded
        //else no need to append the photo
        newData.photo = photo.filename
    }

    try{
        //new: true sends back the new data after update
        let user = await User.findOneAndUpdate(filter, newData, {new: true});

        console.log(user)

        if(user == null){
            res.status(404).json({message: "User not found!"});
        }
        else{
            //send back the updated user
            res.json(user);
        }

    }catch (err){
        res.status(500).json({message: err.message});
    }

});

/**
 * deletes a user
 * required : email
 */
router.delete("/user",  async function (req, res){

    try{
        const email = req.body.email;
        await User.deleteOne({email});

        res.json({message: `User ${email} is deleted.`});

    }catch (err){
        res.status(500).json(err.message);
    }

});


module.exports = router;