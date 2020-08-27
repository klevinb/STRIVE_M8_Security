const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")
const passport = require("passport")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const authRouter = require("./services/users/oauth")

const booksRouter = require("./services/books")
const usersRouter = require("./services/users")

const {
  notFoundHandler,
  forbiddenHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers")

const server = express()

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

server.use(cookieParser())
server.use(cors(corsOptions))
const port = process.env.PORT

const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))
server.use(express.json())
server.use(morgan())

server.use(passport.initialize())

server.use("/books", booksRouter)
server.use("/users", usersRouter)

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))
