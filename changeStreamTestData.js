require("dotenv").config();
const {MongoClient} = require("mongodb");

async function main() {
    const uri = process.env.DB_URI;

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const operaHouseViews = await createListing(client, {
           name: "Opera House Views",
           summary: "Beautiful apartment with views of the iconic Sydney Opera House",
           property_type: "Apartment",
           bedrooms: 1,
           bathrooms: 1,
           beds: 1,
           address: {
            market: "Sydney",
            country: "Australia"
           } 
        });

        const privateRoomInLondon = await createListing(client, {
           name: "Private room in London",
           property_type: "Apartment",
           bedrooms: 1,
           bathrooms: 1,
        });

        const beautifulBeachHouse = await createListing(client, {
           name: "Beautiful Beach House",
           summary: "Enjoy relaxed beach living in this house with a private beach.",
           bedrooms: 4,
           bathrooms: 2.5,
           beds: 1,
           last_review: new Date()
        });

        await updateListing(client, operaHouseViews, {beds: 2});

        await updateListing(client, beautifulBeachHouse, {
            address: {
                market: "Sydney",
                country: "Australia"
            }
        });

        const italianVilla = await createListing(client, {
           name: "Italian Villa",
           property_type: "Entire home/apt",
           bedrooms: 6,
           bathrooms: 4,
           address: {
            market: "Cinque Terre",
            country: "Italy"
           } 
        });

        const sydneyHarbourHome = await createListing(client, {
           name: "Sydney Harbour Home",
           bedrooms: 4,
           bathrooms: 2.5,
           address: {
            market: "Sydney",
            country: "Australia"
           } 
        });

        await deleteListing(client, sydneyHarbourHome);
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
