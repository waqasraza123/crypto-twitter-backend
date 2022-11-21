# About this Project
# Frameworks - Libraries
Below are some major libs being used.  
expressjs  
mongodb  
mongoose  
axios  
jsonwebtoken

# Mongoose
is being used to interact with mongodb server

# Authentication Flow
`/register`  
User registers with email, password  
accessToken, refreshToken will also be returned

`/login`  
user logins with email, password  
accessToken, refreshToken will also be returned


`AccessToken` & `RefreshToken` will be used to access  
the rest of the APIs.

# JWT Authentication
`/auth/login` -> returns accessToken to be used  
`/auth/register` -> registers and returns tokens  
`/auth/token` -> accepts refreshToken|email and returns a new accessToken  
`/auth/logout` -> deletes the refreshToken

One of the goal is to turn it into a npm package  
as a wrapper around coinmarketcap api. Generate methods  
and functions for data fetching.

So, instead of calling the coinmarketcap api directly,  
```
listOfAll(){

    const allCryptoCurrencies = {
        [
            {id: 1, symbol: BTC, name:bitcoin, ...., },
            {id: 2, symbol: ETH, name:ethereum, ...., }
        ]    
    }
    return allCryptoCurrencies;  
}
```

```
getCurrencyNews($currencyName){  

    const news = {  
        [  
            {title: "News Title", : description: "bla bla ..."},
            {title: "News Title 2", : description: "bla bla ..."}
        ]   
    }
    
    return news;
}
```

More....