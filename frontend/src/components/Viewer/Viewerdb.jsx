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
  FaUserShield,
  FaRedo
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

function viwerdb() {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    categories: 0,
    activeUsers: 0
  });
  const [stockMovementData, setStockMovementData] = useState(null);
  const [categoryDistributionData, setCategoryDistributionData] = useState(null);
  const [criticalStockItems, setCriticalStockItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        dashboardResponse,
        stockMovementResponse,
        categoryResponse,
        criticalStockResponse,
        activityResponse
      ] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/inventory/dashboard/stats'),
        axios.get('http://127.0.0.1:8000/api/inventory/dashboard/stock-movement'),
        axios.get('http://127.0.0.1:8000/api/inventory/dashboard/category-distribution'),
        axios.get('http://127.0.0.1:8000/api/inventory/dashboard/critical-stock'),
        axios.get('http://127.0.0.1:8000/api/inventory/recent-logs')
      ]);

      // Process dashboard stats
      if (dashboardResponse.data.success) {
        setDashboardData({
          totalProducts: dashboardResponse.data.data.totalProducts || 0,
          lowStockItems: dashboardResponse.data.data.lowStockItems || 0,
          categories: dashboardResponse.data.data.categories || 0,
          activeUsers: dashboardResponse.data.data.activeUsers || 0
        });
      }

      // Process stock movement data
      const stockMonths = stockMovementResponse.data.data.map(item => item.month);
      const stockValues = stockMovementResponse.data.data.map(item => parseInt(item.total));
      
      setStockMovementData({
        labels: stockMonths,
        datasets: [
          {
            label: "Stock Movements",
            backgroundColor: "#4F46E5",
            borderColor: "#4F46E5",
            borderWidth: 1,
            hoverBackgroundColor: "#4338CA",
            hoverBorderColor: "#4338CA",
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
            backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
            hoverBackgroundColor: ["#4338CA", "#059669", "#D97706", "#DC2626", "#7C3AED"],
          },
        ],
      });

      // Process critical stock items
      setCriticalStockItems(criticalStockResponse.data.data.map(item => ({
        name: item.name,
        quantity: item.quantity,
        threshold: item.threshold
      })));

      // Process recent activities
      setRecentActivities(activityResponse.data.data.map(item => ({
        action: item.action,
        details: item.details,
        created_at: item.created_at,
        user_name: item.user_name
      })));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.response?.data?.error || error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('created')) return 'bg-green-100 text-green-800';
    if (action.includes('updated')) return 'bg-blue-100 text-blue-800';
    if (action.includes('deleted')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <aside className="fixed w-64 h-screen bg-blue-900 text-blue-100 flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-2xl font-bold flex items-center">
            <FaWarehouse className="mr-2" />
            Viewer
          </h1>
          <p className="text-sm text-blue-400 mt-1">Viewer Dashboard</p>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            <li>
              <Link to="/viewerdb" className="flex items-center p-3 rounded-lg bg-blue-700 text-white">
                <FaBoxes className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/vinventory" className="flex items-center p-3 rounded-lg hover:bg-blue-800">
                <FaClipboardList className="mr-3" />
                Inventory
              </Link>
            </li>
            <li>
              <Link to="/lvogs" className="flex items-center p-3 rounded-lg hover:bg-blue-800">
                <FaHistory className="mr-3" />
                Activity Logs
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <Link to="/logout" className="flex items-center p-3 rounded-lg hover:bg-blue-800 text-red-400">
            <FaSignOutAlt className="mr-3" />
            Logout
          </Link>
        </div>
      </aside>

      <main className="flex-1 pl-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Inventory Dashboard</h1>
              <p className="text-blue-600 mt-1">Welcome back, Admin. Monitor your inventory status.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <FaRedo className="mr-2" />
                Refresh
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <FaUserShield />
                </div>
                <span className="font-medium text-blue-900">Admin</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div 
                  className="p-4 bg-white rounded-xl shadow-sm border border-blue-100"
                  data-aos="fade-up"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-blue-500">Total Products</p>
                      <h3 className="text-2xl font-bold text-blue-900 mt-1">{dashboardData.totalProducts}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                      <FaBoxes size={20} />
                    </div>
                  </div>
                  <p className="text-xs text-blue-500 mt-4">All inventory items</p>
                </div>
                <div 
                  className="p-4 bg-white rounded-xl shadow-sm border border-blue-100"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-blue-500">Low Stock Items</p>
                      <h3 className="text-2xl font-bold text-blue-900 mt-1">{dashboardData.lowStockItems}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-red-100 text-red-600">
                      <FaExclamationTriangle size={20} />
                    </div>
                  </div>
                  <p className="text-xs text-blue-500 mt-4">
                    <Link to="/valerts" className="text-blue-600 hover:underline">View alerts</Link>
                  </p>
                </div>
                <div 
                  className="p-4 bg-white rounded-xl shadow-sm border border-blue-100"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-blue-500">Categories</p>
                      <h3 className="text-2xl font-bold text-blue-900 mt-1">{dashboardData.categories}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-green-100 text-green-600">
                      <FaClipboardList size={20} />
                    </div>
                  </div>
                  <p className="text-xs text-blue-500 mt-4">Active categories</p>
                </div>
                <div 
                  className="p-4 bg-white rounded-xl shadow-sm border border-blue-100"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-blue-500">Active Users</p>
                      <h3 className="text-2xl font-bold text-blue-900 mt-1">{dashboardData.activeUsers}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                      <FaUsersCog size={20} />
                    </div>
                  </div>
                  <p className="text-xs text-blue-500 mt-4">
                    <Link to="/users" className="text-blue-600 hover:underline">Manage users</Link>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div 
                  className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"
                  data-aos="fade-up"
                >
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Stock Movement</h3>
                  <div className="h-80">
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
                      <div className="h-full flex items-center justify-center text-blue-500">
                        No stock movement data available
                      </div>
                    )}
                  </div>
                </div>

                <div 
                  className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"
                  data-aos="fade-up"
                >
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Category Distribution</h3>
                  <div className="h-80">
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
                      <div className="h-full flex items-center justify-center text-blue-500">
                        No category distribution data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div 
                  className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"
                  data-aos="fade-up"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-blue-900">Recent Activity</h3>
                    <Link to="/logs" className="text-sm text-blue-600 hover:underline">View all</Link>
                  </div>
                  {recentActivities.length > 0 ? (
                    <div className="divide-y divide-blue-200">
                      {recentActivities.slice(0, 4).map((activity, index) => (
                        <div
                          key={index}
                          className="p-4 hover:bg-blue-50 transition"
                          data-aos="fade-up"
                          data-aos-delay={index * 50}
                        >
                          <div className="flex items-start">
                            <div className={`p-2 rounded-lg ${getActionColor(activity.action)} mr-4`}>
                              <FaHistory />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                                <h4 className="font-medium text-blue-900">{activity.action}</h4>
                                <span className="text-xs text-blue-500">
                                  {new Date(activity.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-blue-600 mb-2">{activity.details}</p>
                              <div className="flex items-center text-xs text-blue-500">
                                <span>By:</span>
                                <span className="ml-1 font-medium">{activity.user_name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-blue-500">
                      No recent activities found
                    </div>
                  )}
                </div>

                <div 
                  className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"
                  data-aos="fade-up"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-blue-900">Critical Stock Items</h3>
                    <Link to="/inventory?filter=low" className="text-sm text-blue-600 hover:underline">View all</Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-blue-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Current Stock</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Threshold</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-blue-200">
                        {criticalStockItems.length > 0 ? (
                          criticalStockItems.map((item, index) => (
                            <tr key={index} className="hover:bg-blue-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-900">{item.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{item.quantity}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-500">{item.threshold}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-4 py-3 text-center text-blue-500">
                              No critical stock items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default viwerdb;