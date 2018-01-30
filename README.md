[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# Crypto Arbitrage - a node.js script to help find and act on arbitrage opportunities. 
A cryptocurrency arbitrage opportunity calculator and trading bot. Over 800 currencies and 50 markets.

To use, go to https://manu354.github.io/cryptocurrency-arbitrage/ (this link no longer links to the old site, download from github to use the tool) , for development install nodejs ^V8.00 and run `npm install` in the folder where the script `main.js` is. To run the program write `node main` or `npm start`. To change market settings, and to add your own markets edit the `settings.js` file.

## Notice: 
I am now only focusing on the trading bot. Unfortunately I am going to keep that code private, and will not have time to work on this public version. Feel free to still make pull requests - I will still take a look at any issues when they pop up.

## Short term **roadmap** 

**Hopefully all done within a month, faster with some help :)**

* **V1.0.0** ~~core server code - logs the results to the terminal. No bot functionailty. No frontend.~~
* **v1.1.0** - ~~create api endpoints and display data on a minimal front end.~~
* **v1.2.0** - ~~host server and implement websockets.~~
* **v1.3.0** - ~~add the top 10 most popular cc markets manually.~~ [bugs](https://github.com/manu354/arbitrage/wiki/bugs-v1.3.0)
* **v1.4.0** - ~~make the frontend actually look like something, not just display the raw data~~
* Current: **v1.5.0** - ~~let users disable specific markets and coins.~~ ~~TODO: addRemoveAll() and search through list~~
* **V1.5.1** - peg BTC to USD for each exchange
* **V1.5.2** - more info tab: show maximum volume (maybe?) and highest bid / lowest ask for each opportunity
* **V1.5.3** - design a movile view for the frontend
* **V1.5.4** - don't show / warn about disabled coins on exchanges
* **v1.5.5** - implement fees into the final profit
* **v1.6.0** - add graphs with history of arbitrage opportunities for every coin. 
* **v1.7.0** - account login/signup functionialty with passport to allow users to add their own markets.
* **v2.0.0** - Implement a trading bot for atleast 2 markets.

**...** 

## How it works

In short it collects JSON from multipile different cryptocurrency markets, and goes through the results and finds the highest and lowest price for each coin. For example if the results look like this for LTC:
```javascript
ltc : {
  'bittrex' : 38.23,
  'jubi' : 39.78,
  'chbtc' : 51.8,
}
```
the script will find the the highest price (chbtc.com), lowest price (bittrex), and divide the two: 51.8/38.23 = ~1.35 (~35% profit margin) and then pushes these results to the browser. It will also find the next highest market pairs, e.g. chbtc / jubi is the second highest pair and chbtc/bittrex the third, jubi/bittrex the fourth and so on until every possible combination has been computed.



### For more details go to the [wiki](https://github.com/manu354/arbitrage/wiki/How-the-script-works) (In progress) or look at the code :)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Required: Node.js **^ V8.0.0** this program uses ES7 features such as async/await and requires a newer version of node.

### Installing

In a terminal write the following:

CD into the correct folder.

```shell
cd arbitrage
```

Install the required npm modules

```shell
npm install
```

To run the program

```shell
npm start
```

Go to ```localhost:3000``` to see a minimal display of the raw data

## Adding and removing markets - [wiki](https://github.com/manu354/arbitrage/wiki/How-to-add-a-market)

Currently you will have to add a market object with the correct settings in the array `markets`, situated in the `settings.js` file. I am updating the project every day and this will change soon.  (Will be able to add a market from the frontend soon)

You can temporarily stop loading a market from the frontend, or remove the market by deleting the object in `settings.js`

For more information see the [wiki](https://github.com/manu354/arbitrage/wiki/How-to-add-a-market) on adding markets.

## Built and deployed with

* [Node.JS](https://nodejs.org) - For the backend
* [Azure](http://ccarbitrage.azurewebsites.net/) - hosts the backend (directly from this github repo)
* [Github Pages](https://manu354.github.io/cryptocurrency-arbitrage/) - hosts the beautiful frontend :) (gets data from hosted node instance on azure)

## Contributing

Feel free to suggest edits / pull requests or email me at manummasson8@gmail.com

## Authors

* **Manu Masson** - *Initial work* 

## License

See the [LICENSE.md](LICENSE.md) file for details

## Donating

BTC: 1DpMyyPoBSVNZqhM6d4k1TdYun1XpXaeMo
LTC: LVXCvcV52unCdcqvyvKp6mC6AAVur1EZ57
