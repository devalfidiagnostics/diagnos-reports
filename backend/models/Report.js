const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    index: true
  },
  dob: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Report", reportSchema);
