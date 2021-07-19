const restaurantModel = require("../models/restaurant.model");
const userModel = require("../models/user.model");
const db = require("../utils/db");
module.exports = {
  index: async function (req, res) {
    const statistic = await db.getAll("statistic");
    req.session.statistic = [];
    statistic.forEach((e) => {
      req.session.statistic[e.staName] = e.quantity;
    });

    res.render("vwAdmin/adminpage", {
      layout: "admin",
      session: req.session,
    });
  },
  getListRes: async function (req, res) {
    const Restaurants = await restaurantModel.getAll();
    req.session.Restaurants = Restaurants;
    res.render("vwAdmin/listProduct", {
      layout: "admin",
      Restaurants: req.session.Restaurants,
    });
  },
  deleteUser: async function (req, res) {
    await userModel.delete(req.params.id);
    res.redirect('/admin/users');
  },
  getListUser: async function (req, res) {
    const listUsers = await userModel.getAll();
    req.session.listUsers = listUsers;
    res.render("vwAdmin/listUser", {
      layout: "admin",
      listUsers: req.session.listUsers,
    });
  },
};
