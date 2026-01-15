import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function UploadBox() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Check if we're in edit mode
  const editMode = location.state?.editMode || false;
  const reportData = location.state?.reportData || null;

  // Pre-fill form if in edit mode
  useEffect(() => {
    if (editMode && reportData) {
      setName(reportData.name || "");
      setEmail(reportData.email || "");
      setMobile(reportData.mobile || "");
      setDob(reportData.dob || "");
    }
  }, [editMode, reportData]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a PDF file only.");
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a PDF file only.");
    }
  };

  const uploadReport = async () => {
    if (!name ) {
      toast.error("Please enter full name.");
      return;
    }
    if (!mobile) {
      toast.error("Please enter mobile number.");
      return;
    }
    if (!dob) {
      toast.error("Please enter date of birth.");
      return;
    }
    
    // File is required only when creating new report
    if (!editMode && !file) {
      toast.error("Please select a PDF file.");
      return;
    }

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");

      if (editMode && reportData) {
        // Update existing report
        if (file) {
          // If new file is uploaded, use multipart/form-data
          const formData = new FormData();
          formData.append("name", name);
          formData.append("email", email);
          formData.append("mobile", mobile);
          formData.append("dob", dob);
          formData.append("file", file);
          formData.append("oldFileUrl", reportData.fileUrl); // Send old file URL for deletion

          const res = await fetch(`${BASE_URL}/report/${reportData._id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          });

          const data = await res.json();
          
          if (data?.success) {
            toast.success("Report updated successfully with new PDF!");
            navigate("/reports-list");
          } else {
            toast.error(data.message || 'Unable to update report. Please try again later.');
          }
        } else {
          // If no new file, just update the text fields
          const res = await fetch(`${BASE_URL}/report/${reportData._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              name,
              email,
              mobile,
              dob
            })
          });

          const data = await res.json();
          
          if (data?.success) {
            toast.success("Report details updated successfully!");
            navigate("/reports-list");
          } else {
            toast.error(data.message || 'Unable to update report. Please try again later.');
          }
        }
      } else {
        // Create new report
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("dob", dob);
        formData.append("file", file);

        const res = await fetch(`${BASE_URL}/upload-report`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        const data = await res.json();
        
        if (data?.success) {
          setName('');
          setEmail('');
          setMobile('');
          setDob('');
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          toast.success(data.message);
        } else {
          toast.error(data.message || 'Unable to upload file. Please try again later.');
        }
      }
    } catch (error) {
      console.log('ERROR while uploading/updating reports:', error);
      toast.error('Failed to save report! Something went wrong.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {editMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              )}
            </svg>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {editMode ? "Edit Report Details" : "Upload PDF Report"}
            </h2>
            <p className="text-sm text-gray-500">
              {editMode ? "Update the report information" : "Fill in the details and upload report"}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Mobile and DOB Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              PDF Report {!editMode && <span className="text-red-500">*</span>}
              {editMode && <span className="text-sm text-gray-500 font-normal ml-2">(Optional - leave empty to keep current file)</span>}
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-orange-500 bg-orange-50"
                  : file
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 hover:border-orange-400 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {file ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF only (max. 10MB)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Show existing PDF info in edit mode */}
          {editMode && reportData && !file && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Current PDF File</p>
                  <p className="text-blue-700">A PDF file is already uploaded. You can replace it by uploading a new file, or leave it unchanged.</p>
                  <button
                    onClick={() => window.open(reportData.fileUrl, "_blank")}
                    className="mt-2 text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    View Current PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            onClick={uploadReport}
            disabled={isUploading}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-md hover:shadow-lg"
            }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{editMode ? "Updating..." : "Uploading..."}</span>
              </span>
            ) : (
              editMode ? "Update Report Details" : "Upload PDF Report"
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex space-x-3">
          {editMode && (
            <button
              onClick={() => navigate("/reports-list")}
              className="flex-1 py-3 px-6 rounded-lg font-medium text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
          )}
          <button
            onClick={() => navigate("/reports-list")}
            className={`${editMode ? 'flex-1' : 'w-full'} py-3 px-6 rounded-lg font-medium text-orange-600 border-2 border-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center space-x-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>View All Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
