import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://diagnos-reports-3xhe.vercel.app/api' || 'http://localhost:5000/api';

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    try {
      setIsLoggingIn(true);
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        toast.success('Login successful.');
        navigate('/upload-reports');
      } else {
        toast.error(data.message || 'Unable to login. Please check your credentials.');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Failed to login. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logo path - Vite will resolve this from src/assets/logo.png
  const logoPath = new URL('../assets/alfi-logo.png', import.meta.url).href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12 px-4">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 space-y-6">
            {/* Logo and Header */}
            <div className="flex flex-col items-center pb-4 border-b border-gray-200">
              {/* Logo */}
              <div className="flex items-center justify-center">
                {logoPath ? (
                  <img 
                    src={logoPath}
                    alt="alfi Diagnostics Logo" 
                    className="h-16 w-16 md:h-20 md:w-20 object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="relative w-16 h-16 md:w-20 md:h-20">
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
              
              {/* Company Name */}
              {!logoPath ? <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  alfli
                </h1>
                <p className="text-sm md:text-base text-gray-600 mt-1">Diagnostics</p>
              </div> : null}

              {/* Welcome Text */}
              <div className="text-center pt-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${
                  isLoggingIn
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-md hover:shadow-lg"
                }`}
              >
                {isLoggingIn ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </span>
                )}
              </button>
            </div>

            {/* Footer Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-2 md:space-y-0">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>(+91) 86578 69200</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>alfidiagnostics@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
