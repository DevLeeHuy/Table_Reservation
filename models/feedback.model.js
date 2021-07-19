const db = require("../utils/db");
const table = `feedBack`;
module.exports = {
  getAll: function () {
    return db.getAll(table);
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
  update: function (entity, id) {
    delete entity.resID;

    const condition = {
      resID: id,
    };
    console.log(entity);
    console.log(condition);
    return db.update(table, entity, condition);
  },
  getFeedBackByID:function(id){
    const resID=+id;
  const query=`SELECT * FROM ${table} WHERE resID=?`;
    return db.getByCondition(query,resID);
  },
  getFeedBackAndUsersByID:function(id){
    const resID=+id;
  const query=`SELECT * FROM ${table},users WHERE ${table}.userID=users.userID AND  resID=?`;
    return db.getByCondition(query,resID);
  },
  search:function(input){
    const query=`SELECT * FROM ${table} WHERE resID LIKE "%`+input +`%" OR resName LIKE "%`+input +`%" `;
    return db.Search(query,input);
  }
};
