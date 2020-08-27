const jwt = require("jsonwebtoken");
const UserModel = require("../users/schema");
const { verifyJWT } = require("./utilities");

const authorize = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      res.status(400).send("Authorization headers missing!");
    else {
      const token = req.headers.authorization.split(" ")[1];
      const decode = await verifyJWT(token);

      const user = await UserModel.findOne({ _id: decode._id });
      if (user) {
        req.token = token;
        req.user = user;
        next();
      } else res.status(401).send("Username/Password is not vaild");
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") next();
    else res.status(403).send("Unauthorized");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  authorize,
  isAdmin,
};
