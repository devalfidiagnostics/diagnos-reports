import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [logoError, setLogoError] = useState(false);
  
  // Don't show header on login page
  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  // Check if on download page
  const isDownloadPage = location.pathname === "/download-reports";

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Logo path - Vite will resolve this from src/assets/alfi-logo.png
  const logoPath = new URL('../assets/alfi-logo.png', import.meta.url).href;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center py-4">
          {/* Left Section - Logo and Company Name */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Logo Image */}
            <div className="flex items-center justify-center">
              {logoPath ? (
                <img 
                  src={logoPath}
                  alt="alfi Diagnostics Logo" 
                  className="h-12 w-12 object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="relative w-12 h-12">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M 50 10 A 40 40 0 0 1 85 50 A 40 40 0 0 1 50 90 A 40 40 0 0 1 15 50 A 40 40 0 0 1 50 10"
                      fill="#F76B00"
                      stroke="#1A1A1A"
                      strokeWidth="1"
                    />
                    <rect x="70" y="60" width="20" height="8" fill="#505050" stroke="#1A1A1A" strokeWidth="1" rx="2" />
                  </svg>
                </div>
              )}
            </div>
            {/* Company Name - Only show if logo doesn't contain text */}
            {!logoPath && (
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  alfli
                </h1>
                <p className="text-xs text-gray-600 -mt-1">Diagnostics</p>
              </div>
            )}
          </div>

          {/* Middle Section - Contact Info (Desktop Only) */}
          <div className="flex items-center space-x-0 flex-1 justify-center">
            {/* Phone Number */}
            <div className="px-6 flex flex-col border-r border-orange-600">
              <p className="text-sm font-semibold text-gray-900">(+91) 86578 69200</p>
              <p className="text-xs text-gray-600 mt-0.5">Phone No.</p>
            </div>

            {/* Email */}
            <div className="px-6 flex flex-col border-r border-orange-600">
              <p className="text-sm font-semibold text-gray-900">alfidiagnostics@gmail.com</p>
              <p className="text-xs text-gray-600 mt-0.5">Email Id.</p>
            </div>

            {/* Clinic Address */}
            <div className="px-6 flex flex-col">
              <p className="text-sm font-semibold text-gray-900">Kalyan, Maharashtra 421301.</p>
              <p className="text-xs text-gray-600 mt-0.5">Clinics Address</p>
            </div>
          </div>

          {/* Right Section - Logout Button (Desktop) - Hidden on download page */}
          {!isDownloadPage && (
            <div className="flex-shrink-0 min-w-[120px]">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-900 bg-white border-2 border-orange-600 rounded-lg hover:bg-orange-50 transition-colors uppercase tracking-wide"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-orange-600 border-2 border-orange-600 rounded-lg hover:bg-orange-700 transition-colors uppercase tracking-wide"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="">
          <div className="flex items-center justify-between gap-3 w-full">
            {/* Left - Logo */}
            <div className="flex items-center justify-center flex-shrink-0">
              {logoPath ? (
                <img 
                  src={logoPath}
                  alt="alfi Diagnostics Logo" 
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M 50 10 A 40 40 0 0 1 85 50 A 40 40 0 0 1 50 90 A 40 40 0 0 1 15 50 A 40 40 0 0 1 50 10"
                      fill="#F76B00"
                      stroke="#1A1A1A"
                      strokeWidth="1"
                    />
                    <rect x="70" y="60" width="20" height="8" fill="#505050" stroke="#1A1A1A" strokeWidth="1" rx="2" />
                  </svg>
                </div>
              )}
            </div>

              {/* Contact Details */}
              <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-right mt-1">

            {/* 📞 Mobile Number — hide below 450px */}
            <div className="hidden min-[450px]:flex items-center justify-end space-x-1.5">
              <svg
                className="w-3.5 h-3.5 text-gray-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-gray-700 text-xs sm:text-sm">
                (+91) 86578 69200
              </span>
            </div>

            {/* ✉️ Email — always visible */}
            <div className="flex items-center justify-end space-x-1.5">
              <svg
                className="w-3.5 h-3.5 text-gray-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-700 text-xs sm:text-sm">
                alfidiagnostics@gmail.com
              </span>
            </div>

            {/* 📍 Location — hide below 734px */}
            <div className="hidden min-[734px]:flex items-center justify-end space-x-1.5">
              <svg
                className="w-3.5 h-3.5 text-gray-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-gray-700 text-xs sm:text-sm">
                Kalyan, Maharashtra 421301
              </span>
            </div>

          </div>

            {/* Right - Contact Info and Logout Button */}
            <div className="flex flex-wrap items-center gap-2">
              <div>
                {/* Logout Button - Aligned to the right after contact details */}
              {!isDownloadPage && (
                <div className="flex justify-end">
                  {token ? (
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-orange-600 rounded-md hover:bg-orange-50 transition-colors"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-orange-600 border border-orange-600 rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
