var bcrypt = require("bcrypt-nodejs");
const hashPassword = async (text) => {
  const salt = await bcrypts.genSalt(15);
  return await bcrypt.hash(textString, salt);
};

const changePassword = async (req, res, next) => {
  await User.findOne({ email: req.body.current }, async function (err, user) {
    if (err) res.send({ message: err });
    if (user) {
      var checkPass = await bcrypt.compareSync(
        req.body.currentPassword,
        user.password
      );
      if (!checkPass) res.send({ message: "Password incorrect!" });
      else {
        var passwordHash = bcrypt.hashSync(
          req.body.newPassword,
          bcrypt.genSaltSync(10),
          null
        );
        user.password = passwordHash;
        user.save();
        res.send({ message: "Changed success!" });
      }
    }
  });
};

const logOut = async (req, res, next) => {
  req.logOut();
  req.session.destroy();
};

const getAllUser = async (req, res, next) => {
  if (req.isAuthenticated() && "1" == req.session.passport.user.role) {
    await User.find({}).exec(function (err, users) {
      if (err) res.send({ message: err });
      res.send(users);
    });
  }
};

const signUp = async (req, res, next) => {
  try {
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
    const user = User.findOne({ email: email });
    if (user) {
      res.send({ message: "Email already exists!" });
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = await hashPassword(password);
    newUser.role = role;
    await newUser.save();
    res.send({ message: "Sign up success!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  changePassword,
  logOut,
  getAllUser,
  signUp,
};
