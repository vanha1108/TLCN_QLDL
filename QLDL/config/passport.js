const { Strategy } = require("passport");
var passport = require("passport");
var User = require("../model/user");
var LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      // mặc định local strategy sử dụng username và password,
      // chúng ta cần cấu hình lại
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // cho phép chúng ta gửi reqest lại hàm callback
    },
    function (req, email, password, done) {
      // asynchronous
      // Hàm callback của nextTick chỉ được thực hiện khi hàm trên nó trong stack (LIFO) được thực hiện
      // User.findOne sẽ không được gọi cho tới khi dữ liệu được gửi lại

      process.nextTick(function () {
        // Tìm một user theo email
        // chúng ta kiểm tra xem user đã tồn tại hay không
        User.findOne({ email: email }, function (err, user) {
          if (err) return done(err);
          if (user) {
            return done(
              null,
              false,
              req.flash("signupMessage", "That email is already taken.")
            );
          } else {
            // Nếu chưa user nào sử dụng email này
            // tạo mới user
            var newUser = new User();
            // lưu thông tin cho tài khoản local
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.role = req.body.role;
            // lưu user
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
      User.findOne({ email: email }, function (err, user) {
        if (err) return done(err);
        if (!user)
          return done(null, false, req.flash("loginMessage", "No user found!"));
        if (!user.validPassword(password))
          return done(
            (null, false, req.flash("loginMessage", "Password incorrect!"))
          );

        return done(null, user);
      });
    }
  )
);
