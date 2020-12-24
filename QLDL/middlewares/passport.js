var passport = require("passport");
var User = require("../model/user");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");

passport.serializeUser((user, done) => {
  try {
    done(null, user.iduser);
  } catch (error) {
    done(error, false);
  }
});

passport.deserializeUser(function (iduser, done) {
  User.findOne({ iduser: iduser })
    .then(function (user) {
      done(null, user);
    })
    .catch(function (err) {
      done(err, false);
    });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        if (!user) return done(error, false);

        const isCorrectPassword = await bcrypt.compareSync(
          password,
          user.password
        );

        if (!isCorrectPassword) return done(error, false);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
