import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaBoxes, 
  FaClipboardList, 
  FaChartLine, 
  FaBell, 
  FaHistory,
  FaSignOutAlt,
  FaWarehouse,
  FaExclamationTriangle,
  FaUserShield,
  FaArrowUp,
  FaArrowDown,
  FaChevronRight
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

function Managerdb() {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    categories: 0,
    monthlyChange: 0
  });
  const [stockMovementData, setStockMovementData] = useState(null);
  const [categoryDistributionData, setCategoryDistributionData] = useState(null);
  const [criticalStockItems, setCriticalStockItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
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
            label: "Stock Level",
            data: stockValues,
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderColor: "#10B981",
            borderWidth: 2,
            tension: 0.4,
            fill: true
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
            backgroundColor: ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"],
            hoverBackgroundColor: ["#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0"],
          },
        ],
      });

      // Process critical stock items
      setCriticalStockItems(criticalStockResponse.data.data.map(item => ({
        name: item.name,
        quantity: item.quantity,
        threshold: item.threshold,
        trend: item.quantity < item.threshold ? "down" : "up"
      })));

      // Set dashboard stats
      setDashboardData({
        totalProducts: categoryValues.reduce((a, b) => a + b, 0),
        lowStockItems: criticalStockResponse.data.data.length,
        categories: categoryLabels.length,
        monthlyChange: calculateMonthlyChange(stockValues)
      });

      // Mock recent activities
      setRecentActivities([
        { action: "New shipment received (5 items)", time: "Just now", type: "add" },
        { action: "Low stock alert triggered for 2 items", time: "30 min ago", type: "alert" },
        { action: "System maintenance completed", time: "1 hour ago", type: "update" },
        { action: "Inventory report generated", time: "2 hours ago", type: "report" }
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const calculateMonthlyChange = (stockValues) => {
    if (stockValues.length < 2) return 0;
    const last = stockValues[stockValues.length - 1];
    const prev = stockValues[stockValues.length - 2];
    return ((last - prev) / prev * 100).toFixed(1);
  };

  return (
    <div className="flex min-h-screen bg-emerald-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-emerald-100 flex flex-col fixed h-full">
        <div className="p-6 border-b border-emerald-800">
          <h1 className="text-2xl font-bold flex items-center">
            <FaWarehouse className="mr-2" />
            StockMaster
          </h1>
          <p className="text-sm text-emerald-400 mt-1">Manager Dashboard</p>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            <li>
              <Link to="/mangerdb" className="flex items-center p-3 rounded-lg bg-emerald-700 text-white">
                <FaBoxes className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/minventory" className="flex items-center p-3 rounded-lg hover:bg-emerald-800">
                <FaClipboardList className="mr-3" />
                Inventory
              </Link>
            </li>
            <li>
              <Link to="/mreports" className="flex items-center p-3 rounded-lg hover:bg-emerald-800">
                <FaChartLine className="mr-3" />
                Reports
              </Link>
            </li>
            <li>
              <Link to="/malerts" className="flex items-center p-3 rounded-lg hover:bg-emerald-800">
                <FaBell className="mr-3" />
                Alerts
              </Link>
            </li>
            <li>
              <Link to="/mlogs" className="flex items-center p-3 rounded-lg hover:bg-emerald-800">
                <FaHistory className="mr-3" />
                Activity Logs
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-emerald-800">
          <Link to="/logout" className="flex items-center p-3 rounded-lg hover:bg-emerald-800 text-red-400">
            <FaSignOutAlt className="mr-3" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content  */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Inventory Overview</h1>
            <p className="text-gray-600">Welcome back, Manager. Here's your inventory at a glance.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition flex items-center"
            >
              Refresh Data
              <FaChevronRight className="ml-2" size={12} />
            </button>
            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <FaUserShield size={14} />
              </div>
              <span className="font-medium">Manager</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalProducts}</h3>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FaBoxes className="text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center">
              <span className={`text-xs font-medium flex items-center ${
                dashboardData.monthlyChange >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {dashboardData.monthlyChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {Math.abs(dashboardData.monthlyChange)}% this month
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Items</p>
                <h3 className="text-2xl font-bold">{dashboardData.lowStockItems}</h3>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50">
              <Link to="/alerts" className="text-xs text-emerald-600 font-medium hover:underline">
                View critical alerts
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Categories</p>
                <h3 className="text-2xl font-bold">{dashboardData.categories}</h3>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FaClipboardList className="text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-50">
              <p className="text-xs text-gray-500">Active product categories</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Stock Movement</h3>
              <div className="flex space-x-2">
                <button className="text-xs px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md">
                  {stockMovementData?.labels.length || 6} Months
                </button>
              </div>
            </div>
            <div className="h-72">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : stockMovementData ? (
                <Bar 
                  data={stockMovementData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        grid: {
                          color: "#ECFDF5"
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
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

          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            <div className="h-72">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : categoryDistributionData ? (
                <Pie 
                  data={categoryDistributionData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    },
                    cutout: '65%'
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No category data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity & Critical Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Link to="/logs" className="text-sm text-emerald-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`mt-1 flex-shrink-0 h-2 w-2 rounded-full ${
                      activity.type === 'add' ? 'bg-emerald-500' : 
                      activity.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activities found
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Critical Stock Items</h3>
              <Link to="/inventory?filter=low" className="text-sm text-emerald-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : criticalStockItems.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b border-emerald-100">
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">Stock</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalStockItems.map((item, index) => (
                      <tr key={index} className="border-b border-emerald-50 last:border-0">
                        <td className="py-3 text-sm font-medium">{item.name}</td>
                        <td className="py-3 text-sm text-red-600">{item.quantity}</td>
                        <td className="py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            <FaArrowDown className="mr-1" /> Low
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No critical stock items found
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Managerdb;