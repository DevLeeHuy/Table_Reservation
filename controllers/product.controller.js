const restaurantModel = require("../models/restaurant.model");
const resImageModel = require("../models/resImage.model");
module.exports = {
  add: async function (req, res) {
    Restaurant = {
      resName: req.body.resName,
      resAddress: req.body.resAdd,
      resPhone: req.body.resPhone,
      resThumbnail: req.files[0].filename,
      resOpen: req.body.resOpen,
      resClose: req.body.resClose,
      resPrice: req.body.resPrice,
      managerID: req.user.userID,
      resCate:req.body.resCate
    };

    await restaurantModel.add(Restaurant);
    const ID = await restaurantModel.getLatestResID();
    req.files.forEach(async (e) => {
      resImage = { resID: +ID[0].resID, resImage: e.filename };
      await resImageModel.add(resImage);
    });

    res.redirect("/manager/product/add");
  },
  delete: async function (req, res, next) {
    const resID = +req.params.id;
    console.log(resID);
    const result = await restaurantModel.delete(resID);
    console.log(result);
    next();
  },
  edit: async function (req, res, next) {
    Restaurant = {
      resID: +req.body.resID,
      resName: req.body.resName,
      resAddress: req.body.resAdd,
      resPhone: req.body.resPhone,
      resOpen: req.body.resOpen,
      resClose: req.body.resClose,
      resPrice: req.body.resPrice,
      resCate:req.body.resCate
    };
    const id = +Restaurant.resID;
    if(req.files.length>0)
    {
      Restaurant.resThumbnail=req.files[0].filename;
          //delete image before insert

      await resImageModel.delete(id);
          // //insert

      req.files.forEach(async (e) => {
        resImage = { resID: id, resImage: e.filename };
        await resImageModel.add(resImage);
      });
    }
    const result = await restaurantModel.update(Restaurant);

          
    next();
  },
  showResByID: async function (req, res) {},
};
