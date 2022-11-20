# About this Project
# Frameworks - Libraries
Below are some major libs being used.  
expressjs  
mongodb  
mongoose  
axios

# Mongoose
is being used to interact with mongodb server

One of the goal is to turn it into a npm package  
as a wrapper around coinmarketcap api. Generate methods  
and functions for data fetching.

So, instead of calling the coinmarketcap api directly,  
listOfAll(){

    const allCryptoCurrencies = {
        [
            {id: 1, symbol: BTC, name:bitcoin, ...., },
            {id: 2, symbol: ETH, name:ethereum, ...., }
        ]    
    }
    return allCryptoCurrencies;
}

getCurrencyNews($currencyName){  
    const news = {  
        [  
            {title: "News Title", : description: ""....."}
        ]   
    }
    return news;
}

More....