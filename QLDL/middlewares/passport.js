var passport = require("passport");
var User = require("../model/user");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");

passport.serializeUser((user, done) => {
  try {
    done(null, user.email);
  } catch (error) {
    done(error, false);
  }
});

passport.deserializeUser(function (email, done) {
  User.findOne({ email: email })
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
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

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

/*passport.use(
  new LocalStrategy({
    usernameField: "email"},
    async(req, email, done) => {
      try {
        const user = await User.findOne({ email: email });
        console.log(user);
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
    },
  })
);*/
