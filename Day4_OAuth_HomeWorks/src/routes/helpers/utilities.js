const jwt = require("jsonwebtoken");
const UserModel = require("../users/schema");

const refreshTokens = async (oldRefreshToken) => {
  try {
    const decode = await verifyRefreshToken(oldRefreshToken);

    if (decode) {
      const user = await UserModel.findOne({ _id: decode._id });
      if (!user) {
        throw new Error(`Access is forbidden`);
      }

      const newAccessToken = await generateJWT({ _id: user._id });

      return { token: newAccessToken, refreshToken: oldRefreshToken };
    } else {
      const user = await UserModel.findOne({
        "refreshTokens.token": oldRefreshToken,
      });

      const newAccessToken = await generateJWT({ _id: user._id });
      const newRefreshToken = await generateRefreshToken({ _id: user._id });

      const newRefreshTokens = user.refreshTokens
        .filter((t) => t.token !== oldRefreshToken)
        .concat({ token: newRefreshToken });

      user.refreshTokens = [...newRefreshTokens];

      await user.save();
      return { token: newAccessToken, refreshToken: newRefreshToken };
    }
  } catch (error) {
    console.log(error);
  }
};

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
      { expiresIn: 90 },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    )
  );

const verifyJWT = (payload) =>
  new Promise((resolve, reject) => {
    jwt.verify(payload, process.env.SECRET_KEY, (error, credentials) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          resolve();
        } else {
          reject(error);
        }
      } else resolve(credentials);
    });
  });

const generateRefreshToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.SECOND_SECRET_KEY,
      { expiresIn: 180 },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    )
  );

const verifyRefreshToken = (payload) =>
  new Promise((resolve, reject) => {
    jwt.verify(payload, process.env.SECOND_SECRET_KEY, (error, credentials) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          resolve();
        } else {
          reject(error);
        }
      } else resolve(credentials);
    });
  });

module.exports = {
  generateTokens,
  verifyJWT,
  refreshTokens,
};
