const express = require('express');
require('dotenv').config();
const multer = require('multer');
var MulterAzureStorage = require('multer-azure-storage');

const options = multer({});

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

router.get('/', async (req, res) => {
  let containers = blobClient.listContainers();
  let data = [];
  for await (const container of containers) {
    data.push(container.name);
  }
  res.send(data);
});

router.get('/:containerName', async (req, res) => {
  const container = await blobClient.getContainerClient(
    req.params.containerName
  );
  const files = await container.listBlobsFlat();
  const toReturn = [];
  for await (const file of files) toReturn.push(file.name);

  res.send(toReturn);
});

router.post(
  '/:containerName/upload',
  options.single('file'),
  async (req, res) => {
    try {
      const container = await blobClient.getContainerClient(
        req.params.containerName
      );

      const file = await container.uploadBlockBlob(
        req.file.originalname,
        req.file.buffer,
        req.file.size
      );

      res.send(file.blockBlobClient.url);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
);

router.post('/addMovie', multerOptions.single('movie'), async (req, res) => {
  res.send(req.file.url);
});

router.post('/createContainer/:name', async (req, res) => {
  const containerName = req.params.name;
  const containerClient = blobClient.getContainerClient(containerName);
  const createContainerResponse = await containerClient.create();
  res.status(201).send(`${containerName} container was created!`);
});

router.delete('/:containerName', async (req, res) => {
  const container = await blobClient.getContainerClient(
    req.params.containerName
  );

  await container.deleteBlob();
  res.send('Done');
});

module.exports = router;
