const bcrypt = require("bcrypt");
const atob = require("atob");
const UserModel = require("./users/schema");

const hashPass = async (pw) => {
  return await bcrypt.hash(pw, 8);
};

const hashCompare = async (pw) => {
  return await bcrypt.compare(pw);
};

const bacisAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    console.log("Authorization missing on headers");
  } else {
    const credentials = req.headers.authorization.split(" ")[1];
    const [email, password] = atob(credentials).split(":");

    const user = await UserModel.findByEmailAndPass(email, password);
    if (!user) {
      console.log("You cant log in");
    } else {
      req.user = user;
      next();
    }
  }
};

module.exports = {
  hashPass,
  hashCompare,
  bacisAuth,
};
