'use strict';

function history(coin1, coin2) {
    alert('History graphs coming soon', coin1, coin2);
}

var checkedMarkets = {
        showAll: true,
        bittrex: true,
        poloniex: true

    },
    checkedCoins = {
        showAll: false,
        TIC: false,
        PLC: false
    };

let addOne = true;

function addRemoveAll(coinsOrMarkets) {
    if (coinsOrMarkets === 'markets') {
        for (let market in checkedMarkets) {
            checkedMarkets[market] = !checkedMarkets.showAll;
            console.log(checkedMarkets[market]);
            addOne = false;
            addRemoveMarket(market);
            addOne = true;
        }
        useData();
    }

    if (coinsOrMarkets === 'coins') {
        for (let coin in checkedCoins) {
            checkedCoins[coin] = !checkedCoins.showAll;
            console.log(checkedCoins[coin]);
            addOne = false;
            addRemoveCoin(coin)
            addOne = true;
        }
        useData();
    }
}


function addRemoveCoin(coin) {
    if (addOne) checkedCoins[coin] = !checkedCoins[coin];

    if (checkedCoins[coin]) {
        $('#check-' + coin).addClass('fa-check-square-o');
        $('#check-' + coin).removeClass('fa-square-o');
    }
    else {
        $('#check-' + coin).removeClass('fa-check-square-o');
        $('#check-' + coin).addClass('fa-square-o');
    }

    if (addOne) useData();
}

function addRemoveMarket(market) {
    if (addOne){ console.log("If add one"); checkedMarkets[market] = !checkedMarkets[market] };

    if (checkedMarkets[market]) {
        $('#check-' + market).addClass('fa-check-square-o');
        $('#check-' + market).removeClass('fa-square-o');
    }
    else {
        $('#check-' + market).removeClass('fa-check-square-o');
        $('#check-' + market).addClass('fa-square-o')
    }

    if (addOne) useData();
}

function remove(item, highOrLow) {
    let li = $(item).closest('li');
    let coin = li.attr("data-coin");
    let market = li.attr("data-market1");
    checkedCoins[coin] = [];
    checkedCoins[coin].push(market);
    useData();
}

function searchMarketsOrCoins(marketOrCoin, input) {
    input = input.toUpperCase();
    let listItems = $('#' + marketOrCoin + '-list > li');

    if (input === "") {
        listItems.show();
    } else {
        listItems.each(function () {
            let text = $(this).text().toUpperCase();
            (text.indexOf(input) >= 0) ? $(this).show() : $(this).hide();
        });
    }
}

let useData;

