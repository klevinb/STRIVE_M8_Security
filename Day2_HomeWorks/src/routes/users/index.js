const express = require("express");
const UserModel = require("./schema");
const { bacisAuth } = require("../utilities");

const router = express.Router();

router.get("/", bacisAuth, async (req, res, next) => {
  try {
    console.log("HERE");
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newStudent = new UserModel(req.body);
    const response = await newStudent.save();
    res.status(201).send(newStudent);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
