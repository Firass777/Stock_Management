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
  FaArrowLeft,
  FaArrowRight,
  FaRedo
} from "react-icons/fa";

function Alerts() {
  const [criticalStockItems, setCriticalStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalCritical: 0,
    mostCriticalCategory: '',
    lowestStockItem: ''
  });

  useEffect(() => {
    fetchCriticalStock();
    fetchStats();
  }, []);

  const fetchCriticalStock = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://127.0.0.1:8000/api/inventory/dashboard/critical-stock');
      
      if (response.data.success) {
        setCriticalStockItems(response.data.data || []);
      } else {
        throw new Error(response.data.error || 'Failed to fetch critical stock items');
      }
    } catch (error) {
      console.error("Error fetching critical stock:", error);
      setError(error.response?.data?.error || error.message || 'Failed to load critical stock items');
      setCriticalStockItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/inventory/dashboard/stats');
      if (response.data.success) {
        setStats({
          totalCritical: response.data.data.lowStockItems || 0,
          mostCriticalCategory: 'Electronics', // Replace with actual data from API if available
          lowestStockItem: 'Smartphone' // Replace with actual data from API if available
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const refreshData = () => {
    fetchCriticalStock();
    fetchStats();
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = criticalStockItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(criticalStockItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                <Link to="/alerts" className="flex items-center p-3 rounded-lg bg-blue-700 text-white">
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
              <h2 className="text-2xl font-bold text-gray-800">Critical Stock Alerts</h2>
              <p className="text-gray-600">Items that require immediate attention</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Critical Items</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalCritical}</h3>
                </div>
                <div className="p-3 rounded-lg bg-red-50 text-red-600">
                  <FaExclamationTriangle />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Most Critical Category</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.mostCriticalCategory}</h3>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                  <FaClipboardList />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Lowest Stock Item</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.lowestStockItem}</h3>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                  <FaBoxes />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.threshold}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            <FaExclamationTriangle className="inline mr-1" /> Critical
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No critical stock items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {criticalStockItems.length > itemsPerPage && (
            <div className="flex justify-between items-center bg-white px-6 py-3 rounded-lg shadow">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, criticalStockItems.length)} of {criticalStockItems.length} items
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  <FaArrowLeft />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === pageNum 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Alerts;