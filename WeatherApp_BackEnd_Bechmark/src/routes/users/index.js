const express = require('express');
const UserModel = require('./schema');
const { generateTokens } = require('../../utilities/tokenGenerator');

const router = express.Router();

/*
    POST /users/register --> creates a new user
    POST /users/login --> logins with username and password and return a valid token
*/

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  const user = await UserModel.findByUsernameAndPassword(username, password);

  const { token, refreshToken } = await generateTokens(user);
  res.cookie('accessToken', token, {
    httpOnly: true,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
  });

  res.send({ token, refreshToken });
});

router.post('/register', async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const done = await newUser.save();

    res.status(201).send(done);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
