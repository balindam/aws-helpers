const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const { bucket, key } = event.queryStringParameters;

    if (!bucket || !key) {
      throw new Error('Both "bucket" and "key" query parameters are required.');
    }

    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 60, // The URL will expire in 60 seconds (adjust as needed)
    };

    const presignedUrl = await s3.getSignedUrlPromise('getObject', params);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ presignedUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
