const atob = require("atob");
const UserModel = require("./users/schema");

const basicAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    console.log("Authorization headers missing");
    res.status(400).send("no");
  } else {
    const credentials = req.headers.authorization.split(" ")[1];
    const [username, password] = atob(credentials).split(":");
    const user = await UserModel.findByUsernameAndPassword(username, password);
    if (!user) {
      res.status(400).send("There is no user!");
    } else {
      req.user = user;

      next();
    }
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).send("Forbiden");
};

module.exports = {
  basicAuth,
  isAdmin,
};
