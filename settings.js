//
// let boilerPlateMarket =
// {
//     marketName: '',
//     URL: '', //URL To Fetch API From.
//     toBTCURL: false, //URL, if needed for an external bitcoin price api.
//     last: function (data, coin_prices) { //Get the last price of coins in JSON data
//         return new Promise(function (res, rej) {
//             try {
//                 for (x in / of data) {
//                     price = ...;
//                     coin_prices[coinName][marketName] = price;
//                 }
//                 res(coin_prices);
//             }
//             catch (err) {
//                 rej(err);
//             }
//
//         })
//     },
//
//
// }


let markets = [
    {
        marketName: 'bittrex',
        URL: 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
        toBTCURL: false,
        last: function (data, coin_prices) { //Where to find the last price of coin in JSON data
            return new Promise(function (res, rej) {
                try {
                    for (let obj of data.result) {
                        let coinName = obj["MarketName"].replace("BTC-", '');

                        if (!coin_prices[coinName]) coin_prices[coinName] = {};
                        coin_prices[coinName].bittrex = obj.Last;
                    }
                    res(coin_prices);
                }
                catch (err) {
                    console.log(err);
                    rej(err);
                }

            })
        },

    },

    {
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
    },

    {
        marketName: 'jubi',
        URL: 'https://www.jubi.com/api/v1/allticker/', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.

        last: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
            return new Promise(function (res, rej) {
                let priceOfBTC = data.btc.last;
                console.log(priceOfBTC);
                try {
                    for (let key in data) {
                        let coinName = key.toUpperCase();
                        let price = data[key].last;
                        if (!coin_prices[coinName]) coin_prices[coinName] = {};

                        coin_prices[coinName]["jubi"] = data[key].last / priceOfBTC;
                    }
                    res(coin_prices);
                }

                catch (err) {
                    console.log(err);
                    rej(err)
                }
            })
        }

    },

    {
        marketName: 'cryptowatchAPI',
        URL: 'https://api.cryptowat.ch/markets/summaries', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.

        last: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
            return new Promise(function (res, rej) {
                try {
                    data = data.result;
                    for (let key in data) {
                        let marketPair = key.split(':');
                        let market = marketPair[0], pair = marketPair[1];
                        let indexOfBTC = pair.indexOf('btc');
                        if (indexOfBTC > 0 && !pair.includes('future') && !market.includes('qryptos') && !market.includes('quoine')) {
                            if(marketNames.indexOf(market) > -1 ){
                                marketNames.push(market);
                            }
                            let coin = pair.replace(/btc/i, '').toUpperCase();
                            let price = data[key].price.last;
                            if(price > 0) {
                                if (!coin_prices[coin]) coin_prices[coin] = {};
                                coin_prices[coin][market] = price;

                            }
                        }
                    }
                    res(coin_prices);
                }
                catch (err) {
                    console.log(err);
                    rej(err)
                }
            })
        }

    }


];

let marketNames = [];
for(let i = 0; i < markets.length; i++) {
    marketNames.push(markets[i].marketName);
}
console.log("Markets:", marketNames);
module.exports = function () {
    this.markets = markets;
    this.marketNames = marketNames;
};