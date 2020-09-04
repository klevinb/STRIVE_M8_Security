const { verifyAccessToken } = require('./tokenGenerator');
const UserModel = require('../routes/users/schema');

const isUser = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (token) {
      const credentials = await verifyAccessToken(token);
      if (!credentials) {
        res.status(401).send('You need to authenticate yourself!');
      }
      const user = await UserModel.findOne({ _id: credentials._id });
      if (!user) res.status(401).send('Username/Password are not correct!');

      req.token = token;
      req.user = user;
      next();
    } else {
      res.status(401).send('Access Token Missing!');
    }
  } catch (error) {
    console.log(error);
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') next();
    else res.status(401).send('You are not admin! Sorry not sorry');
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  isUser,
  isAdmin,
};
