import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
  FaRedo,
  FaFileAlt,
  FaChartPie,
  FaChartBar,
  FaDollarSign,
  FaLayerGroup
} from "react-icons/fa";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    total_items: 0,
    total_quantity: 0,
    total_value: 0,
    categories_count: 0
  });
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [stockTrends, setStockTrends] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    categories: 0,
    lowStockItems: 0
  });
  const [criticalStock, setCriticalStock] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchSummary(),
        fetchInventoryDetails(),
        fetchCategoryDistribution(),
        fetchStockTrends(),
        fetchDashboardStats(),
        fetchCriticalStock(),
        fetchTotalQuantity(),
        fetchTotalStockValue()
      ]);
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/inventory/dashboard/summary');
    if (response.data.success) {
      setSummary(response.data.data);
    }
  };

  const fetchInventoryDetails = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/inventory/dashboard/details');
    if (response.data.success) {
      setInventoryDetails(response.data.data);
    }
  };

  const fetchCategoryDistribution = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/inventory/dashboard/category-distribution');
    if (response.data.success) {
      setCategoryDistribution(response.data.data);
    }
  };

  const fetchStockTrends = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/inventory/dashboard/stock-movement');
    if (response.data.success) {
      setStockTrends(response.data.data);
    }
  };

  const fetchDashboardStats = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/inventory/dashboard/stats');
    if (response.data.success) {
      setDashboardStats(response.data.data);
    }
  };

  const fetchCriticalStock = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/inventory/dashboard/critical-stock');
    if (response.data.success) {
      setCriticalStock(response.data.data);
    }
  };

  const fetchTotalQuantity = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/inventory/dashboard/total-quantity');
    if (response.data.success) {
      setTotalQuantity(response.data.data.totalQuantity || 0);
    }
  };

  const fetchTotalStockValue = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/inventory/dashboard/total-stock-value');
    if (response.data.success) {
      setTotalStockValue(response.data.data.totalStockValue || 0);
    }
  };

  const refreshData = () => {
    fetchAllData();
  };

  // Format currency values safely
  const formatCurrency = (value) => {
    if (typeof value !== 'number') {
      value = parseFloat(value) || 0;
    }
    return value.toFixed(2);
  };

  // Prepare data for the line chart
  const lineChartData = {
    labels: stockTrends.map(item => item.month),
    datasets: [
      {
        label: 'Inventory Movement',
        data: stockTrends.map(item => item.total),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHitRadius: 10,
        pointBorderWidth: 2
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Quantity: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Quantity'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    },
    maintainAspectRatio: false
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
                <Link to="/admindb" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
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
                <Link to="/reports" className="flex items-center p-3 rounded-lg bg-blue-700 text-white">
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

        <main className="flex-1 p-6 overflow-auto min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Inventory Reports</h2>
              <p className="text-gray-600">Comprehensive inventory analysis and statistics</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={refreshData}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                title="Refresh data"
              >
                <FaRedo className="text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <FaUserShield />
                </div>
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button 
                onClick={() => setError(null)} 
                className="float-right font-bold"
              >
                &times;
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Products</p>
                      <h3 className="text-2xl font-bold mt-1">{dashboardStats.totalProducts}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                      <FaBoxes />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Quantity</p>
                      <h3 className="text-2xl font-bold mt-1">{totalQuantity}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 text-green-600">
                      <FaLayerGroup />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Value</p>
                      <h3 className="text-2xl font-bold mt-1">${formatCurrency(totalStockValue)}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                      <FaDollarSign />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Categories</p>
                      <h3 className="text-2xl font-bold mt-1">{dashboardStats.categories}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                      <FaChartPie />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Category Distribution</h3>
                    <FaChartPie className="text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {categoryDistribution.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.category}</span>
                        <div className="w-2/3 flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${(category.count / dashboardStats.totalProducts) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Inventory Trends</h3>
                    <FaChartLine className="text-gray-400" />
                  </div>
                  <div className="h-64 w-full">
                    {stockTrends.length > 0 ? (
                      <Line data={lineChartData} options={lineChartOptions} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No trend data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Critical Stock Items</h3>
                    <FaExclamationTriangle className="text-red-400" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {criticalStock.length > 0 ? (
                          criticalStock.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">{item.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.threshold}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                              No critical stock items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Inventory Summary</h3>
                    <FaFileAlt className="text-gray-400" />
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Total Items</p>
                        <h3 className="text-xl font-bold mt-1">{summary.total_items}</h3>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Total Quantity</p>
                        <h3 className="text-xl font-bold mt-1">{summary.total_quantity}</h3>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Total Value</p>
                        <h3 className="text-xl font-bold mt-1">${formatCurrency(summary.total_value)}</h3>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Categories</p>
                        <h3 className="text-xl font-bold mt-1">{summary.categories_count}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Full Inventory Details</h3>
                  <FaClipboardList className="text-gray-400" />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inventoryDetails.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(item.unit_price)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(item.quantity * item.unit_price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Reports;