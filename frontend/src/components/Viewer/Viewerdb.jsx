import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaBoxes, 
  FaClipboardList, 
  FaHistory,
  FaSignOutAlt,
  FaWarehouse,
  FaExclamationTriangle,
  FaUserShield
} from "react-icons/fa";

function Viewerdb() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [totalProducts, setTotalProducts] = useState(0);
  const [recentActivities] = useState([
    "Received 50 units of Product X",
    "Shipped 20 units of Product Y",
    "Updated stock for Product Z",
    "Created stock movement record for Product A"
  ]);

  useEffect(() => {
    setTimeout(() => {
      setTotalProducts(1250);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col h-full bg-purple-50">
      <div className="flex flex-1">
        {/* Sidebar - Purple Theme */}
        <aside className="w-64 bg-purple-900 text-purple-100 flex flex-col">
          <div className="p-6 border-b border-purple-800">
            <h1 className="text-2xl font-bold flex items-center">
              <FaWarehouse className="mr-2" />
              StockMaster
            </h1>
            <p className="text-sm text-purple-400 mt-1">Viewer Dashboard</p>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-2">
              <li>
                <Link to="/viewerdb" className="flex items-center p-3 rounded-lg bg-purple-700 text-white">
                  <FaBoxes className="mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="flex items-center p-3 rounded-lg hover:bg-purple-800">
                  <FaClipboardList className="mr-3" />
                  Inventory
                </Link>
              </li>
              <li>
                <Link to="/logs" className="flex items-center p-3 rounded-lg hover:bg-purple-800">
                  <FaHistory className="mr-3" />
                  Activity Logs
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-purple-800">
            <Link to="/logout" className="flex items-center p-3 rounded-lg hover:bg-purple-800 text-red-400">
              <FaSignOutAlt className="mr-3" />
              Logout
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto min-h-screen">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Inventory Overview</h2>
              <p className="text-gray-600">Welcome back, Viewer. Review stock details.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <FaUserShield />
                </div>
                <span className="font-medium">Viewer</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <h3 className="text-2xl font-bold mt-1">{totalProducts}</h3>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <FaBoxes />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-100">
                <p className="text-xs text-gray-500">Updated just now</p>
              </div>
            </div>

            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Categories</p>
                  <h3 className="text-2xl font-bold mt-1">5</h3>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <FaClipboardList />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-100">
                <p className="text-xs text-gray-500">5 active categories</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Link to="/logs" className="text-sm text-purple-600 hover:underline">View all</Link>
            </div>
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-purple-500"></div>
                  <div className="ml-3">
                    <p className="text-sm">{activity}</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Viewerdb;