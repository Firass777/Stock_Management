import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FaBoxes, 
  FaBell, 
  FaHistory,
  FaSignOutAlt,
  FaWarehouse,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
  FaRedo,
  FaClipboardList
} from "react-icons/fa";

function SAlerts() {
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
          mostCriticalCategory: 'Electronics',
          lowestStockItem: 'Smartphone'
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = criticalStockItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(criticalStockItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen bg-indigo-50">
      <aside className="fixed w-64 h-screen bg-indigo-900 text-indigo-100 flex flex-col">
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
              <Link to="/stockdb" className="flex items-center p-3 rounded-lg hover:bg-indigo-800">
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
              <Link to="/salerts" className="flex items-center p-3 rounded-lg bg-indigo-700 text-white">
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

      <main className="flex-1 pl-64 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Stock Alerts</h1>
            <p className="text-indigo-600 mt-1">Monitor critical inventory levels</p>
          </div>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center mt-4 md:mt-0"
          >
            <FaRedo className="mr-2" />
            Refresh
          </button>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-indigo-500">Critical Items</p>
                <h3 className="text-2xl font-bold text-indigo-900 mt-1">{stats.totalCritical}</h3>
              </div>
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <FaExclamationTriangle size={20} />
              </div>
            </div>
            <p className="text-xs text-indigo-500 mt-4">Below threshold</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-indigo-500">Critical Category</p>
                <h3 className="text-2xl font-bold text-indigo-900 mt-1">{stats.mostCriticalCategory}</h3>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <FaClipboardList size={20} />
              </div>
            </div>
            <p className="text-xs text-indigo-500 mt-4">Highest risk</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-indigo-500">Lowest Stock</p>
                <h3 className="text-2xl font-bold text-indigo-900 mt-1">{stats.lowestStockItem}</h3>
              </div>
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                <FaBoxes size={20} />
              </div>
            </div>
            <p className="text-xs text-indigo-500 mt-4">Urgent restock</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden mb-6">
            <div className="p-4 border-b border-indigo-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-indigo-900">Critical Stock Items</h3>
              <Link to="/sinventory" className="text-indigo-600 hover:text-indigo-800 text-sm">
                View Inventory
              </Link>
            </div>
            <table className="min-w-full divide-y divide-indigo-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Threshold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-200">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index} className="hover:bg-indigo-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-500">{item.threshold}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          <FaExclamationTriangle className="inline mr-1" /> Critical
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-indigo-500">
                      No critical stock items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {criticalStockItems.length > itemsPerPage && (
          <div className="flex flex-col md:flex-row items-center justify-between bg-white px-6 py-3 rounded-xl shadow-sm border border-indigo-100">
            <div className="text-sm text-indigo-700 mb-2 md:mb-0">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, criticalStockItems.length)} of {criticalStockItems.length} items
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-indigo-200 rounded disabled:opacity-50 hover:bg-indigo-50"
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
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'border-indigo-200 hover:bg-indigo-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-indigo-200 rounded disabled:opacity-50 hover:bg-indigo-50"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SAlerts;