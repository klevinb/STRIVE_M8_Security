// 1) this will be the single touch point from the external world to the microservices
// 2) our microservices should register to this method when they go live CHECK!
// 3) the microservices should be "deleted" when something goes wrong

const express = require("express")
const fs = require("fs-extra")
const fn = "microservices.json"
const cors = require("cors")
const fetch = require("node-fetch")

const server = express()

server.use(cors())
server.use(express.json())

server.post("/addmicroservice", async (req, res)=> {
    // append the current server to my list of registed servers
    // read the current list of microservices
    const nodes = JSON.parse(await fs.readFile(fn))
    // add the req.body.url if the microservice is not there yet
    if (!nodes.find(x => x === req.body.url)){
        nodes.push(req.body.url)
        console.log("MICROSERVICE ADDED => " + req.body.url)
        await fs.writeFile(fn, JSON.stringify(nodes))
    }
    res.send("OK")
} )

server.get("/:containerName", async (req, res) => {
   
    let result = 10
    do {
        //read the list
        const nodes = JSON.parse(await fs.readFile(fn))
        if(nodes.length === 0) //if no nodes available => error
            return res.status(500).send("No available workers")
        
        //take a random node from the list
        const randomService = Math.floor(Math.random() * nodes.length)
        const node = nodes[randomService]
        console.log("Contacting node " + node)
        const url = node + "/files/" + req.params.containerName
        try{
            const response = await fetch(url) // sending the request to the microservice
            if (response.ok){
                const files = await response.json();
                return res.send(files)
            }
            else {
                const removed = nodes.filter(x => x !== node) //removing current node from nodelist
                await fs.writeFile(fn, JSON.stringify(removed))
                console.log(`Removing ${node} from the list!`)
            }
        }
        catch {
            // if the microservice is dead, remove it from the list
            const removed = nodes.filter(x => x !== node) //removing current node from nodelist
            await fs.writeFile(fn, JSON.stringify(removed))
            console.log(`Removing ${node} from the list!`)
            result --
        }
        
    } while (result > 0)
})

server.listen(4500, () => console.log("Server listening on 4500"))