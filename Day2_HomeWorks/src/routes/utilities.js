const atob = require("atob");
const UserModel = require("./users/schema");

const basicAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    console.log("Authorization headers missing");
    res.status(400).send("no");
  } else {
    const [username, password] = atob(
      req.headers.authorization.split(" ")[1]
    ).split(":");
    const user = await UserModel.findByUsernameAndPassword(username, password);
    if (!user) {
      res.status(400).send("There is no user!");
    } else {
      req.user = user;

      next();
    }
  }
};

module.exports = {
  basicAuth,
};
