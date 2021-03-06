const express = require('express');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const path = require('path');
const multer = require('multer');

const upload = new multer({});

const server = express();
server.use(express.json());

const availableServices = path.join(__dirname, 'availableServices.json');

server.post('/startMicroService', async (req, res) => {
  try {
    const service = req.body.url;
    const servicesRunning = await fs.readJSON(availableServices);

    if (!servicesRunning.find((ser) => ser === service)) {
      servicesRunning.push(service);
      const newService = await fs.writeJSON(availableServices, servicesRunning);
      console.log('New service running => ' + service);
    }
    res.status(200).send('OK');
  } catch (error) {
    console.log(error);
  }
});

server.get('/movies', async (req, res) => {
  do {
    const servicesRunning = await fs.readJSON(availableServices);
    if (servicesRunning.length === 0)
      return res.status(500).send('No services running for the moment');

    const randomSelect = Math.floor(Math.random() * servicesRunning.length);
    const service = servicesRunning[randomSelect];
    const url = service + '/netflix/';

    try {
      console.log(url);
      const response = await fetch(url);
      if (response.ok) {
        return res.send(await response.json());
      }
    } catch {
      const removed = servicesRunning.filter((x) => x !== service);
      await fs.writeFile(availableServices, JSON.stringify(removed));
      console.log(`Removing ${service} from the list!`);
    }
  } while (true);
});

server.post('/addMovie', upload.single('file'), async (req, res) => {
  do {
    const servicesRunning = await fs.readJSON(availableServices);
    if (servicesRunning.length === 0)
      return res.status(500).send('No services running for the moment');

    const randomSelect = Math.floor(Math.random() * servicesRunning.length);
    const service = servicesRunning[randomSelect];
    const url = service + '/azure/addMovie';

    try {
      console.log(req.file);
      const data = new FormData();
      data.append('movie', req.file.buffer);

      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data;',
        },
      });
      if (response.ok) {
        return res.send(await response.json());
      }
    } catch {
      const removed = servicesRunning.filter((x) => x !== service);
      await fs.writeFile(availableServices, JSON.stringify(removed));
      console.log(`Removing ${service} from the list!`);
    }
  } while (true);
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on post { ${process.env.PORT} }`);
});
