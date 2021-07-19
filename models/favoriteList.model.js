const db = require("../utils/db");
const table = "favorites";
module.exports = {
  getList: function (uid) {
    const sql = `SELECT * FROM ${table} WHERE ?`;
    const condition = {
      uid: uid,
    };
    return db.getByCondition(sql, condition);
  },
  getListFavorite: function (uid) {
    const sql = `CALL getFavoriteList(?)`;
    return db.getByCondition(sql, uid);
  },
  add: function (entity) {
    return db.add(table, entity);
  },
  delete: function (condition) {
    const sql = `DELETE FROM ${table} WHERE uid = ? AND rid =? `;
    return db.getByCondition(sql, condition);
  },
};
