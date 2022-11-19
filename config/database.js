const mongoose = require('mongoose');
const databaseURL = process.env.DATABASE_URL;

//connect with database
mongoose.connect(databaseURL,
    () => {
        console.log("connected with db")
    },
    e => {
        console.log(e)
    }
);