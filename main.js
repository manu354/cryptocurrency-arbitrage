/**
 * Created by Manu Masson on 6/27/2017.
 *
 */
'use strict';

const request = require('request'),
    Promise = require("bluebird"), //request for pulling JSON from api. Bluebird for Promises.
    BigNum = require('decimal.js');
const app = require('express')(),
    helmet = require('helmet'),
    http = require('http').Server(app),
    io = require('socket.io')(http);
// For websocket server functionality
app.use(helmet.hidePoweredBy({setTo: 'PHP/5.4.0'}));
// app.use(cors({credentials: false}));
const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


http.listen(port, function () {
    console.log('listening on', port);
});

require('./settings.js')(); //Includes settings file. (Market info)

let coinNames = [];
// coin_prices is an object with data on price differences between markets. = {BTC : {market1 : 2000, market2: 4000, p : 2}, } (P for percentage difference)
// results is a 2D array with coin name and percentage difference, sorted from low to high.
let coin_prices = {}, 
    numberOfRequests = 0, 
    results = []; // GLOBAL variables to get pushed to browser.
io.on('connection', function (socket) {
    socket.emit('coinsAndMarkets', {"marketNames" : marketNames, 'coinNames' : coinNames});
    socket.emit('results', results);
});


function getMarketData(options, coin_prices, callback) { //GET JSON DATA
    return new Promise(
        function (resolve, reject) {  
            request(options.URL, function (error, response, body) {
                let data
                if(error) {
                    console.log("Error getting JSON response from", options.URL, error); //Throws error
                    throw new Error('error ' + error)    
                }
                try {
                    data = JSON.parse(body);
                } catch(error) {
                    console.log("Error parsing JSON response from", options.URL, error); //Throws error
                    console.log("skipping"); //Throws error
                    //next()
                }
                if (options.marketName) {
                    let newCoinPrices;
                    newCoinPrices = options.last(data, coin_prices, options.toBTCURL);
                    numberOfRequests++;
                    resolve(newCoinPrices);
                }
        })
    })
}

async function computePrices(data) {
    if (numberOfRequests >= 2) {
        results = [];
        for (let coin in data) {
            if (Object.keys(data[coin]).length > 1){
                if(coinNames.includes(coin) == false) {
                    coinNames.push(coin);
                }
                let arr = [];
                for (let market in data[coin]) {
                    arr.push({"lastPrice" : new BigNum(data[coin][market]), "market": market});
                }
                arr.sort(function (a, b) {
                    return b.lastPrice.minus(a.lastPrice);
                });
                let arrLen = arr.length 
                for (let i = 0; i < arrLen - 1; i++) {
                    for (let j = i + 1; j < arrLen; j++) {
                        results.push({
                            ticker : coin, 
                            spread : arr[i].lastPrice.dividedBy(arr[j].lastPrice).toString(), 
                            lastPriceA : arr[i].lastPrice, 
                            lastPriceB : arr[j].lastPrice,
                            marketA : arr[i].market, 
                            marketB : arr[j].market
                        });
                    }
                }
            }
        }
        // ??
  /*      results.sort(function (a, b) {
            return a[1] - b[1];
        });*/
        return results
    }
}

async function getTickerData(urls) {
    return Promise.all(urls.map(function(url) {
        return getMarketData(url, coin_prices).reflect()
    })).filter(function(promise) {
        return promise.isFulfilled();
    })
}
async function computePrice(tickers) {
    return Promise.all(tickers.map((ticker) => {
            return computePrices(ticker.value())
        })
    )
}

async function main() {
    Promise.all(getTickerData(markets))
    .then(results => {
         return computePrice(results)
    })
    .catch(error => console.log("error " + error))
    .then(results => {
        results.map((result)=> {
            io.emit('results', result);
        })        
    })
    .catch(error => console.log("error " + error))
    
    setTimeout(main, 25000);
};
main()
