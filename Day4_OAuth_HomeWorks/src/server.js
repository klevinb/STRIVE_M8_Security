const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UserRoutes = require("./routes/users/index");
const cookieParser = require("cookie-parser");

const passport = require("passport");

const authRouter = require("./routes/users/google");

const server = express();
const port = process.env.PORT;

server.use(cookieParser());
server.use(express.json());
server.use(cors());
server.use(passport.initialize());

// Routes

server.use("/users", UserRoutes);

mongoose
  .connect("mongodb://localhost:27017/JWT_Auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log(`Server running on port{${port}}`);
    })
  )
  .catch((err) => console.log(err));