$(window).load(function () {
    new WOW().init();

    $('.loader').hide();
    $('#header').show();

    let socket = io('http://localhost:3000/');

    let numberOfLoads = 0; //Number of final results loads
    let numberOfMLoads = 0; //Number of Market loadss


    socket.on('coinsAndMarkets', function (data) { //Function for when we get market data
        if (numberOfMLoads === 0) {  //Only  need to run this function once (Currently)
            let list = $('#market-list').empty(), coinList = $('#coin-list').empty();

            let marketSource = $("#market-list-template").html(); //Source
            let marketTemplate = Handlebars.compile(marketSource); // ^ and template for coin and market lists

            let coinSource = $("#coin-list-template").html(); //Source
            let coinTemplate = Handlebars.compile(coinSource); // ^ and template for coin and market lists

            let coinDataLen = data.marketNames.length;
            for (let i = 0; i < coinDataLen; i++) { //Loop through coins
                let context = {coin: data.coinNames[i]};
                let coin = context.coin;
                if (data.coinNames[i]) {
                    context.market = data.marketNames[i].marketName;
                    let market = context.market;
                    list.append(marketTemplate(context));
                    if (checkedMarkets[market] === false || checkedMarkets[market] === undefined) {
                        checkedMarkets[market] = false;
                        $('#check-' + market).removeClass('fa-check-square-o');
                        $('#check-' + market).addClass('fa-square-o')
                    }
                }

                coinList.append(coinTemplate(context));
                if (checkedCoins[coin] === undefined) checkedCoins[coin] = true;
                else {
                    $('#check-' + JSON.stringify(coin)).removeClass('fa-check-square-o');
                    $('#check-' + JSON.stringify(coin)).addClass('fa-square-o');
                }
            }
            numberOfMLoads++;
        }
    });

    let highest = $('#highest'); //Highest UL
    let highSource = $("#high-template").html(); //Template source
    let highTemplate = Handlebars.compile(highSource); //Template

    let bestSource = $("#best-template").html();
    let bestTemplate = Handlebars.compile(bestSource);

    let bestSpreadDiv = $('.best-spread');
    let bestSpreadSource = $("#highestSpread-template").html();
    let bestSpreadTemplate = Handlebars.compile(bestSpreadSource);

    var data;

    $('#coin-search').keyup(function () {
        let value = $(this).val();
        console.log(value);
        searchMarketsOrCoins("coin", value)
    });
    $('#market-search').keyup(function () {
        let value = $(this).val();
        searchMarketsOrCoins("market", value)
    });

    $('.loadNumberInput').change(function () {
        useData();
    });
    function allowedData(lowMarket, highMarket, coinName) {
        if(checkedMarkets[lowMarket] && checkedMarkets[highMarket] && checkedCoins[coinName]){
            if(Array.isArray(checkedCoins[coinName])) {
                if(!checkedCoins[coinName].includes(lowMarket) && !checkedCoins[coinName].includes(highMarket)) {
                    return true;
                }
                else return false;
            }
            else{
                return true;
            }
        }
        else {
            return false;
        }
    }
    function findBestSpread(data, topN) {
        let bestSpread = []
        let dataLen = data.length;
        for (let i = 0; i < dataLen; i++) {  //Loop through top n by spread
            let marketA = data[i].marketA
            let marketB = data[i].marketB
            let pairIndex
            let coinName = data[i].ticker;
            if (allowedData(marketA, marketB, coinName)) {
                bestSpread.push(data[i])
            } 
        }
        return bestSpread
    }

    useData = function () {
        //bootstrap if theres no data yet
        if (!data[0]) {setTimeout(() => {
          useData()
        }, 200)}
            
        let topN = $('.loadNumberInput').val();
        if (!topN) topN = 5;
        let highestN = 1;
        let initN = 1;
        let dataLen = data.length;
        
        
        let sortedBySpread = data.sort(function(a,b) {
            return b.spread - a.spread
        })
        let bestSpread = findBestSpread(sortedBySpread, topN)
        if(bestSpread[0] != null) {
            bestSpreadDiv.empty();  //Remove any previous data (LI) from UL
            let bestSpreadHTML = bestSpreadTemplate({
                coin : bestSpread[0].ticker,
                marketA: bestSpread[0].marketA,
                market1price: bestSpread[0].lastPriceA,
                market2price: bestSpread[0].lastPriceB,
                marketB: bestSpread[0].marketB,
                diff: ((bestSpread[0].spread - 1) * 100).toFixed(2),
            });
            bestSpreadDiv.append(bestSpreadHTML);    
        }

        for (let i = dataLen - initN; i >= dataLen - topN; i--) { //Loop through top 10
            let highMarket = data[i].marketA, 
                lowMarket = data[i].marketB, 
                pairIndex,
                coinName = data[i].ticker;
            if (allowedData(lowMarket, highMarket, coinName)) {
                for (let j = data.length - 1; j >= 0; j--) {
                    if (
                        data[j].marketB === highMarket //equal ...
                        && data[j].marketA === lowMarket // to opposite market
                        && data[i].ticker !== data[j].ticker //and isnt the same coin as pair
                        && data[j].ticker !== 'BTC' //and isnt BTC
                        && checkedCoins[data[j].ticker] //and isnt remove
                        && checkedCoins[data[j].ticker][0] !== highMarket
                        && checkedCoins[data[j].ticker][0] !== lowMarket) // and isnt disabled
                    {
                        pairIndex = j;
                        break;
                    }
                }
                if (pairIndex > -1) {
                    let market1price = (data[i].lastPriceA * 1000).toPrecision(3),
                        market2price = (data[i].lastPriceB * 1000).toPrecision(3)
   
                    let context = { //All required data
                        coin: data[i].ticker,
                        diff: ((data[i].spread - 1) * 100).toFixed(2),
                        market2price: market1price,
                        market2: highMarket,
                        market1price: market2price,
                        market1: lowMarket,
                        pair: {
                            coin: data[pairIndex].ticker,
                            diff: ((data[pairIndex].spread - 1) * 100).toFixed(2),
                            market2price: market2price,
                            market2: data[pairIndex].marketA,
                            market1price: market1price,
                            market1: data[pairIndex].marketB,
                        },
                        totalDiff: (((data[i].spread - 1) * 100) + ((data[pairIndex].spread - 1) * 100)).toFixed(2)
                    };

                    if (i === data.length - highestN) { //Add only the highest
                        $('.best-pair').empty();
                        let bestHTML = bestTemplate(context);
                        $('.best-pair').append(bestHTML);
                    }

                    let html = highTemplate(context);
                    highest.append(html);
                }
                else if (data.length - topN > 0) {
                    topN++;
                    highestN++;
                }
            }

            else if (data.length - topN > 0) {
                topN++;
                highestN++;
            }
        }
    }

    let waitForMoreData;

    socket.on('results', function (results) {
        clearTimeout(waitForMoreData); //Every time we recieive new data clear the previous timeout so we don't loop through the data too many times unnecessarily...
        numberOfLoads++;
        if (numberOfLoads === 1) { //...unless we haven't loaded the data yet, then just run useData() immediately.
            $('.socket-loader').hide(); // Hide the preloader.gif
            $('#highest, #lowest').show(); //Show The UL
            data = results;
            useData();
        }

        else {
            waitForMoreData = setTimeout(function () {
                data = results;
                useData();
            }, 1000); //Wait a second before we run the function in case we get newer data within less than a second
        }

    });

});




