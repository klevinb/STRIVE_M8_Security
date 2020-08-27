const express = require("express");
const UserModel = require("./schema");
const { generateTokens } = require("../helpers/utilities");
const { authorize, isAdmin } = require("../helpers/middlewares");
const passport = require("passport");

const router = express.Router();

router.get("/me", authorize, async (req, res, next) => {
  try {
    if (req.user) res.send(req.user);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/me", authorize, async (req, res, next) => {
  try {
    if (req.user) {
      req.user.remove();
      res.send("Deleted");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findByUsernameAndPassword(username, password);
    if (user) {
      const tokens = await generateTokens(user);
      res.status(200).send(tokens);
    } else {
      res.status(401).send("Username/Password is not vaild");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const done = await newUser.save();

    res.status(201).send(done);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", authorize, isAdmin, async (req, res, next) => {
  try {
    const deleteUser = await UserModel.findOneAndDelete({ _id: req.params.id });
    if (deleteUser) res.status(200).send("Deleted");
    else console.log("User does not exist!");
  } catch (error) {
    console.log(error);
  }
});

router.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/redirectGoogle",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      console.log(req.user);
      // const { token, refreshToken } = req.user.tokens;
      // res.cookie("accessToken", token, {
      //   httpOnly: true,
      // });
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   path: "/users/refreshToken",
      // });
      // res.status(200).redirect("http://localhost:3000/");
      res.status(200).send("OK");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = router;
