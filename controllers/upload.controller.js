const multer = require("multer");
const util = require("util");
const path = require("path");

function storage(name) {
  try {
    // Configuring appropriate storage
    var storage = multer.diskStorage({
      // Absolute path
      destination: function (req, file, callback) {
        callback(null, "views/public/img/" + name);
      },
      // Match the field name in the request body
      filename: function (req, file, callback) {
        callback(null, file.originalname);
      },
    });
    return storage;
  } catch (ex) {
    console.log("Error :\n" + ex);
  }
}

var upload = (name) => {
  return multer({ storage: storage(name) });
};

module.exports = { upload };
