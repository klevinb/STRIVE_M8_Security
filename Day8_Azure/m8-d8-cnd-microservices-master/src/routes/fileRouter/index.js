const express = require("express")
const multer = require("multer")
require("dotenv").config()
const { BlobServiceClient, StorageSharedKeyCredential, BlobLeaseClient} = require("@azure/storage-blob")
var MulterAzureStorage = require('multer-azure-storage')


console.log(process.env.STORAGE_KEY)
const credentials = new StorageSharedKeyCredential("m8d8apr20", process.env.STORAGE_KEY)
const blobClient = new BlobServiceClient("https://m8d8apr20.blob.core.windows.net/", credentials)

const router = express.Router()

// 0) List Containers

router.get("/", async(req,res)=> {
    const containers = await blobClient.listContainers()
    const toReturn = []
    for await (const container of containers)
        toReturn.push(container.name)

    res.send(toReturn)
})

// EXTRA) Using multer middleware
const multerOptions = multer({
    storage: new MulterAzureStorage({
      azureStorageConnectionString: process.env.STORAGE_CS,
      containerName: 'images',
      containerSecurity: 'container'
    })
  })

router.post("/uploadWithMulter", multerOptions.single("file"),   async (req, res)=>{
    //update my database with the URL
    res.send(req.file.url)
})


// 1) Create Containers 

router.post("/:containerName", async(req, res)=>{
    const container = await blobClient.createContainer(req.params.containerName, {
        access: "container"
    })

    res.send(container)
})

// 2) Upload File
const options = new multer({})
router.post("/:containerName/upload", options.single("file"), async (req, res)=>{
    try{
        //get the container refence
        const container = await blobClient.getContainerClient(req.params.containerName)
        //upload
        const file = await container.uploadBlockBlob(req.file.originalname, req.file.buffer, req.file.size)

        res.send(file)
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
} )


// 3) List files in a container
router.get("/:containerName", async(req,res)=> {
    const container = await blobClient.getContainerClient(req.params.containerName)
    const files = await container.listBlobsFlat()
    const toReturn = []
    for await (const file of files)
        toReturn.push(file.name)

    res.send(toReturn)
})
// 4) Delete a specified File

router.delete("/:containerName/:fileName", async (req, res)=>{
    const container = await blobClient.getContainerClient(req.params.containerName)
    await container.deleteBlob(req.params.fileName)

    res.send("DELETED")
})



module.exports = router