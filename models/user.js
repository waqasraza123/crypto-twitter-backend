const userSchema = require('../schemas/users');

let user;
let promise = new Promise(async function(resolve, reject){

    try{
        user = await userSchema.create(
            {
                name: "Waqas 3",
                email: "waqas@gmail.com",
                password: "123456"
            }
        );
    }catch (exception){
        reject(exception); //reject the promise
    }

    //runs when the user is created
    if(user){
        resolve(user);//resolve the promise
    }

});

//once the promise is returned
promise.then(
    result => {console.log(result)}, //result = user
    error =>  {console.log(error)}   //error = exception
);