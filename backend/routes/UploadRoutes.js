const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const { uploadReports } = require("../controllers/UploadReports");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"), false);
    }
  }
});

router.post("/upload-report", auth, upload.single("file"), uploadReports);

module.exports = router;
