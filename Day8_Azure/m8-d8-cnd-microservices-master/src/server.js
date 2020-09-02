const express = require("express")
const fetch = require("node-fetch")
require("dotenv").config()
const fileRouter = require("./routes/fileRouter")

const app = express()

app.use("/files", fileRouter)

app.listen(process.argv[2], async () => {
    console.log(`Running on port ${process.argv[2]}` )
    // I need to tell my Boss that I'm up for working!
    const registration = await fetch("http://localhost:4500/addmicroservice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: "http://localhost:" + process.argv[2]
        })
    })

    if (registration.ok){
        console.log("OK! I'm in")
    }
    else{
        console.log("SOMETHING WENT WRONG!")
    }
})