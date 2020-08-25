const express = require("express");
const UserModel = require("./schema");

const { basicAuth } = require("../utilities");

const router = express.Router();

router.get("/", basicAuth, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const response = await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
