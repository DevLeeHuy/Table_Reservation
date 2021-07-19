const session = require("express-session");
module.exports = function (app) {
  app.use(
    session({
      resave: true,
      saveUninitialized: true,
      secret: "this-is-a-secret-token",
      cookie: { maxAge: 2592000000 },
    })
  );
};
