/**
 * Created by Manu Masson on 6/27/2017.
 *
 */
'use strict';

const request = require('request'),
    Promise = require("bluebird"); //request for pulling JSON from api. Bluebird for Promises.

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
    socket.emit('coinsAndMarkets', [marketNames, coinNames]);
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
                    console.log("Error getting JSON response from", options.URL, error); //Throws error
                    throw new Error(error)
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
    //console.log('computiing price ' + data )
    if (numberOfRequests >= 2) {
        results = [];

        for (let coin in data) {
            if (Object.keys(data[coin]).length > 1){
                if(coinNames.includes(coin) == false) {
                    coinNames.push(coin);
                }
                let arr = [];
                for (let market in data[coin]) {
                    arr.push([data[coin][market], market]);
                }
                arr.sort(function (a, b) {
                    return a[0] - b[0];
                });
                for (let i = 0; i < arr.length; i++) {
                    for (let j = i + 1; j < arr.length; j++) {
                        results.push([coin, arr[i][0] / arr[j][0], arr[i][0], arr[j][0], arr[i][1], arr[j][1] ], [coin, arr[j][0] / arr[i][0], arr[j][0], arr[i][0], arr[j][1], arr[i][1]]);
                    }
                }
            }
        }
        results.sort(function (a, b) {
            return a[1] - b[1];
        });
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
    Promise.all( 
        getTickerData(markets))
    .then(results => {
        console.log('numberOfRequests ' + numberOfRequests);
         return computePrice(results)
    })
    .catch(error => console.log( error))
    .then(results => {
        results.map((result)=> {
            io.emit('results', result);
        })        
    }).catch(error => console.log( error))
    
    setTimeout(main, 20000);
};
main()
