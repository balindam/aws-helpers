const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const AWS = require('aws-sdk');
const fs = require('fs');

exports.handler = async (event, context) => {
    
    const apiURL = process.env.API_ENDPOINT;

    const dbUsername = process.env.DOCUMENT_DB_USERNAME;
    const dbPassword = process.env.DOCUMENT_DB_PASSWORD;
    const dbEndpoint = process.env.DOCUMENT_DB_ENDPOINT;
    const dbName = process.env.DOCUMENT_DB_DB_NAME;
    
    console.log('dir', __dirname) // this print /var/task for nodejs20.x lambda
    
    
    const collectionName = 'products';
    
    // put .pem file at the root directory of the lambda
    // Define MongoDB connection details
    const mongoUri = `mongodb://${dbUsername}:${dbPassword}@${dbEndpoint}:27017/${dbName}?retryWrites=false&tls=true&tlsCAFile=/var/task/ca-test-docdb-imlss.pem`

    // Connect to MongoDB
    const client = new MongoClient(mongoUri);

    try {
        const db = client.db();
        const collection = db.collection(collectionName);
        console.log(collection)

        // Call the API endpoint
        const response = await axios.get(apiURL);
        
        console.log(response.data)

        // Insert the response data into the MongoDB collection
        // await collection.insertMany(response.data.item);

        return {
            statusCode: 200,
            body: JSON.stringify('Data inserted into DocumentDB successfully')
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify(`Error: ${err.message}`)
        };
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
};
