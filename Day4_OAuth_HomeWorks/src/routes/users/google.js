const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("./schema");

const { generateTokens } = require("../helpers/utilities");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3222/users/redirectGoogle",
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        name: profile.name.givenName,
        lastname: profile.name.familyName,
        username:
          profile.name.givenName.slice(0, 1).toLocaleLowerCase() +
          profile.name.familyName.toLocaleLowerCase(),
        projects: [{}],
        role: "user",
        refreshTokens: [],
      };

      try {
        const user = await UserModel.findOne({ googleId: profile.id });

        if (user) {
          const tokens = await generateTokens(user);
          done(null, { user, tokens });
        } else {
          createdUser = await UserModel.create(newUser);
          const tokens = await generateTokens(createdUser);
          done(null, { createdUser, tokens });
        }
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
