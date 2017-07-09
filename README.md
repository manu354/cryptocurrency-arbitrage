
# Arbitrage - a node.js script to help find and act on arbitrage opportunities. 
A cryptocurrency arbitrage opportunity calculator and trading bot. Over 800 currencies and 50 markets.

To use, install nodejs ^V8.00 and run `npm install` in the folder where the script `main.js` is. To run the program write `node main` or `npm start`. To change market settings, and to add your own markets edit the `settings.js` file.

## Short term **roadmap** 

**Hopefully all done within a month, faster with some help :)**

* Current: **V1.0.0** core server code - logs the results to the terminal. No bot functionailty. No frontend.
* **V1.1.0** - create api endpoints and display data on a minimal front end.
* **V1.2.0** - host server and implement websockets.
* **V1.3.0** - add the top 10 most popular cc markets manually.
* **V1.4.0** - account login/signup functionialty with passport - allow users to add their own markets / disable markets.
* **V1.5.0** - add graphs with history of arbitrage opportunities for every coin. 
* **V2.0.0** - Implement a trading bot for atleast 2 markets.

**...** 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. A live website displaying the data will be available soon. 

### Prerequisites

Required: Node.js **^ V8.0.0** this program uses ES7 features such as async/await and requires a newer version of node.

### Installing

In a terminal write the following:

CD into the correct folder.

```
cd arbitrage
```

Install the required npm modules

```
npm install
```

To run the program

```
npm start
```

In the terminal you will see an array of values ordered lowest to highest.  (Frontend coming soon)

## Adding and removing markets

Currently you will have to add a market object with the correct settings in the array `markets`, situated in the `settings.js` file. I am updating the project every day and this will change soon.  (Will be able to add a market from the frontend soon)

## Built and deployed with

* [Node.JS](https://nodejs.org) - For the backend

## Contributing

Feel free to suggest edits / pull requests or email me at manummasson8@gmail.com

## Authors

* **Manu Masson** - *Initial work* 

## License

See the [LICENSE.md](LICENSE.md) file for details
