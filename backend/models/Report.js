const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
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
