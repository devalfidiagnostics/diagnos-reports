const Report = require("../models/Report");

exports.findReport = async (req, res) => {
  try {
    const { mobile, dob } = req.body;

    if (!mobile || !dob) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and date of birth are required."
      });
    }

    const report = await Report.findOne({ mobile, dob });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found."
      });
    }

    // ✅ Supabase: direct public URL
    return res.status(200).json({
      success: true,
      downloadUrl: report.fileUrl
    });

  } catch (error) {
    console.error("Find Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report."
    });
  }
};
