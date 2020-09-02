const express = require('express');
require('dotenv').config();
const multer = require('multer');
var MulterAzureStorage = require('multer-azure-storage');

const multerOptions = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString: process.env.STORAGE_CS,
    containerName: 'movies',
    containerSecurity: 'container',
  }),
});

const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require('@azure/storage-blob');

const credentials = new StorageSharedKeyCredential(
  process.env.BLOB_NAME,
  process.env.STORAGE_KEY
);

const blobClient = new BlobServiceClient(
  `https://${process.env.BLOB_NAME}.blob.core.windows.net/`,
  credentials
);

const router = express.Router();

router.post('/addMovie', multerOptions.single('movie'), async (req, res) => {
  res.send(req.file.url);
});

module.exports = router;
