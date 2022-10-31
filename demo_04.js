
require("dotenv").config();
const {MongoClient} = require("mongodb");

async function main() {
  const uri = process.env.DB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
  } finally {
    await client.close();
  }
}

main().catch(console.error);

/**
 * Close the given change stream after the given amount of time
 * @param {*} timeInMs The amount of time in ms to monitor listings
 * @param {*} changeStream The open change stream that should be closed
 */
function closeChangeStream() {}

/**
 * Monitor listings in the listingsAndReviews collections for changes
 * This function uses the on() function from the EventEmitter class to monitor changes
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {Number} timeInMs The amount of time in ms to monitor listings
 * @param {Object} pipeline An aggregation pipeline that determines which change events should be output to the console
 */
async function monitorListingsUsingEventEmitter() {}

/**
 * Monitor listings in the listingsAndReviews collections for changes
 * This function uses the hasNext() function from the MongoDB Node.js Driver's ChangeStream class to monitor changes
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {Number} timeInMs The amount of time in ms to monitor listings
 * @param {Object} pipeline An aggregation pipeline that determines which change events should be output to the console
 */
async function monitorListingsUsingHasNext() {}

/**
 * Monitor listings in the listingsAndReviews collection for changes
 * This function uses the Stream API (https://nodejs.org/api/stream.html) to monitor changes
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {Number} timeInMs The amount of time in ms to monitor listings
 * @param {Object} pipeline An aggregation pipeline that determines which change events should be output to the console
 */
async function monitorListingsUsingStreamAPI() {} 
