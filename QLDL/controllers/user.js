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

module.exports = {
  changePassword,
  logOut,
  getAllUser,
};
