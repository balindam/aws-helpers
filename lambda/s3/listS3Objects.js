const AWS = require('aws-sdk');

// Configure AWS SDK with environment variables
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

// Create an S3 instance
const s3 = new AWS.S3();

// Function to list objects with a given prefix in an S3 bucket
async function listObjects(bucket, prefix) {
  try {
    const params = {
      Bucket: bucket,
      Prefix: prefix,
    };

    // Use the listObjectsV2 method to get the objects with the specified prefix
    const data = await s3.listObjectsV2(params).promise();

    // Extract the list of object keys
    const objectKeys = data.Contents.map((obj) => obj.Key);

    return objectKeys;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

// Lambda handler
exports.handler = async (event) => {
  try {
    // Extract the prefix from the query string in the event
    const prefix = event.queryStringParameters && event.queryStringParameters.prefix;

    // Specify your bucket name
    const bucketName = 'upwork-balindam-doug';

    // Call the function to list objects with the specified bucket and prefix
    const objectKeys = await listObjects(bucketName, prefix);

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'List of objects with the specified prefix:',
        objectKeys,
      }),
    };

    return response;
  } catch (error) {
    console.error('Lambda execution error:', error);
    throw error; // Rethrow the error to log and potentially handle it at a higher level
  }
};
