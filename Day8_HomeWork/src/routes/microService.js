const express = require('express');
require('dotenv').config();
const listEndpoints = require('express-list-endpoints');
const fetch = require('node-fetch');
const netflixRoutes = require('./netflix');
const azureBlob = require('./azure');

const server = express();

server.use('/netflix', netflixRoutes);
server.use('/azure', azureBlob);

console.log(listEndpoints(server));

server.listen(process.argv[2], async () => {
  console.log('Running on port' + process.argv[2]);
  const resp = await fetch(process.env.SERVER_URL + '/startMicroService', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: 'http://localhost:' + process.argv[2],
    }),
  });

  if (resp.ok) {
    console.log('Its online!');
  } else {
    console.log('Something wrong happend!');
  }
});
