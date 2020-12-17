var passport = require("passport");
var User = require("../model/user");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(function (email, done) {
  User.findOne({ email: email })
    .then(function (user) {
      done(null, user);
    })
    .catch(function (err) {
      console.log(err);
    });
});

// passport.use(
//   "local-register",
//   new LocalStrategy(
//     {
//       usernameField: "email",
//     },
//     async (email, password, done) => {
//       const user = User.findOne({ email: email });
//       if (user) {
//         res.send({ message: "Email already exists!" });
//       }

//       var newUser = new User();
//       newUser.email = req.body.email;
//       newUser.password = bcrypt.hashSync(
//         password,
//         bcrypt.genSaltSync(10),
//         null
//       );
//       newUser.role = req.body.role;
//       newUser.save(function (err) {
//         if (err) throw err;
//         console.log("Successful");
//         return done(null, newUser);
//       });
//     }
//   )
// );

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (req, email, password, done) {
      loginAttempt();
      async function loginAttempt() {
        try {
          var email = req.body.email;
          const user = await User.findOne({ email: email });

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

              req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
              res.send(user);
              return done(null, user);
            }
          }
        } catch (error) {
          done(error, false);
        }
      }
    }
  )
);
