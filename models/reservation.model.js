const db = require("../utils/db");

const table = `Reservation`;
module.exports = {
  add: function (entity) {
    return db.add(table, entity);
  },
  updateRevenues: function (rid, month) {
    const query = `CALL AddRevenues(?, ?)`;
    return db.getByCondition(query, [rid, month]);
  },
  getBookingList: function (managerID, status) {
    const query = `CALL getBookingList(?,?)`;
    return db.getByCondition(query, [managerID, status]);
  },
  getUserBooking: function (userID, status) {
    const query = `SELECT * FROM ${table} LEFT JOIN voucher ON ${table}.vouID = voucher.vouID LEFT JOIN restaurant ON ${table}.rid = restaurant.resID WHERE uid = ${userID} AND status = ${status}`;
    return db.getByCondition(query, [userID, status]);
  },
  confirm: function (id) {
    let entity = { status: true };
    return db.update(table, entity, id);
  },
  cancel: function (id) {
    return db.delete(table, id);
  },
  getById: function (id) {
    const query = `SELECT * FROM ${table} WHERE ?`;
    return db.getByCondition(query, id);
  },
};
