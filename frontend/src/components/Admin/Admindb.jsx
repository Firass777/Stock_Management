import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaBoxes, 
  FaClipboardList, 
  FaChartLine, 
  FaUsersCog, 
  FaBell, 
  FaHistory,
  FaSignOutAlt,
  FaWarehouse,
  FaExclamationTriangle,
  FaUserShield
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

function Admindb() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockItems] = useState(15);
  const [recentActivities] = useState([
    "New shipment of 50 units received for Product A",
    "User John Doe updated inventory levels",
    "Low stock alert triggered for Product B",
    "New user Manager1 created with Manager role"
  ]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTotalProducts(1250);
    }, 1000);
  }, []);

  const stockLevelData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Stock Movements",
        backgroundColor: "#3B82F6",
        borderColor: "#3B82F6",
        borderWidth: 1,
        hoverBackgroundColor: "#2563EB",
        hoverBorderColor: "#2563EB",
        data: [1200, 1100, 900, 1300, 1500, 1400],
      },
    ],
  };

  const categoryDistributionData = {
    labels: ["Electronics", "Hardware", "Office", "Tools", "Safety"],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
        hoverBackgroundColor: ["#2563EB", "#059669", "#D97706", "#DC2626", "#7C3AED"],
      },
    ],
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar - Dark Theme */}
        <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold flex items-center">
              <FaWarehouse className="mr-2" />
              StockMaster
            </h1>
            <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-2">
              <li>
                <Link to="/admindb" className="flex items-center p-3 rounded-lg bg-blue-700 text-white">
                  <FaBoxes className="mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
                  <FaClipboardList className="mr-3" />
                  Inventory
                </Link>
              </li>
              <li>
                <Link to="/reports" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
                  <FaChartLine className="mr-3" />
                  Reports
                </Link>
              </li>
              <li>
                <Link to="/users" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
                  <FaUsersCog className="mr-3" />
                  User Management
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
                  <FaBell className="mr-3" />
                  Alerts
                </Link>
              </li>
              <li>
                <Link to="/logs" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
                  <FaHistory className="mr-3" />
                  Activity Logs
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <Link to="/logout" className="flex items-center p-3 rounded-lg hover:bg-gray-800 text-red-400">
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
              <p className="text-gray-600">Welcome back, Admin. Here's what's happening with your inventory.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <FaBell className="text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <FaUserShield />
                </div>
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </div>

          {/* Stats Cards - Modern Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <h3 className="text-2xl font-bold mt-1">{totalProducts}</h3>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <FaBoxes />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Updated just now</p>
              </div>
            </div>

            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                  <h3 className="text-2xl font-bold mt-1">{lowStockItems}</h3>
                </div>
                <div className="p-3 rounded-lg bg-red-50 text-red-600">
                  <FaExclamationTriangle />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/alerts" className="text-xs text-blue-600 hover:underline">View all alerts</Link>
              </div>
            </div>

            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Categories</p>
                  <h3 className="text-2xl font-bold mt-1">5</h3>
                </div>
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <FaClipboardList />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">5 active categories</p>
              </div>
            </div>

            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <h3 className="text-2xl font-bold mt-1">24</h3>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <FaUsersCog />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/users" className="text-xs text-blue-600 hover:underline">Manage users</Link>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Stock Movement Chart */}
            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Stock Movement (Last 6 Months)</h3>
              <div className="h-72">
                <Bar 
                  data={stockLevelData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Category Distribution Chart */}
            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
              <div className="h-72">
                <Pie 
                  data={categoryDistributionData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Recent Activity & Low Stock Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Link to="/logs" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>
              <ul className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                    <div className="ml-3">
                      <p className="text-sm">{activity}</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Low Stock Items */}
            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Critical Stock Items</h3>
                <Link to="/inventory?filter=low" className="text-sm text-blue-600 hover:underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">Industrial Bolts (5mm)</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">8</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">50</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">Safety Gloves (L)</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">12</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">100</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">Power Drill X200</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-600">3</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Admindb;