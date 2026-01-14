const express = require("express");
const { findReport } = require("../controllers/reportController");

const router = express.Router();

router.post("/find", findReport);
// router.post("/download", downloadReport);


module.exports = router;
