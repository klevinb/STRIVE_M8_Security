const express = require("express");
const UserModel = require("./schema");

const { basicAuth, isAdmin } = require("../utilities");

const router = express.Router();

router.get("/me", basicAuth, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

router.delete("/me", basicAuth, async (req, res, next) => {
  try {
    req.user.remove();
    res.send("Deleted");
  } catch (error) {
    next(error);
  }
});

router.get("/", basicAuth, isAdmin, async (req, res, next) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", basicAuth, isAdmin, async (req, res, next) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.send("Deleted");
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
