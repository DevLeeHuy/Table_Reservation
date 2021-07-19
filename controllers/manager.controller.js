const restaurantModel = require("../models/restaurant.model");
const userModel = require("../models/user.model");
const reserveModel = require("../models/reservation.model");
const db = require("../utils/db");
module.exports = {
  index: async function (req, res) {
    const user_id = req.user.userID;
    const listRestaunrant = await restaurantModel.getAllByManager(user_id);
    req.session.myRestaurant = listRestaunrant;
    const revenues = await db.getAll("revenues");
    req.session.revenues = revenues;
    res.render("vwAdmin/managerPage", {
      layout: "manager",
      session: req.session,
      // cookie: req.cookies,
    });
  },
  resetRevenues: async function (req, res) {
    const query = `CALL ResetRevenues(?)`;
    const rs = await db.getByCondition(query, req.params.id);
    res.redirect("/manager");
  },
  BookingList: async function (req, res) {
    let managerID = req.user.userID;
    const BookingList = await reserveModel.getBookingList(managerID, false);
    req.session.BookingList = BookingList[0];
    res.render("vwAdmin/bookingList", {
      layout: "manager",
      BookingList: req.session.BookingList,
      TableTitle: "PROCESSING BOOKING LIST",
      confirm: true,
    });
  },
  confirmBooking: async function (req, res) {
    var rs = await reserveModel.confirm({ id: req.query.id });
    var date = new Date(req.query.time);
    rs = await reserveModel.updateRevenues(req.query.rid, date.getMonth() + 1);
    res.redirect("/manager/BookingList");
  },
  cancelBooking: async function (req, res) {
    const rs = await reserveModel.cancel(req.query);
    res.redirect("/manager/BookingList");
  },
  BookingHistory: async function (req, res) {
    let managerID = req.user.userID;
    const BookingList = await reserveModel.getBookingList(managerID, true);
    req.session.BookingList = BookingList[0];
    res.render("vwAdmin/bookingList", {
      layout: "manager",
      BookingList: req.session.BookingList,
      TableTitle: "BOOKING HISTORY",
    });
  },
  DesignMenu: function (req, res) {
    res.render("vwAdmin/designMenuPage", {
      layout: "manager",
      session: req.session,
    });
  },
  addMenu: async function (req, res) {
    let resID = req.query.id;
    const menu = await restaurantModel.getMenu(resID);
    res.render("vwAdmin/addMenu", {
      layout: "manager",
      menuData: menu[0] === undefined ? "" : menu[0].menu,
      resID: resID,
    });
  },
  saveMenu: async function (req, res) {
    const rs = await restaurantModel.saveMenu(req.body);
    res.redirect("/manager/DesignMenu");
  },
};
