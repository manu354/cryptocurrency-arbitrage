
# Arbitrage - a node.js script to help find and act on arbitrage opportunities. 
A cryptocurrency arbitrage opportunity calculator and trading bot. Over 800 currencies and 50 markets.

To use, install nodejs and run `npm install` in the folder where the script `main.js` is. To run the program write `node main` or `npm start`. To change market settings, and to add your own markets edit the `settings.js` file.

## Short term **roadmap** 

**Hopefully all done within a month, faster with some help :)**

* Current: **V1.0** core server code - logs the results to the browser. No bot functionailty. No frontend.
* **V1.1** - create api endpoints and display data on a minimal front end.
* **V1.2** - host server and implement websockets.
* **V1.5** - account login/signup functionialty with passport - allow users to add their own markets / disable markets.
* **V1.8** - add graphs with history of arbitrage opportunities for every coin. 
* **V2.0** - Implement a trading bot for atleast 2 markets.
**...** 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. A live website displaying the data will be available soon. 

### Prerequisites

Required: Node.js ** ^ V8.0.0** this program uses ES7 features such as async/await and requires a newer version of node.

### Installing

CD into the correct folder. In a terminal write the following:

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

Currently you will have to add an object in the main.js. I am updating the project every day and this will change soon.  (Will be able to change from frontend soon)

## Built and deployed with

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Feel free to suggest edits / pull requests or email me at manummasson8@gmail.com

## Authors

* **Manu Masson** - *Initial work* 

## License

See the [LICENSE.md](LICENSE.md) file for details
