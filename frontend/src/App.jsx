import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/Landing";
import './App.css'
import Login from './pages/Login';
import DownloadReport from './pages/DownloadReport';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/upload-reports" 
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            } 
          />
          <Route path="/download-reports" element={<DownloadReport />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
        toastStyle={{ zIndex: 2147483647 }}
      />
    </>
  )
}

export default App
