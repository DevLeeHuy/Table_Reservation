const userModel = require("../models/user.model");
const db = require("../utils/db");
module.exports = {
  updateInfo: async function (req, res) {
    const User = {
      userID: req.user.userID,
      userFName: req.body.userFName,
      userPassword: req.body.userPassword,
      userEmail: req.body.userEmail,
      userPhone: req.body.userPhone,
      userPic: req.user.userPic,
      userGender: req.body.userGender,
    };
    if (req.body.userPassword != "") {
      await userModel.update(User, User.userID);
    } else {
      delete User.userPassword;
      await userModel.update(User, User.userID);
    }
    // res.cookie("user_data", User);
    req.user = User;
    console.log("update ");

    // console.log(res.cookies.user_data);
    res.redirect("/profile");
  },
  updateImage: async function (req, res) {
    const User = {
      userID: req.user.userID,
      userPic: req.file.filename,
    };
    console.log(User);
    await userModel.update(User, User.userID);
    req.user.userPic = User.userPic;
    res.redirect("/profile");
  },
  findUser: (userinfo) => {
    return userModel.findUser(userinfo);
  },
  add: (user) => {
    const User = {
      userFName: user._json.name,
      userNameID: user._json.email,
      userPassword: user._json.id || null,
      userEmail: user._json.email,
    };
    return userModel.add(User);
  },
};
