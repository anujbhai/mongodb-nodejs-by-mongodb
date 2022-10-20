require("dotenv").config();
const { MongoClient } = require("mongodb");

async function main() {
  const uri = process.env.DB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    // await listDatabases(client);

    await printCheapestSuburbs(client, "Australia", "Sydney", 10);

    // await createListing(client, {
    //   name: "A Lovely Loft",
    //   summary: "A charming loft in Paris.",
    //   bedrooms:  1,
    //   bathrooms: 1
    // });

    // await createMultipleListings(client, [
    //   {
    //     name: "Infinite Views",
    //     summary: "Modern home with infinite views from",
    //     property_type: "House",
    //     bathrooms: 4.5,
    //     beds: 5,
    //   },
    //   {
    //     name: "Private room in London",
    //     property_type: "Apartment",
    //     bathrooms: 1,
    //     beds: 1,
    //   },
    //   {
    //     name: "Beautiful Beach House",
    //     summary: "Enjoy relaxed beach living in this house with a private beach",
    //     bedrooms: 4,
    //     bathrooms: 2.5,
    //     beds: 7,
    //     last_review: new Date()
    //   }
    // ]);

    // await deleteListingByName(client, "Cosy Cottage");
    // await deleteListingScrapedBeforeDate(client, new Date("2019-02-15"));

    // await updateAllForPropertyType(client);

    // await findOneListingByName(client, "Cosy Cottage");

    // await upsertListingByName(client, "Cosy Cottage", {
    //   name: "Cosy Cottage",
    //   bedrooms: 2,
    //   bathrooms: 2
    // });

    // await findListingsWithMinCriteria(client, {
    //   minNoOfBedrooms: 4,
    //   minNoOfBathrooms: 2,
    //   maximumNoOfResults: 5
    // });
    // await updateListingByName(client, "Infinite Views", {bedrooms: 6, beds: 8});
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

// DELETE FUNCTIONS
async function deleteListingScrapedBeforeDate(client, date) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteMany(
    { "last_scraped": { $lt: date } }
  );

  console.log(`${result.deletedCount} document(s) was/were deleted`);
}

async function deleteListingByName(client, nameOfListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne({ name: nameOfListing });

  console.log(`${result.deletedCount} document(s) was/were deleted`);
}

// UPDATE FUNCTIONS
async function updateAllForPropertyType(client) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany(
    { property_type: { $exists: false } },
    { $set: { property_type: "Unknown" } }
  );

  console.log(`${result.matchedCount} document(s) matched the query criteria`);
  console.log(`${result.modifiedCount} document(s) was/were updated`);
}

async function upsertListingByName(client, nameOfListing, updatedListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne(
    { name: nameOfListing },
    { $set: updatedListing },
    { upsert: true }
  );

  console.log(`${result.matchedCount} document(s) matched the query criteria`);

  if (result.upsertedCount > 0) {
    console.log(`One document was inserted with the Id ${result.upsertedId}`);
  } else {
    console.log(`${result.modifiedCount} document(s) was/were updated`);
  }
}

async function updateListingByName(client, nameOfListing, updatedListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne(
    { name: nameOfListing },
    { $set: updatedListing }
  );

  console.log(`${result.matchedCount} document(s) matched the query criteria`);
  console.log(`${result.modifiedCount} document was/were updated`);
}

// READ FUNCTIONS
async function findListingsWithMinCriteria(client, {
  minNoOfBedrooms = 0,
  minNoOfBathrooms = 0,
  maximumNoOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
  const cursor = await client.db("sample_airbnb")
    .collection("listingsAndReviews")
    .find({
      bedrooms: { $gte: minNoOfBedrooms },
      bathrooms: { $gte: minNoOfBathrooms }
    })
    .sort({ last_review: -1 })
    .limit(maximumNoOfResults);

  const result = await cursor.toArray();

  if (result.length > 0) {
    console.log(`Found listing(s) with at least ${minNoOfBedrooms} bedrooms and ${minNoOfBathrooms} bathrooms:`);

    result.forEach((item, index) => {
      const date = new Date(item.last_review).toDateString();

      console.log(`
        \n${index + 1}. name: ${item.name}
        _id: ${item._id}
        bedrooms: ${item.bedrooms}
        bathrooms: ${item.bathrooms}
        most recent review: ${date}
      `);
    });
  } else {
    console.log(`No listing(s) found with at least ${minNoOfBedrooms} bedrooms and ${minNoOfBathrooms} bathrooms:`);
  }
}

async function findOneListingByName(client, nameOfListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({
    name: nameOfListing
  });

  if (result) {
    console.log(`Found a listing in the collection with the name "${nameOfListing}"`);
    console.log(result);
  } else {
    console.log(`No listing found with the name "${nameOfListing}"`);
  }
}

// CREATE FUNCTIONS
async function createMultipleListings(client, newListings) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

  console.log(`${result.insertedCount} new listings created with the following id(s):`);
  console.log(result.insertedIds);
}

async function createListing(client, newListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

  console.log(`New listing created with the following id: ${result.insertedId}`);
}

// AGGREGATION PIPELINE
async function printCheapestSuburbs(client, country, market, maxLimit) {
  const pipeline = [
    {
      '$match': {
        'bedrooms': 1,
        'address.country': country,
        'address.market': market,
        'address.suburb': {
          '$exists': 1,
          '$ne': ''
        },
        'room_type': 'Entire home/apt'
      }
    }, {
      '$group': {
        '_id': '$address.suburb',
        'averagePrice': {
          '$avg': '$price'
        }
      }
    }, {
      '$sort': {
        'averagePrice': 1
      }
    }, {
      '$limit': maxLimit
    }
  ];

  const aggcursor = client.db("sample_airbnb").collection("listingsAndReviews").aggregate(pipeline);

  await aggcursor.forEach(item => {
    console.log(`${item._id}: ${item.averagePrice}`);
  });
}

// LISTING AVAILABLE DBs
async function listDatabases(client) {
  const dbList = await client.db().admin().listDatabases();

  console.log("Databases: ");

  dbList.databases.forEach(db => {
    console.log(`- ${db.name}`);
  });
}
