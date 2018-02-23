const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(id);
  User.findById(id).then(user => {
    done(null, user);
  });
});

//new GoogleStrategy - створю новий екземпляр від GooglePassportStrategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          //we already have a record with this profile id
          done(null, existingUser);
        } else {
          new User({
            googleId: profile.id,
            name: profile.displayName
          })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);