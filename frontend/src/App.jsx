import { Link, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

import Admindb from './components/Admin/Admindb';
import Users from "./components/Admin/Users";
import Inventory from "./components/Admin/Inventory";
import Reports from "./components/Admin/Reports";
import Alerts from "./components/Admin/Alert";
import ActivityLog from "./components/Admin/activitylog";

import Managerdb from "./components/Manger/Mangerdb";
import MInventory from "./components/Manger/MInventory";
import MReports from "./components/Manger/MRepots";
import MAlerts from "./components/Manger/MAlerts";
import MLogs from "./components/Manger/Mlogs";

import StockKeeperdb from "./components/StockKeeper/StockKeeperdb";
import SAlerts from "./components/StockKeeper/SAlerts";
import SInventory from "./components/StockKeeper/SInventory";
import SLogs from "./components/StockKeeper/SLogs";

import Viewerdb from "./components/Viewer/Viewerdb";
import VInventory from "./components/Viewer/Inventory";
import VLogs from "./components/Viewer/ActivityLog";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    AOS.init();

    // Check initial localStorage state
    const userData = localStorage.getItem('user');
    setIsAuthenticated(!!userData);

    // Listen for storage events to detect changes in localStorage
    const handleStorageChange = () => {
      const updatedUserData = localStorage.getItem('user');
      setIsAuthenticated(!!updatedUserData);
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Create a MutationObserver to detect localStorage changes in the same tab
    let lastUserData = localStorage.getItem('user');
    const observer = new MutationObserver(() => {
      const currentUserData = localStorage.getItem('user');
      if (currentUserData !== lastUserData) {
        lastUserData = currentUserData;
        setIsAuthenticated(!!currentUserData);
      }
    });

    // Observe changes (though MutationObserver doesn't directly watch localStorage, this is a fallback)
    observer.observe(document.documentElement, { subtree: true, childList: true });

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, []);

  // Effect to check localStorage periodically for same-tab changes
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      setIsAuthenticated(!!userData);
    };

    // Poll every second to catch same-tab localStorage changes
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 overflow-x-hidden flex flex-col" style={{ overflow: 'hidden' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-blue-600">Stock Manager</h1>
          {!isAuthenticated && (
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-gray-700 hover:text-blue-500 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-700 hover:text-blue-500 font-medium">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-700 hover:text-blue-500 font-medium">
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admindb" element={<Admindb />} />
          <Route path="/users" element={<Users />} /> 
          <Route path="/inventory" element={<Inventory />} /> 
          <Route path="/reports" element={<Reports />} /> 
          <Route path="/alerts" element={<Alerts />} /> 
          <Route path="/logs" element={<ActivityLog />} /> 

          <Route path="/mangerdb" element={<Managerdb />} /> 
          <Route path="/minventory" element={<MInventory />} /> 
          <Route path="/mreports" element={<MReports />} /> 
          <Route path="/malerts" element={<MAlerts />} /> 
          <Route path="/mlogs" element={<MLogs />} /> 

          <Route path="/stockdb" element={<StockKeeperdb />} /> 
          <Route path="/sinventory" element={<SInventory />} /> 
          <Route path="/salerts" element={<SAlerts />} /> 
          <Route path="/slogs" element={<SLogs />} /> 

          <Route path="/viewerdb" element={<Viewerdb />} /> 
          <Route path="/vinventory" element={<VInventory />} /> 
          <Route path="/vlogs" element={<VLogs />} /> 
        </Routes>
      </div>

      {/* Footer Section */}
      <footer className="py-6 bg-gray-800 text-white text-center mt-auto">
        <p>© 2025 Stock Manager. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;