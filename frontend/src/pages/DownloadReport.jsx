import { useState } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header";

export default function DownloadReport() {
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const findReport = async () => {
    if (!mobile || !dob) {
      toast.error("Please fill in both mobile number and date of birth.");
      return;
    }

    try {
      setIsDownloading(true);
      const res = await fetch("https://diagnos-reports-3xhe.vercel.app/api/report/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, dob })
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      if (!data.downloadUrl) {
        toast.error("Download link not available.");
        return;
      }

      // Fetch the file as blob to ensure proper download
      try {
        const fileResponse = await fetch(data.downloadUrl);
        const blob = await fileResponse.blob();
        
        // Create blob URL and trigger download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `report_${mobile}_${dob}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL
        window.URL.revokeObjectURL(blobUrl);
        
        toast.success("Download started.");
        setMobile("");
        setDob("");
      } catch (downloadError) {
        // Fallback: direct link if blob download fails
        console.error("Blob download failed, using direct link:", downloadError);
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.download = `report_${mobile}_${dob}.pdf`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download started.");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[87vh] bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12 px-4">
        <div className="flex justify-center items-center min-h-[calc(80vh-120px)]">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Download Report</h2>
                  <p className="text-sm text-gray-500">Enter your details to download your report</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
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

              {/* Info Box */}
              {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">No login required</p>
                    <p className="text-blue-700">Simply enter your mobile number and date of birth to download your report.</p>
                  </div>
                </div>
              </div> */}

              {/* Download Button */}
              <div className="pt-4">
                <button
                  onClick={findReport}
                  disabled={isDownloading}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${
                    isDownloading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isDownloading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Preparing download...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download Report</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
