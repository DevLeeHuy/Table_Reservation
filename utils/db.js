const mysql = require("mysql");
const config = require("../config/config.json");
const db = mysql.createConnection(config.mysql);
db.connect((err) => {
  if (err) {
    console.log("Can not connect🤷‍♂️🤷‍♂️🤷‍♂️: " + err);
  } else console.log("Connected👨🏻‍🤝‍👨🏼👨🏻‍🤝‍👨🏼👨🏻‍🤝‍👨🏼");
});

module.exports = {
  getAll: function (table) {
    return new Promise(function (resolve, reject) {
      const sql = `SELECT * FROM ${table}`;
      db.query(sql, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  getAllUsingView: function (sql) {
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  add: function (table, entity) {
    return new Promise(function (resolve, reject) {
      const sql = `INSERT INTO ${table} SET ?`;
      db.query(sql, entity, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  delete: function (table, condition) {
    return new Promise(function (resolve, reject) {
      const sql = `DELETE FROM ${table} WHERE ?`;
      // const sql =`CALL de`
      db.query(sql, condition, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  update: function (table, entity, condition) {
    return new Promise(function (resolve, reject) {
      const sql = `UPDATE ${table} SET ? WHERE ?`;
      db.query(sql, [entity, condition], function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  checkExist: function (table, condition) {
    return new Promise(function (resolve, reject) {
      const sql = `SELECT COUNT(*) AS Count FROM ${table} WHERE ?`;
      db.query(sql, condition, function (err, result) {
        if (err) {
          console.log(sql);
          return reject(err);
        }
        resolve(result);
      });
    });
  },
  getByCondition: function (sql, condition) {
    return new Promise(function (resolve, reject) {
      db.query(sql, condition, function (err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },
  getLatestID: function (sql) {
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },
  Search: function (sql, condition) {
    return new Promise(function (resolve, reject) {
      db.query(sql, [condition, condition], function (err, result) {
        if (err) {
          console.log(query);
          return reject(err);
        }
        resolve(result);
      });
    });
  },
  SearchBySP:function(sql){
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
};
