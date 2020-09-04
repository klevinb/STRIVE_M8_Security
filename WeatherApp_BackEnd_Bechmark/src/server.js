const express = require('express');
const listEndpoints = require('express-list-endpoints');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRoutes = require('./routes/users');
const citiesRoutes = require('./routes/cities');
const cookieParser = require('cookie-parser');

const server = express();
server.use(cookieParser());
server.use(express.json());
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

server.use(cors(corsOptions));

server.use('/users', usersRoutes);
server.use('/list', citiesRoutes);

console.log(listEndpoints(server));

const port = process.env.PORT;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dn7fa.mongodb.net/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    server.listen(port, () => {
      console.log(`Server running on port [ ${port} ]`);
    })
  )
  .catch((error) => console.log(error));
