import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/report/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (data.success) {
        setReports(data.reports);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/report/${reportId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Report deleted successfully");
        fetchReports();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  const openEditModal = (report) => {
    // Navigate to upload page with report data for editing
    navigate("/upload-reports", { state: { editMode: true, reportData: report } });
  };


  const handleViewPDF = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleDownloadPDF = async (report) => {
    try {
      const response = await fetch(report.fileUrl, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }
  
      const blob = await response.blob();
  
      // Force download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
  
      link.href = blobUrl;
      link.download = `report_${report.name}_${report.mobile}_${report.dob}.pdf`;
      link.style.display = "none";
      link.rel = "noopener";
  
      document.body.appendChild(link);
      link.click();
  
      // Cleanup (important)
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
  
      toast.success("Download started successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report");
    }
  };
  

  return (
    <>
      <Header />
      <div className="min-h-[87vh] bg-gradient-to-br from-orange-50 via-white to-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Uploaded Reports</h1>
              <p className="text-sm text-gray-600 mt-1">Manage all uploaded PDF reports</p>
            </div>
            <button
              onClick={() => navigate("/upload-reports")}
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Upload New Report</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : reports.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Found</h3>
              <p className="text-gray-600 mb-6">Start by uploading your first report</p>
              <button
                onClick={() => navigate("/upload-reports")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                Upload Report
              </button>
            </div>
           ) : (
            <>
              {/* Desktop Table View - visible on screens >= 868px */}
              <div className="hidden min-[868px]:block">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Mobile
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            DOB
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Uploaded
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reports.map((report) => (
                          <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {report.name || "N/A"}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {report.mobile}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {report.email || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {report.dob}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(report.uploadedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center space-x-2">
                                {/* <button
                                  onClick={() => handleViewPDF(report.fileUrl)}
                                  className="p-2.5 border border-blue-600 hover:bg-blue-200 text-blue-600 rounded-xl transition-all shadow-md hover:shadow-lg"
                                  title="View PDF"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button> */}
                                <button
                                  onClick={() => handleDownloadPDF(report)}
                                  className="p-2.5 border border-purple-300 hover:bg-purple-200 text-purple-600 rounded-xl transition-all shadow-md hover:shadow-lg"
                                  title="Download PDF"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => openEditModal(report)}
                                  className="p-2.5 border border-green-300 hover:bg-green-200 text-green-600 rounded-xl transition-all shadow-md hover:shadow-lg"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(report._id)}
                                  className="p-2.5 border border-red-300 hover:bg-red-200 text-red-600 rounded-xl transition-all shadow-md hover:shadow-lg"
                                  title="Delete"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mobile/Tablet Card View - visible on screens < 868px */}
              <div className="block min-[868px]:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {reports.map((report) => (
                    <div
                      key={report._id}
                      className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all"
                    >
                      {/* PDF Icon */}
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>

                      {/* User Info */}
                      <div className="space-y-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {report.name || "N/A"}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{report.mobile}</span>
                          </div>
                          {report.email && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="truncate">{report.email}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>DOB: {report.dob}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{new Date(report.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          {/* <button
                            onClick={() => handleViewPDF(report.fileUrl)}
                            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>View</span>
                          </button> */}
                          <button
                            onClick={() => handleDownloadPDF(report)}
                            className="flex-1 flex items-center justify-center space-x-2 border border-purple-300 hover:bg-purple-200 text-purple-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Download</span>
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(report)}
                            className="flex-1 flex items-center justify-center space-x-2 border border-green-300 hover:bg-green-200 text-green-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(report._id)}
                            className="flex-1 flex items-center justify-center space-x-2 border border-red-300 hover:bg-red-200 text-red-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
