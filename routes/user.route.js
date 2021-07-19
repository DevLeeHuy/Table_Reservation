const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const { upload } = require("../controllers/upload.controller");
const reserveModel = require("../models/reservation.model");
const restaurantModel = require("../models/restaurant.model");
const authenticalMDW = require("../middleware/authenticate.mdw");
router.get("/", authenticalMDW.isLogined, async function (req, res) {
  const BookingList = await reserveModel.getUserBooking(req.user.userID, false);
  res.render("userProfile", {
    BookingList: BookingList,
  });
});

router.post("/info", authenticalMDW.isLogined, userCtrl.updateInfo);
router.post(
  "/image",
  authenticalMDW.isLogined,
  upload("user").single("userPic"),
  userCtrl.updateImage
);
router.get("/cancelBooking", async function (req, res) {
  const reservation = (await reserveModel.getById({ id: req.query.id }))[0];
  const rs = await reserveModel.cancel({ id: req.query.id });
  let restaurant = await restaurantModel.getResByID(req.query.rid);
  let managerID = restaurant[0].managerID;
  req.app.io.emit(`cancelBooking-${managerID}`, {
    ...reservation,
    resName: restaurant[0].resName,
  });
  res.redirect("/profile");
});

module.exports = router;
