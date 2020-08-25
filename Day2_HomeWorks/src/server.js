const express = require("express");
const mongoose = require("mongoose");
const UserRoutes = require("./routes/users");
const listEndpoints = require("express-list-endpoints");

const port = process.env.PORT;

const server = express();
server.use(express.json());

server.use("/users", UserRoutes);
console.log(listEndpoints(server));

mongoose
  .connect("mongodb://localhost:27017/Basic_Auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log(`Server runinng on port{${port}}`);
    })
  )
  .catch((err) => console.log(err));
