const db = require("../utils/db");
const table = `users`;
module.exports = {
  add: function (entity) {
    return db.add(table, entity);
  },
  getAll: function () {
    const sql = "SELECT * FROM vwListUser";
    return db.getAllUsingView(sql);
  },
  delete: function (id) {
    const condition = {
      userID: id,
    };
    return db.delete(table, condition);
  },
  update: function (entity, id) {
    delete entity.resID;
    const condition = {
      userID: +id,
    };
    // console.log(entity);
    // console.log(condition);
    return db.update(table, entity, condition);
  },
  login: function (User) {
    const sql = `SELECT * FROM ${table} WHERE userNameID = ? AND userPassword = ?`;
    return db.getByCondition(sql, [User.userNameID, User.userPassword]);
  },
  findUser: async (userinfo) => {
    const sql = `SELECT * FROM ${table} WHERE userNameID = ?`;
    const result = await db.getByCondition(sql, userinfo);
    if (result.length > 0) return result[0];
    else return null;
  },
  getById: function (id) {
    const sql = `SELECT * FROM ${table} WHERE ?`;
    const userID = { userID: id };
    return db.getByCondition(sql, userID);
  },
  getDiscount: function (uid, rid) {
    const sql = `SELECT * FROM voucher WHERE uid = ? AND rid = ?`;
    return db.getByCondition(sql, [uid, rid]);
  },
};
