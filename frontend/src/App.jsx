import { Link, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
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

import StockKeeperdb from "./components/StockKeeper/StockKeeperdb";

import Viewerdb from "./components/Viewer/Viewerdb";


function App() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 overflow-x-hidden flex flex-col" style={{ overflow: 'hidden' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-blue-600">Stock Manager</h1>
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

          <Route path="/stockkeeperdb" element={<StockKeeperdb />} /> 

          <Route path="/viewerdb" element={<Viewerdb />} /> 





          
        </Routes>
      </div>

      {/* Footer Section */}
      <footer className="py-6 bg-gray-800 text-white text-center mt-auto">
        <p>&copy; 2025 Stock Manager. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
