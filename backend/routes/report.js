const express = require("express");
const multer = require("multer");
const { 
  findReport, 
  listReports, 
  updateReport, 
  deleteReport 
} = require("../controllers/reportController");
const auth = require("../middleware/auth");

const router = express.Router();

// Multer configuration for file uploads
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

router.post("/find", findReport);
router.get("/list", auth, listReports);
router.put("/:id", auth, upload.single("file"), updateReport);
router.delete("/:id", auth, deleteReport);

module.exports = router;
