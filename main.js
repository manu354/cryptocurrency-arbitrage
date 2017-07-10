/**
 * Created by Manu Masson on 6/27/2017.
 *
 */

'use strict';

const request = require('request'), Promise = require("bluebird"); //request for pulling JSON from api. Bluebird for Promises.

const app = require('express')(), helmet = require('helmet'), cors = require('cors'), http = require('http').Server(app),
    io = require('socket.io')(http); // For websocket server functionality
app.use(helmet.hidePoweredBy({setTo: 'PHP/5.4.0'}));
app.use(cors({credentials: false}));
const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.emit('news', results);
});

http.listen(port, function () {
    console.log('listening on *:3000');
});


require('./settings.js')(); //Includes settings file.

// coin_prices is an object with data on price differences between markets. = {BTC : {market1 : 2000, market2: 4000, p : 2}, } (P for percentage difference)
// results is a 2D array with coin name and percentage difference, sorted from low to high.
let coin_prices = {}, numberOfRequests = 0, results = []; // GLOBAL variables to get pushed to browser.

function getMarketData(options, coin_prices, callback) { //GET JSON DATA
    return new Promise(function (resolve, reject) {
        request(options.URL, function (error, response, body) {
            try {
                let data = JSON.parse(body);

                if (options.marketName) {

                    let newCoinPrices;

                    newCoinPrices = options.last(data, coin_prices, options.toBTCURL);
                    numberOfRequests++;
                    if(numberOfRequests >=1) computePrices(coin_prices);
                    resolve(newCoinPrices);

                }
                else {
                    resolve(data);
                }

            } catch (error) {
                console.log("Error getting JSON response from", options.URL, error); //Throws error
                reject(error);
            }

        });


    });
}

function computePrices(data) {
    if(numberOfRequests >= 2) {
        results = [];
        for (let coin in data) {

            if (Object.keys(data[coin]).length > 1) {
                let arr = [];
                for (let market in data[coin]) {
                    arr.push([market, data[coin][market]]);
                }
                arr.sort(function (a, b) {
                    return a[1] - b[1];
                });

                let min = arr[0][1], max = arr[arr.length - 1][1];

                if (min == 0) min = arr[1][1];
                if (max == 0) max = arr[arr.length - 2][1];

                if (min != 0 && max != 0) {
                    let marketPair = arr[arr.length - 1][0] + "/" + arr[0][0];

                    results.push([coin, max / min, marketPair]);
                }
            }
        }
        results.sort(function (a, b) {
            return a[1] - b[1];
        });

        io.emit('news', results);
        console.log(results);
    }
}


(async function main() {
    let arrayOfRequests = [];

    for (let i = 0; i <= markets.length; i++) {
        arrayOfRequests.push(getMarketData(markets[i], coin_prices));
    }

    await Promise.all(arrayOfRequests.map(p => p.catch(e => e)))

        .then(results => computePrices(coin_prices))

        .catch(e => console.log(e));

    setTimeout(main, 10000);
})();

// .then(v => {
//        // console.log(v);
//    });
