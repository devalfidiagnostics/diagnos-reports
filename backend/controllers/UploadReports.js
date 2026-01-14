const supabase = require("../config/supabase");
const Report = require("../models/Report");

exports.uploadReports = async (req, res) => {
  try {
    const { mobile, dob } = req.body;

    if (!mobile || !dob || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Mobile, DOB and PDF are required."
      });
    }

    const filePath = `${mobile}_${dob}_${Date.now()}.pdf`;

    const fileBuffer = new Uint8Array(req.file.buffer);

    const { error: uploadError } = await supabase.storage
      .from("reports") // bucket
      .upload(filePath, fileBuffer, {
        contentType: "application/pdf",
        upsert: false
      });

    if (uploadError) {
      console.error(uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("reports")
      .getPublicUrl(filePath);


    await Report.create({
      mobile,
      dob,
      fileUrl: data.publicUrl
    });

    return res.status(201).json({
      success: true,
      message: "Report uploaded successfully."
    });

  } catch (error) {
    console.error("Upload failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload report."
    });
  }
};
