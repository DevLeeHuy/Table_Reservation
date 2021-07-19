const exphbs = require("express-handlebars");
var hbs_sections = require("express-handlebars-sections");
const numeral = require("numeral");
const dateFormat = require("dateformat");

module.exports = function (app) {
  //Template engine
  app.engine(
    "hbs",
    exphbs({
      layoutsDir: "views/_layouts",
      defaultLayout: "main.hbs",
      extname: ".hbs",
      helpers: {
        section: hbs_sections(),
        //compararison helper
        compare: function (a, b, options) {
          if (arguments.length < 3)
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

          var operator = options.hash.operator || "==";

          var operators = {
            "==": function (l, r) {
              return l == r;
            },
            "===": function (l, r) {
              return l === r;
            },
            "!=": function (l, r) {
              return l != r;
            },
            "<": function (l, r) {
              return l < r;
            },
            ">": function (l, r) {
              return l > r;
            },
            "<=": function (l, r) {
              return l <= r;
            },
            ">=": function (l, r) {
              return l >= r;
            },
            typeof: function (l, r) {
              return typeof l == r;
            },
          };

          if (!operators[operator])
            throw new Error(
              "Handlerbars Helper 'compare' doesn't know the operator " +
                operator
            );

          var result = operators[operator](a, b);

          if (result) {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        },
        formatNumber: function (value) {
          return numeral(value).format("0,0");
        },
        dateFormat: function (value) {
          return dateFormat(value, "dS, mm, yyyy, h:MM:ss TT  ");
        },
        exist: function (elem, list, options) {
          if (list.indexOf(elem) > -1) {
            return options.fn(this);
          }
          return options.inverse(this);
        },
      },
    })
  );
  app.set("view engine", "hbs");
};
