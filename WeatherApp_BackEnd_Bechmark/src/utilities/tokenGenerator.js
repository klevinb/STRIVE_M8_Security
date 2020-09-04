const jwt = require('jsonwebtoken');
const UserModel = require('../routes/users/schema');

const refreshToken = async (oldRefreshToken) => {
  const decoded = await verifyRefreshToken(oldRefreshToken);

  const user = await User.findOne({ _id: decoded._id });

  if (!user) {
    throw new Error(`Access is forbidden`);
  }

  const currentRefreshToken = user.refreshTokens.find(
    (t) => t.token === oldRefreshToken
  );

  if (!currentRefreshToken) {
    throw new Error(`Refresh token is wrong`);
  }

  // generate tokens
  const newAccessToken = await generateJWT({ _id: user._id });
  const newRefreshToken = await generateRefreshJWT({ _id: user._id });

  // save in db
  const newRefreshTokens = user.refreshTokens
    .filter((t) => t.token !== oldRefreshToken)
    .concat({ token: newRefreshToken });

  user.refreshTokens = [...newRefreshTokens];

  await user.save();

  return { token: newAccessToken, refreshToken: newRefreshToken };
};

const generateTokens = async (user) => {
  try {
    const newAccessToken = await generateAccessToken({ _id: user._id });
    const newRefreshToken = await generateRefreshToken({ _id: user._id });

    const newUser = await UserModel.findOne({ _id: user._id });

    newUser.refreshTokens.push({ token: newRefreshToken });
    await newUser.save();

    return { token: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.log(error);
  }
};

const generateAccessToken = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: 900 },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });

const verifyAccessToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, credentials) => {
      if (err) {
        if (err.name == 'TokenExpiredError') {
          resolve();
        } else {
          reject(err);
        }
      } else {
        resolve(credentials);
      }
    });
  });

const generateRefreshToken = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECOND_SECRET_KEY,

      { expiresIn: 9000 },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });

const verifyRefreshToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECOND_SECRET_KEY, (err, credentials) => {
      if (err) reject(err);
      else resolve(credentials);
    });
  });

module.exports = {
  generateTokens,
  verifyAccessToken,
  refreshToken,
};
