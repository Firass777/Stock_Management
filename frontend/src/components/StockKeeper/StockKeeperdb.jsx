import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaBoxes, 
  FaBell, 
  FaHistory,
  FaSignOutAlt,
  FaWarehouse,
  FaExclamationTriangle,
  FaUserShield,
  FaClipboardList,
  FaRedo
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

function StockKeeperdb() {
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

      const stockMonths = stockMovementResponse.data.data.map(item => item.month);
      const stockValues = stockMovementResponse.data.data.map(item => parseInt(item.total));
      
      setStockMovementData({
        labels: stockMonths,
        datasets: [
          {
            label: "Stock Level",
            data: stockValues,
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderColor: "#6366F1",
            borderWidth: 2,
            tension: 0.4,
            fill: true
          },
        ],
      });

      const categoryLabels = categoryResponse.data.data.map(item => item.category);
      const categoryValues = categoryResponse.data.data.map(item => item.count);
      
      setCategoryDistributionData({
        labels: categoryLabels,
        datasets: [
          {
            data: categoryValues,
            backgroundColor: ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF"],
            hoverBackgroundColor: ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"],
          },
        ],
      });

      setCriticalStockItems(criticalStockResponse.data.data.map(item => ({
        name: item.name,
        quantity: item.quantity,
        threshold: item.threshold,
        trend: item.quantity < item.threshold ? "down" : "up"
      })));

      setDashboardData({
        totalProducts: categoryValues.reduce((a, b) => a + b, 0),
        lowStockItems: criticalStockResponse.data.data.length,
        categories: categoryLabels.length,
        monthlyChange: calculateMonthlyChange(stockValues)
      });

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
    <div className="flex min-h-screen bg-indigo-50">
      <aside className="w-64 bg-indigo-900 text-indigo-100 flex-shrink-0 fixed h-full">
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-2xl font-bold flex items-center">
            <FaWarehouse className="mr-2" />
            StockMaster
          </h1>
          <p className="text-sm text-indigo-400 mt-1">Stock Keeper Dashboard</p>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            <li>
              <Link to="/stockdb" className="flex items-center p-3 rounded-lg bg-indigo-700 text-white">
                <FaBoxes className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/sinventory" className="flex items-center p-3 rounded-lg hover:bg-indigo-800">
                <FaClipboardList className="mr-3" />
                Inventory
              </Link>
            </li>
            <li>
              <Link to="/salerts" className="flex items-center p-3 rounded-lg hover:bg-indigo-800">
                <FaBell className="mr-3" />
                Alerts
              </Link>
            </li>
            <li>
              <Link to="/slogs" className="flex items-center p-3 rounded-lg hover:bg-indigo-800">
                <FaHistory className="mr-3" />
                Activity Logs
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-indigo-800">
          <Link to="/logout" className="flex items-center p-3 rounded-lg hover:bg-indigo-800 text-red-400">
            <FaSignOutAlt className="mr-3" />
            Logout
          </Link>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Dashboard Overview</h1>
            <p className="text-indigo-600 mt-1">Real-time inventory insights</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
            >
              <FaRedo className="mr-2" size={14} />
              Refresh
            </button>
            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-indigo-200">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                <FaUserShield size={14} />
              </div>
              <span className="font-medium text-indigo-900">Stock Keeper</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-indigo-500">Total Products</p>
                <h3 className="text-2xl font-bold text-indigo-900">{dashboardData.totalProducts}</h3>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                <FaBoxes size={20} />
              </div>
            </div>
            <p className="text-xs text-indigo-500 mt-2">Across all categories</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-indigo-500">Low Stock Items</p>
                <h3 className="text-2xl font-bold text-indigo-900">{dashboardData.lowStockItems}</h3>
              </div>
              <div className="p-3 rounded-lg bg-red-50 text-red-600">
                <FaExclamationTriangle size={20} />
              </div>
            </div>
            <p className="text-xs text-indigo-500 mt-2">Requires attention</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-indigo-500">Categories</p>
                <h3 className="text-2xl font-bold text-indigo-900">{dashboardData.categories}</h3>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                <FaClipboardList size={20} />
              </div>
            </div>
            <p className="text-xs text-indigo-500 mt-2">Product classifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Stock Movement Trend</h3>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : stockMovementData ? (
                <Bar 
                  data={stockMovementData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        grid: { color: "#E0E7FF" }
                      },
                      x: {
                        grid: { display: false }
                      }
                    }
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-indigo-500">
                  No stock movement data available
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Category Distribution</h3>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : categoryDistributionData ? (
                <Pie 
                  data={categoryDistributionData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right' }
                    }
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-indigo-500">
                  No category data available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-indigo-900">Recent Activities</h3>
              <Link to="/logs" className="text-sm text-indigo-600 hover:underline">
                View all
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center py-2 border-b border-indigo-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'add' ? 'bg-indigo-500' : 
                    activity.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-sm text-indigo-900">{activity.action}</p>
                    <p className="text-xs text-indigo-500">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-indigo-500">
                No recent activities found
              </div>
            )}
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-indigo-900">Critical Stock Alerts</h3>
              <Link to="/alerts" className="text-sm text-indigo-600 hover:underline">
                View all
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : criticalStockItems.length > 0 ? (
              criticalStockItems.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center py-2 border-b border-indigo-50 last:border-0">
                  <FaExclamationTriangle className="text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">{item.name}</p>
                    <p className="text-xs text-red-600">Stock: {item.quantity} (Threshold: {item.threshold})</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-indigo-500">
                No critical stock items found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StockKeeperdb;