const AWS = require('aws-sdk');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });


const s3 = new AWS.S3({
  endpoint: process.env.ENDPOINT, 
  accessKeyId: process.env.ACCESS_KEY,         
  secretAccessKey: process.env.SECRET_KEY,  
  s3ForcePathStyle: true,                   
  signatureVersion: 'v4',
});

exports.uploadFileToStorj = async (fileBuffer, bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key, // The name of the file to be saved in Storj
    Body: fileBuffer,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // Returns the file URL on Storj
  } catch (error) {
    console.error('Error uploading file to Storj:', error);
    throw new Error('File upload failed');
  }
};

// Function to retrieve file from Storj
exports.getFileFromStorj = async (bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key, // The name of the file to retrieve
  };

  try {
    const data = await s3.getObject(params).promise();
    return data.Body; // Returns the file content as a buffer
  } catch (error) {
    console.error('Error retrieving file from Storj:', error);
    throw new Error('File retrieval failed');
  }
};
