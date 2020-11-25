const { Strategy } = require("passport");
var passport = require("passport");
var User = require("../model/user");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      process.nextTick(function () {
        User.findOne({ email: email }, function (err, user) {
          if (err) return done(err);
          if (user) {
            return done(
              null,
              false,
              req.flash("signupMessage", "That email is already taken.")
            );
          } else {
            var newUser = new User();
            newUser.email = email;
            newUser.password = bcrypt.hashSync(
              password,
              bcrypt.genSaltSync(10),
              null
            );
            newUser.role = req.body.role;
            newUser.save(function (err) {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      loginAttempt();

      async function loginAttempt() {
        try {
          const user = await User.findOne({ email: req.body.email });

          if (!user) {
            return done(null, false);
          } else {
            const checkPassword = bcrypt.compareSync(
              req.body.password,
              user.password
            );
            if (!checkPassword) {
              return done(null, false);
            } else {
              const hashPassword = bcrypt.hashSync(
                req.body.password,
                bcrypt.genSaltSync(10),
                null
              );

              req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
              const findUser = await User.findOne({
                email: req.body.email,
              });
              return done(null, findUser);
            }
          }
        } catch (e) {
          throw e;
        }
      }
    }
  )
);
