const express = require('express');
const { isUser } = require('../../utilities/middleware');
const axios = require('axios');

const router = express.Router();

/*
    GET /weather/:city --> get weather info for the given :city
    POST /list --> add a city to the user's list
    DELETE /list/:id --> removes the city from the list
    GET /list --> returns the user's list
*/
router.get('/weather/:city', async (req, res) => {
  const resp = await axios(process.env.WEATHER_API + req.params.city, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': process.env.WEATHER_HOST,
      'x-rapidapi-key': process.env.WEATHER_KEY,
      'useQueryString': true,
    },
  });

  res.send(resp.data);
});

router.get('/', isUser, async (req, res) => {
  res.send(req.user.cities);
});

router.post('/', isUser, async (req, res) => {
  const { city } = req.body;
  const cities = req.user.cities;
  const exists = cities.find((ct) => ct.city === city);

  if (exists) {
    res.status(200).send(req.user.cities);
  } else {
    req.user.cities.push({ city });
    await req.user.save();
    res.status(201).send(req.user.cities);
  }
});

router.delete('/:id', isUser, async (req, res) => {
  const cities = req.user.cities;
  const exists = cities.find((ct) => ct._id.toString() === req.params.id);

  if (exists) {
    const deletedCity = req.user.cities.filter(
      (ct) => ct._id.toString() !== req.params.id
    );

    req.user.cities = [...deletedCity];
    await req.user.save();
    res.send('Deleted');
  } else {
    res.status(404).send('You dont have a city with that name');
  }
});

module.exports = router;
