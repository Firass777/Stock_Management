import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 5,
    lowStockItems: 2,
    categories: 4,
    activeUsers: 0
  });
  const [stockMovementData, setStockMovementData] = useState(null);
  const [categoryDistributionData, setCategoryDistributionData] = useState(null);
  const [criticalStockItems, setCriticalStockItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([
    "New shipment received (5 items)",
    "User activity logged",
    "Low stock alert triggered for 2 items",
    "System maintenance completed"
  ]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        stockMovementResponse,
        categoryResponse,
        criticalStockResponse
      ] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/inventory/dashboard/stock-movement'),
        axios.get('http://127.0.0.1:8000/api/inventory/dashboard/category-distribution'),
        axios.get('http://127.0.0.1:8000/api/inventory/dashboard/critical-stock')
      ]);

      // Process stock movement data
      const stockMonths = stockMovementResponse.data.data.map(item => item.month);
      const stockValues = stockMovementResponse.data.data.map(item => parseInt(item.total));
      
      setStockMovementData({
        labels: stockMonths,
        datasets: [
          {
            label: "Stock Movements",
            backgroundColor: "#3B82F6",
            borderColor: "#3B82F6",
            borderWidth: 1,
            hoverBackgroundColor: "#2563EB",
            hoverBorderColor: "#2563EB",
            data: stockValues,
          },
        ],
      });

      // Process category distribution data
      const categoryLabels = categoryResponse.data.data.map(item => item.category);
      const categoryValues = categoryResponse.data.data.map(item => item.count);
      
      setCategoryDistributionData({
        labels: categoryLabels,
        datasets: [
          {
            data: categoryValues,
            backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
            hoverBackgroundColor: ["#2563EB", "#059669", "#D97706", "#DC2626", "#7C3AED"],
          },
        ],
      });

      // Process critical stock items
      setCriticalStockItems(criticalStockResponse.data.data.map(item => ({
        name: item.name,
        quantity: item.quantity,
        threshold: item.threshold
      })));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex flex-1">
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
              <li>
              <Link
                to="/"
                onClick={() => localStorage.clear()}
                className="flex items-center p-3 rounded-lg hover:bg-emerald-800 text-red-400"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </Link>
            </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto min-h-screen">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <h3 className="text-2xl font-bold mt-1">{dashboardData.totalProducts}</h3>
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
                  <h3 className="text-2xl font-bold mt-1">{dashboardData.lowStockItems}</h3>
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
                  <h3 className="text-2xl font-bold mt-1">{dashboardData.categories}</h3>
                </div>
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <FaClipboardList />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">{dashboardData.categories} active categories</p>
              </div>
            </div>

            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <h3 className="text-2xl font-bold mt-1">{dashboardData.activeUsers}</h3>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Stock Movement</h3>
              <div className="h-72">
                {stockMovementData ? (
                  <Bar 
                    data={stockMovementData} 
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
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No stock movement data available
                  </div>
                )}
              </div>
            </div>

            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
              <div className="h-72">
                {categoryDistributionData ? (
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
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No category distribution data available
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <p className="text-xs text-gray-500 mt-1">Just now</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

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
                    {criticalStockItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{item.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{item.quantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{item.threshold}</td>
                      </tr>
                    ))}
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