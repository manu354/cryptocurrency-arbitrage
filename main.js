/**
 * Created by Manu Masson on 6/27/2017.
 *
 */

'use strict';

const request = require('request'), Promise = require("bluebird"); //request for pulling JSON from api. Bluebird for Promises.


// coin_prices is an object with data on price differences between markets. = {BTC : {market1 : 2000, market2: 4000, p : 2}, } (P for percentage difference)
// results is a 2D array with coin name and percentage difference, sorted from low to high.
let coin_prices = {}, results = []; // GLOBAL variables to get pushed to browser.

function getMarketData(options, coin_prices, callback) { //GET JSON DATA
    return new Promise(function (resolve, reject) {
        request(options.URL, function (error, response, body) {
            try {
                let data = JSON.parse(body);

                if (options.marketName) {
                    let newCoinPrices;

                    newCoinPrices = options.last(data, coin_prices, options.toBTCURL);


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
    for(let coin in data) {

        if(Object.keys(data[coin]).length > 1) {
            let arr= [];
            for( let market in data[coin]) {
                // console.log(coin, market, data[coin][market]);
                arr.push([market, data[coin][market]]);
            }
            arr.sort(function(a, b) {
                return a[1] - b[1];
            });

            let min = arr[0][1], max = arr[arr.length-1][1];
            // console.log(min, max);

            if(min == 0) min = arr[1][1];
            if(max == 0) max = arr[arr.length-2][1];

            if(min != 0 && max != 0) {
                let marketPair = arr[arr.length-1][0] + "/" + arr[0][0];

                results.push([coin, max/min, marketPair]);
            }
        }
    }
    results.sort(function(a, b) {
        return a[1] - b[1];
    });
    console.log(results);
}





const market1Settings = {
        marketName: 'bittrex',
        URL: 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
        toBTCURL: false,
        last: function (data, coin_prices) { //Where to find the last price of coin in JSON data
            return new Promise(function (res, rej) {
                try {
                    console.log(coin_prices);
                    for (let obj of data.result) {
                        let coinName = obj["MarketName"].replace("BTC-", '');

                        if (!coin_prices[coinName]) coin_prices[coinName] = {};
                        coin_prices[coinName].bittrex = obj.Last;
                    }
                    res(coin_prices);
                }
                catch (err) {
                    rej(err);
                }

            })
        }
    },

    market2Settings = {
        marketName: 'btc38',
        URL: 'http://api.btc38.com/v1/ticker.php?c=all&mk_type=cny',
        toBTCURL: false,

        last: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
            return new Promise(function (res, rej) {
                let priceOfBTC = data.btc.ticker.last;
                try {
                    for (let key in data) {
                        let coinName = key.toUpperCase();
                        let price = data[key]['ticker'].last;
                        if (!coin_prices[coinName]) coin_prices[coinName] = {};

                        coin_prices[coinName]["btc38"] = data[key]['ticker'].last / priceOfBTC;
                    }
                    res(coin_prices);
                }

                catch (err) {
                    console.log(err);
                    rej(err)
                }
            })
        }
    };

async function makeAQuoteBook(quoteBookSettings) {
    // console.log("heloo");
    let arrayOfRequests = [getMarketData(market1Settings, coin_prices), getMarketData(market2Settings, coin_prices)];

    await Promise.all(arrayOfRequests.map(p => p.catch(e => e)))

        .then(results => computePrices(coin_prices))

        .catch(e => console.log(e));

    // return sortedPairs;
}


makeAQuoteBook()
    .then(v => {
        // console.log(v);
    });
