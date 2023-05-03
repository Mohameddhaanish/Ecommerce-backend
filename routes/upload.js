const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const file_mimetype = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = file_mimetype[file.mimetype];
    let validationError = new Error("file type is not supported");
    if (isValid) {
      validationError = null;
    }
    cb(validationError, "./public/uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    const finlename = file.originalname;
    cb(null, `${finlename} ${Date()}`);
  },
});
const upload = multer({ storage: storage });
const uploadFile = upload.single("image");
router.post("/", (req, res) => {
  uploadFile(req, res, (err) => {
    if (err) {
      return res.status(400).send({ errorsss: err.message });
    }
    res.send("fileuploaded successfully");
    console.log(req.file);
    console.log(`${req.protocol}://${req.get("host")}/public/uploads`);
  });
});
module.exports = router;
