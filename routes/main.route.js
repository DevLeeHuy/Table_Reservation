const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
const restaurantModel = require("../models/restaurant.model");
const resImageModel = require("../models/resImage.model");
const feedbackModel = require("../models/feedback.model");
const replyFBModel = require("../models/replyFB.model");
const { upload } = require("../controllers/upload.controller");
const favoriteModel = require("../models/favoriteList.model");
const authenticalMDW = require("../middleware/authenticate.mdw");
const reservationModel = require("../models/reservation.model");
const voucherModel = require("../models/voucher.model");

router.get("/", async function (req, res) {
  const listRestaunrant = await restaurantModel.getAll();
  const listResHaveVoucher = await voucherModel.getListResHaveVoucher();
  console.log(listResHaveVoucher);
  req.session.listRes = listRestaunrant;
  if (req.user) {
    const user = req.user;
    var favoriteList = await favoriteModel.getList(user.userID);
    favoriteList = favoriteList.map((e) => e.rid);
    req.session.favoriteList = favoriteList;
  } else req.session.favoriteList = null;
  res.render("homepage", {
    // cookie: req.cookie.user_data,
    listRestaunrant: req.session.listRes,
    session: req.session,
    listResHaveVoucher,
  });
});

//user profile
router.use("/profile", require("./user.route"));

//signup
router.get("/signup", function (req, res) {
  res.render("vwSignIn&SignUp/signUp", { layout: false });
});
router.post(
  "/signup",
  upload("user").single("picture"),
  async function (req, res) {
    const checkExist = await userModel.findUser(req.body.userNameID);
    var user = { ...req.body };
    if (checkExist) {
      res.render("vwSignIn&SignUp/signUp", {
        error: "Username is not available",
        layout: false,
      });
      return;
    }
    if (req.file) {
      user.userPic = req.file.filename;
    }

    const result = await userModel.add(user);
    if (result.affectedRows === 1) {
      res.redirect("/login");
    } else {
      res.redirect("/signup");
    }
  }
);

//login
router.use("/login", require("./login.route"));

//logout
router.get("/logout", authenticalMDW.isLogined, (req, res) => {
  // res.clearCookie("user_data");
  req.session.destroy();
  res.redirect("/");
});

//resDatail page
router.get("/resDetail", async function (req, res) {
  const restaurant = await restaurantModel.getResByID(req.query.id);
  const rImages = await resImageModel.getByID(req.query.id);
  const feedback = await feedbackModel.getFeedBackAndUsersByID(req.query.id);
  const reply = await replyFBModel.getReplyAndUsersByID(req.query.id);
  const rating = await restaurantModel.getRatingByID(req.query.id);

  const voucher = await voucherModel.getVouByResID(req.query.id);
  // console.log(restaurant[0]);
  // console.log('------');
  // console.log(restaurant);

  const menu = await restaurantModel.getMenu(req.query.id);

  res.render("productDetail", {
    Feedback: feedback,
    Restaurant: restaurant[0],
    rImages,
    Reply: reply,
    Rating: rating[0],
    voucher,

    menuData: menu[0] === undefined ? "" : menu[0].menu,

    layout: "main",
  });
});

//feedback
router.post("/resDetail", authenticalMDW.isLogined, async function (req, res) {
  var date = new Date();
  console.log(date);
  const feedback = {
    userID: +req.user.userID,
    resID: +req.query.id,
    fbContent: req.body.feedbackContent,
    fbDate: date,
  };
  const result = await feedbackModel.add(feedback);
  res.redirect(`/resDetail?id=${req.query.id}`);
});

//reply

router.post(
  "/resDetail/reply",
  authenticalMDW.isLogined,
  async function (req, res) {
    if (req.body.replyContent && req.body.replyContent.trim()) {
      console.log(req.body);
      var date = new Date();
      const reply = {
        userID: +req.user.userID,
        resID: +req.query.resID,
        fbID: +req.query.fbID,
        repContent: req.body.replyContent,
        repDate: date,
      };
      const result = await replyFBModel.add(reply);
      res.redirect(`/resDetail?id=${req.query.resID}`);
    } else {
      res.send("error");
    }
  }
);

//search Restaurant

router.post("/search", async function (req, res) {
  const result = await restaurantModel.search(req.body.searchInput);
  console.log(result);
  res.render("homepage", {
    session: req.session,
    listRestaunrant: result[0],
  });
});

//search Res by cate
router.get("/search/byCate", (req, res) => {
  const cateID = +req.query.cate;
  var listRestaunrant = [];
  req.session.listRes.forEach((e) => {
    if (e.resCate === cateID) listRestaunrant.push(e);
  });
  res.render("homepage", {
    listRestaunrant,
    session: req.session,
  });
});

//add favorite list
router.get(
  "/favorite/:id",
  authenticalMDW.isLogined,
  async function (req, res) {
    var rid = +req.params.id;
    var uid = +req.user.userID;
    const favList = req.session.favoriteList;
    if (favList.indexOf(rid) > -1) {
      const result = await favoriteModel.delete([uid, rid]);
    } else {
      const entity = {
        uid,
        rid,
      };
      const result = await favoriteModel.add(entity);
    }
    res.redirect("/");
  }
);
//favorite list page
router.get(
  "/favoriteList",
  authenticalMDW.isLogined,
  async function (req, res) {
    const favList = await favoriteModel.getListFavorite(req.user.userID);
    res.render("favoriteList", {
      // cookie: req.cookies,
      session: req.session,
      FavoriteList: favList[0],
    });
  }
);

//Booking

router.post("/booking", authenticalMDW.isLogined, async function (req, res) {
  var vouID;
  if (req.body.vouID == 0) vouID = null;
  else vouID = +req.body.vouID;
  var date = new Date(req.body.ReserveTime);

  const reservation = {
    rid: req.body.rid,
    ReserveTime: date,
    NumOfDiners: req.body.NumOfDiners,
    Note: req.body.Note,
    vouID: vouID,
    uid: req.user.userID,
  };
  const rs = await reservationModel.add(reservation);
  let restaurant = await restaurantModel.getResByID(req.body.rid);
  let managerID = restaurant[0].managerID;
  req.app.io.emit(`booking-${managerID}`, {
    ...reservation,
    resName: restaurant[0].resName,
  });
  res.render("thankyou");
});

//Rating
router.post("/rating", authenticalMDW.isLogined, async function (req, res) {
  const rs = await restaurantModel.rating(req.body.rid, req.body.rating);
  res.redirect(`resDetail?id=${req.body.rid}`);
});
module.exports = router;

//View menu
router.get("/viewMenu", async (req, res) => {
  let resID = req.query.id;
  const menu = await restaurantModel.getMenu(resID);
  res.render("viewMenu", {
    layout: "empty",
    menuData: menu[0] === undefined ? "" : menu[0].menu,
  });
});

//help
router.get("/help", (req, res) => {
  res.render("help", {
    // layout: "empty",
  });
});
