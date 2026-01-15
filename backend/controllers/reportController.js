const Report = require("../models/Report");
const supabase = require("../config/supabase");

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

// Get all reports for authenticated user
exports.listReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ uploadedAt: -1 });

    return res.status(200).json({
      success: true,
      reports
    });

  } catch (error) {
    console.error("List Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports."
    });
  }
};

// Update report details
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('req.body', req.body);
    const { name, email, mobile, dob, oldFileUrl } = req.body;
    console.log('name', name);
    console.log('email', email);
    console.log('mobile', mobile);
    console.log('dob', dob);
    // console.log('oldFileUrl', oldFileUrl);
    const report = await Report.findById(id);
    console.log('report', report);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found."
      });
    }

    // Update text fields
    if (name !== undefined) report.name = name;
    if (email !== undefined) report.email = email;
    if (mobile !== undefined) report.mobile = mobile;
    if (dob !== undefined) report.dob = dob;

    // If new file is uploaded, handle file replacement
    if (req.file) {
      // Extract old file path from URL
      const oldFileUrl = report.fileUrl;
      const urlParts = oldFileUrl.split('/');
      const oldFilePath = urlParts[urlParts.length - 1];

      // Delete old file from Supabase
      const { error: deleteError } = await supabase.storage
        .from("reports")
        .remove([oldFilePath]);

      if (deleteError) {
        console.error("Error deleting old file:", deleteError);
        // Continue even if deletion fails
      }

      // Upload new file
      const newFilePath = `${mobile}_${dob}_${Date.now()}.pdf`;
      const fileBuffer = new Uint8Array(req.file.buffer);

      const { error: uploadError } = await supabase.storage
        .from("reports")
        .upload(newFilePath, fileBuffer, {
          contentType: "application/pdf",
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get new file URL
      const { data } = supabase.storage
        .from("reports")
        .getPublicUrl(newFilePath);

      // Update file URL in report
      report.fileUrl = data.publicUrl;
    }

    await report.save();

    return res.status(200).json({
      success: true,
      message: req.file 
        ? "Report and PDF updated successfully." 
        : "Report details updated successfully.",
      report
    });

  } catch (error) {
    console.error("Update Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update report."
    });
  }
};

// Delete report
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found."
      });
    }

    // Extract file path from URL
    const fileUrl = report.fileUrl;
    const urlParts = fileUrl.split('/');
    const filePath = urlParts[urlParts.length - 1];

    // Delete from Supabase storage
    const { error: deleteError } = await supabase.storage
      .from("reports")
      .remove([filePath]);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
    }

    // Delete from database
    await Report.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully."
    });

  } catch (error) {
    console.error("Delete Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete report."
    });
  }
};
