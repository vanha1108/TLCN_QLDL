const User = require("./../model/user");
const JWT = require("jsonwebtoken");
var bcrypt = require("bcrypt-nodejs");

const hashPassword = async (text) => {
  const salt = await bcrypt.genSaltSync(15);
  return bcrypt.hashSync(text, salt, null);
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
  const headers = req.headers;
  console.log(headers.authorization)
  if (!headers.authorization)  {
    console.log("alo")
    return res.status(200).json({
      code: 400,
      message: "Token khong hop le hoac khong co",
      success: false,
    });
  }
    
  await JWT.verify(
    headers.authorization,
    process.env.SECRETTOKEN,
    async (err, decodeToken) => {
      const user = await User.findById(decodeToken.sub);
      if (user.role != 1)
        return res
          .status(200)
          .json({ success: false, code: 403, message: "denied" });
      const users = await User.find();
      console.log(users);
      return res
        .status(200)
        .json({ success: true, code: 200, message: "", users });
    }
  );
};

const signUp = async (req, res, next) => {
  try {
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.send({ message: "Email already exists!" });
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = await hashPassword(password);
    newUser.role = parseInt(role);
    await newUser.save();
    return res.status(200).json({
      success: true,
      code: 201,
      message: "SignUp successfull",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};
const encodedToken = async (userID, times) => {
  return JWT.sign(
    {
      iss: "Van Ha",
      sub: userID,
    },
    process.env.SECRETTOKEN,
    { expiresIn: times }
  );
};
const signIn = async (req, res, next) => {
  const token = await encodedToken(req.user._id, "1h");

  res.setHeader("authorization", token);
  return res.status(200).json({ success: true, code: 200, message: "" });
};

module.exports = {
  changePassword,
  logOut,
  getAllUser,
  signUp,
  signIn,
};
