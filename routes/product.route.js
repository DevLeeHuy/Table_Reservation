const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
const restaurantModel = require("../models/restaurant.model");
const uploadController = require("../controllers/multi.upload.controller");

var type = "admin";

router.get("/add", (req, res) => {
  res.render("vwAdmin/addProduct", {
    layout: "manager",
    user: req.user,
  });
});
router.get("/edit", async (req, res) => {
  var Restaurants = await restaurantModel.getAll();
  if (req.user.userType != 1) {
    Restaurants = await restaurantModel.getAllByManager(req.user.userID);
    type = "manager";
  }
  req.session.Restaurants = Restaurants;
  res.render("vwAdmin/listProduct", {
    layout: type,
    user_type: type,
    Restaurants: req.session.Restaurants,
  });
});

//upload mutiple images
router.post("/add", uploadController.multipleUpload, productCtrl.add);
// );
// ,upload("restaurant").single("resThumbnail")
// ,

router.get("/delete/:id", productCtrl.delete, (req, res) => {
  res.redirect("/" + type + "/product/edit");
});
router.post("/edit", uploadController.multipleUpload,productCtrl.edit,
  (req, res) => {
    res.redirect("/" + type + "/product/edit");
  }
);
// 
// router.post("/details",productCtrl.showResByID,);

module.exports = router;
