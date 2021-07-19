const db = require("../utils/db");
const table = `restaurant`;
module.exports = {
  getAll: function () {
    const sql = `SELECT * FROM ${table}`;
    return db.getAllUsingView(sql);
  },
  getAllByManager: function (id) {
    const condition = {
      managerID: id,
    };
    const sql = `SELECT * FROM ${table} WHERE ?`;
    return db.getByCondition(sql, condition);
  },
  getLatestResID: function () {
    const query = `SELECT max(resID) as resID FROM ${table}`;
    return db.getLatestID(query);
  },
  single: function (id) {
    const condition = {
      resID: id,
    };
    const sql = `SELECT * FROM ${table} WHERE ?`;
    return db.getByCondition(sql, condition);
  },
  add: function (entity) {
    return db.add(table, entity);
  },
  delete: function (id) {
    const condition = {
      resID: id,
    };
    return db.delete(table, condition);
  },
  update: function (entity) {
    const condition = {
      resID: +entity.resID,
    };
    delete entity.resID;
    // console.log(entity);
    // console.log(condition);
    return db.update(table, entity, condition);
  },
  getResByID: function (id) {
    const resID = +id;
    const query = `SELECT * FROM ${table} WHERE resID=?`;
    return db.getByCondition(query, resID);
  },
  search: function (input) {
    // const query =
    //   `SELECT * FROM ${table} WHERE resID LIKE "%` +
    //   input +
    //   `%" OR resName LIKE "%` +
    //   input +
    //   `%" `;
    const condition = {
      resID: input,
    };
    const query = `CALL USP_ResSearching('${input}') `;
    console.log(query);
    console.log(input);
    return db.SearchBySP(query);
  },
  rating: function (rid, newRating) {
    const query = `CALL AddRating(?,?)`;
    return db.getByCondition(query, [rid, newRating]);
  },
  getAllRating: function () {
    return db.getAll("Rating");
  },
  getRatingByID: function (rid) {
    const query = `SELECT * FROM Rating WHERE rid = ?`;
    return db.getByCondition(query, rid);
  },

  getMenu: function (resID) {
    const query = `SELECT menu FROM resMenu WHERE ?`;
    return db.getByCondition(query, { id: resID });
  },
  saveMenu: async function (entity) {
    const rs = await db.checkExist("resMenu", { id: entity.id });
    if (rs[0].Count > 0) {
      return db.update("resMenu", { menu: entity.menu }, { id: entity.id });
    } else {
      return db.add("resMenu", entity);
    }
  },
};
