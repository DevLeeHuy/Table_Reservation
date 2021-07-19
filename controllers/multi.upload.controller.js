const upload = require("../middleware/upload");

const multipleUpload = async (req, res,next) => {
  // console.log(req.body.resImage);
  // if(req.body.resImage)
  // {
    try {
      await upload(req, res);
      if (req.files.length <= 0) {
        // return res.send(`You must select at least 1 file.`);
        next();

      }
      next();
  
    } catch (error) {
      console.log(error);
  
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
      return res.send(`Error when trying upload many files: ${error}`);
    }
  // }
  // else
  // next();
  
};

module.exports = {
  multipleUpload: multipleUpload
};