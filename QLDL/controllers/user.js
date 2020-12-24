const User = require("./../model/user");
const JWT = require("jsonwebtoken");
var bcrypt = require("bcrypt-nodejs");

const hashPassword = async (text) => {
  const salt = await bcrypt.genSaltSync(15);
  return bcrypt.hashSync(text, salt, null);
};

const changePassword = async (req, res, next) => {
  await User.findOne({ iduser: req.body.iduser }, async function (err, user) {
    if (err) res.send({ message: err });
    if (user) {
      var checkPass = await bcrypt.compareSync(
        req.body.currentPassword,
        user.password
      );
      if (!checkPass)
        res
          .status(200)
          .json({ success: false, code: 500, message: "Password incorrect!" });
      else {
        var passwordHash = bcrypt.hashSync(
          req.body.newPassword,
          bcrypt.genSaltSync(10),
          null
        );
        user.password = passwordHash;
        user.save();
        res
          .status(200)
          .json({ success: true, code: 200, message: "Change success!" });
      }
    }
  });
};

const getAllUser = async (req, res, next) => {
  const headers = req.headers;
  console.log("TOKEN: " + headers.authorization);
  if (!headers.authorization) {
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
      return res
        .status(200)
        .json({ success: true, code: 200, message: "", users });
    }
  );
};

const signUp = async (req, res, next) => {
  try {
    var iduser = Int.parseInt(req.body.iduser);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var sex = req.body.sex;
    if (sex == "Female") {
      sex = false;
    } else {
      sex = true;
    }
    var parts = req.body.dob.split("-");
    var dob = new Date(parts[0], parts[1] - 1, parts[2]);
    var phonenumber = req.body.phonenumber;
    var address = req.body.address;
    var username = req.body.username;
    var password = req.body.password;
    var role = Int.parseInt(req.body.role);
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status.json({
        success: false,
        code: 500,
        message: "Email already exists!",
      });
    }
    var newUser = new User();
    // Kiểm tra iduser đã có chưa --> nếu có thì +1
    const users = User.find();
    const arrIDuser = [];
    for (let u in users) {
      arrIDuser.push(users[u].iduser);
    }
    while (arrID.indexOf(iduser) != -1) {
      iduser += 1;
    }
    //
    newUser.iduser = iduser;
    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.sex = sex;
    newUser.dob = dob;
    newUser.address = address;
    newUser.username = username;
    newUser.password = await hashPassword(password);
    newUser.role = role;
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

  const user = await User.findById(req.user._id);

  res.setHeader("authorization", token);
  return res.status(200).json({ success: true, code: 200, message: "", user });
};

const logOut = async (req, res, next) => {
  headers = req.headers;
  return res
    .status(200)
    .json({ success: true, message: "logout success", code: 200 });
};

module.exports = {
  changePassword,
  logOut,
  getAllUser,
  signUp,
  signIn,
  logOut,
};
