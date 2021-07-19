const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
// const passportMdw = require('../middleware/passport.mdw');
// const config = require("../config/config.json");

const passport = require("passport");
const FbStrategy = require("passport-facebook").Strategy;
const userController = require("../controllers/user.controller");

const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// router.get("/private", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send("ok");
//     console.log(req.user);
//   }
// });

router.get("/", function (req, res) {
  res.render("vwSignIn&SignUp/signIn", { layout: false });
});

//local login

// router.post("/", async function (req, res) {
//     const result = await userModel.login(req.body);
//     if (Object.values(result) != 0) {
//         // res.cookie("user_data", result[0]);
//         // req.session.user=result[0];
//         req.user=result[0];
//         console.log(req.user);
//         res.redirect("/");
//     } else {
//         res.send("fail");
//     }
// });

router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect('/');
  }
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const User = await userController.findUser(username);
    if (User && User.userPassword == password) {
      return done(null, User.userNameID);
    } else {
      return done(null, false);
    }
  })
);
//google login

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "276022586484-2s9ui1rmhqvc8a6csc05nn2vcnva453d.apps.googleusercontent.com",
      clientSecret: "VoKthWq43LJJ6mSd4jTU8pzO",
      // callbackURL: "http://localhost:3000/login/google/cb",
      callbackURL: "https://se-reservation.herokuapp.com/login/google/cb"
    },

    async (accessToken, refreshToken, profile, done) => {
      const User = await userController.findUser(profile._json.email);
      if (User) {
        // console.log("exist");
        return done(null, profile._json.email);
      } else {
        // console.log("non-exist");
        await userController.add(profile);
        return done(null, profile._json.email);
      }
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/cb",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

//facebook login

router.get(
  "/fb",
  passport.authenticate("facebook", { scope: ["email"] }),
  () => {}
);

router.get(
  "/fb/cb",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

passport.use(
  new FbStrategy(
    {
      clientID: "1061366784392713",
      clientSecret: "1518fc9d11dd2986c0d9d35febed8164",
	   callbackURL: "https://se-reservation.herokuapp.com/login/fb/cb",
      // callbackURL: "http://localhost:3000/login/fb/cb",
      profileFields: ["email", "displayName"],
    },
    async function (accessToken, refreshToken, profile, done) {
      const User = await userController.findUser(profile._json.email);
      if (User) {
        // console.log("exist");
        return done(null, profile._json.email);
      } else {
        // console.log("non-exist");
        await userController.add(profile);
        return done(null, profile._json.email);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  console.log("serial " + user);

  done(null, user);
});

passport.deserializeUser(async (userinfo, done) => {
  const User = await userController.findUser(userinfo);
  console.log("deserializeUser");
  if (User) {
    delete User.userPassword;
    return done(null, User);
  } else {
    return done(null, false);
  }
});

module.exports = router;
