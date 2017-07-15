'use strict';

function history(coin1, coin2) {
    console.log(coin1, coin2);
    alert('History graphs coming soon');
}

$(window).load(function () {
    new WOW().init();

    $('.loader').hide();
    $('#header').show();

    let socket = io('https://ccarbitrage.azurewebsites.net/');

    let numberOfLoads = 0; //Number of final results loads
    let numberOfMLoads = 0; //Number of Market loadss


    socket.on('marketNames', function (data) { //Function for when we get market data
        if (numberOfMLoads === 0) {  //Only  need to run this function once (Currently)

            let list = $('#market-list').empty(), coinList = $('#coin-list').empty();

            let source = $("#market-list-template").html(); //Source
            let template = Handlebars.compile(source); // ^ and template for coin and market lists

            for (let i = data.length - 1; i >= 0; i--) { //Loop through markets
                let context = {market: data[i], coin : data[i]}; //
                list.append(template(context));
                coinList.append(template(context))
            }
            numberOfMLoads++;
        }
    });

    let highest = $('#highest'); //Highest UL
    let highSource = $("#high-template").html(); //Template source
    let highTemplate = Handlebars.compile(highSource); //Template

    let bestSource = $("#best-template").html();
    let bestTemplate = Handlebars.compile(bestSource);

    function useData(data) {
        highest.empty();  //Remove any previous data (LI) from UL

        let topN = 5;
        for (let i = data.length - 1; i >= data.length - topN; i--) { //Loop through top 10
            let lowMarket = data[i][4], highMarket = data[i][5], pairIndex;
            for (let j = data.length - 1; j >= 0; j--) {
                if (data[j][4] === highMarket && data[j][5] === lowMarket && data[i][0] !== data[j][0]) {
                    pairIndex = j;
                    break;
                }
            }
            let context = { //All required data
                coin: data[i][0],
                diff: ((data[i][1] - 1) * 100).toFixed(2),
                market2price: (data[i][2] * 1000).toPrecision(3),
                market2: lowMarket,
                market1price: (data[i][3] * 1000).toPrecision(3),
                market1: highMarket,
                pair: {
                    coin: data[pairIndex][0],
                    diff: ((data[pairIndex][1] - 1) * 100).toPrecision(3),
                    market2price: (data[pairIndex][2] * 1000).toFixed(2),
                    market2: data[pairIndex][4],
                    market1price: (data[pairIndex][3] * 1000).toPrecision(3),
                    market1: data[pairIndex][5],
                },
                totalDiff : (((data[i][1] - 1) * 100) +  ((data[pairIndex][1] - 1) * 100)).toFixed(2)
            };

            if(i === data.length -1){ //Add only the highest
                $('.best-pair').empty();
                let bestHTML = bestTemplate(context);
                $('.best-pair').append(bestHTML);
            }


            let html = highTemplate(context);
            highest.append(html);
        }

        console.log(numberOfLoads)
    }

    let waitForMoreData;

    socket.on('news', function (data) {
        clearTimeout(waitForMoreData); //Every time we recieive new data clear the previous timeout so we don't loop through the data too many times unnecessarily...
        numberOfLoads++;

        if (numberOfLoads === 1) { //...unless we haven't loaded the data yet, then just run useData() immediately.
            $('.socket-loader').hide(); // Hide the preloader.gif
            $('#highest, #lowest').show(); //Show The UL
            useData(data);
        }

        else {
            waitForMoreData = setTimeout(function () {
                useData(data);
            }, 1000); //Wait a second before we run the function in case we get newer data within less than a second
        }

    });


});




