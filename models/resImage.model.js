const db = require("../utils/db");
const table = `resImage`;
module.exports = {
  getAll: function () {
    return db.getAll(table);
  },
  getAllByManager: function (id) {
    const condition = {
      managerID: id,
    };
    const sql = `SELECT * FROM ${table} WHERE ?`;
    return db.getByCondition(sql, condition);
  },
  getLatestResID: function () {
    const query=`SELECT max(resID) as resID FROM ${table}`;
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

    console.log(entity);
    console.log(condition);
    return db.update(table, entity, condition);
  },
  getByID:function(id){
    const resID=+id;
  const query=`SELECT * FROM ${table} WHERE resID=?`;
    return db.getByCondition(query,resID);
  },
  search:function(input){
    const query=`SELECT * FROM ${table} WHERE resID LIKE "%`+input +`%" OR resName LIKE "%`+input +`%" `;
    return db.Search(query,input);
  }
};
