const express = require("express");
const app = express();

module.exports = function (app) {
    app.use("/", express.static("views/public"));

    app.use(
        express.urlencoded({
            extended: true,
        })
    );
    app.use(express.json());
}