const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const movies = {
      name: 'THIS',
    };
    res.send(movies);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
