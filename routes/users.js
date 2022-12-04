const express = require("express")
const router = express.Router()
const User = require("../models/user")
const upload = require("../config/multer")
const authMiddleware = require("../middlewares/jwtAuthentication")
const bcrypt = require("bcrypt");


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


/**
 * Updates password
 * Required: email, newPassword
 */
router.post("/password", async (req, res) => {
    const newPassword = req.body.password
    const oldPassword = req.body.oldPassword
    const email = req.body.email;

    if(!email || !newPassword){
        return res.status(400).json({message: "Email or Password is missing!"});
    }

    try {
        //find the user with email
        const user = await User.findOne({email: email});

        //return if the user is not found
        if(user == null){
            return res.status(400).json({message: "User does not exist!"});
        }

        //compare the password from db with oldPassword(user provided)
        if(await bcrypt.compare(oldPassword, user.password)){
            //user provided the correct old password
            //hash the newPassword
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(newPassword, salt);


            //update the password
            user.password = hashedPassword
            user.save()

            res.status(200).json({message: "Password updated successfully"})

        }else{
            //user provided the incorrect old password
            //send not authorized code 401
            res.status(401).json({message: "Incorrect Old Password!"})
        }
    }catch (err){
        res.status(500).json(err.message);
    }

})


module.exports = router;