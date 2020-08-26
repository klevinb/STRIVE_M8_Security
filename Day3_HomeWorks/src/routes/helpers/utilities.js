const jwt = require("jsonwebtoken");

const generateTokens = async (user) => {
  try {
    const newAccessToken = await generateJWT({ _id: user._id });
    const newRefreshToken = await generateRefreshToken({ _id: user._id });

    user.refreshTokens = [...user.refreshTokens, { token: newRefreshToken }];
    await user.save();
    return { token: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.log(error);
  }
};

const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: 900 },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    )
  );

const generateRefreshToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.SECOND_SECRET_KEY,
      { expiresIn: "1h" },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    )
  );

const verifyJWT = (payload) =>
  new Promise((resolve, reject) => {
    jwt.verify(payload, process.env.SECRET_KEY, (error, credentials) => {
      if (error) reject(error);
      else resolve(credentials);
    });
  });

module.exports = {
  generateTokens,
  verifyJWT,
};
