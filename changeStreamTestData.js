require("dotenv").config();
const {MongoClient} = require("mongodb");

async function main() {
    const uri = process.env.DB_URI;

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const operaHouseViews = await createListing(client, {

        });

        const privateRoomInLondon = await createListing(client, {

        });

        const beautifulBeachHouse = await createListing(client, {

        });
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function createListing(client, newListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

  console.log(`New listing created with the following id: ${result.insertedId}`);

  return result.insertedId;
}

async function updateListing(client, listingId, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne(
        {_id: listingId},
        {$set: updatedListing}
    );

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} document was/were updated`);
}

async function deleteListing(client, listingId) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne({_id: listingId});

    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}
