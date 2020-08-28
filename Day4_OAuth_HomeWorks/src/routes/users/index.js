const express = require("express");
const UserModel = require("./schema");
const { generateTokens, refreshTokens } = require("../helpers/utilities");
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

router.put("/me", authorize, async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.status(200).send(req.user);
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

router.post("/refreshTokens", async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) {
      res.status(404).send("Refresh token missing!");
    } else {
      const tokens = await refreshTokens(refreshToken);
      res.cookie("accessToken", tokens.token, {
        httpOnly: true,
      });
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        path: "/users/refreshTokens",
      });

      res.send();
    }
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
      const { token, refreshToken } = req.user.tokens;
      res.cookie("accessToken", token, {
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/users/refreshToken",
      });
      res.status(200).redirect("http://localhost:3000/");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = router;
