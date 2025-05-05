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
  FaFilter,
  FaSearch,
  FaRedo,
  FaArrowLeft,
  FaArrowRight,
  FaClipboardList
} from "react-icons/fa";

function SLogs() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchActivityLogs();
  }, [currentPage]);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoryResponse, inventoryResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/category-stock-levels/recent-logs', {
          params: { page: currentPage, per_page: itemsPerPage }
        }),
        axios.get('http://127.0.0.1:8000/api/inventory/recent-logs', {
          params: { page: currentPage, per_page: itemsPerPage }
        })
      ]);

      const allActivities = [
        ...(categoryResponse.data.success ? categoryResponse.data.data : []),
        ...(inventoryResponse.data.success ? inventoryResponse.data.data : []),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setActivities(allActivities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity logs:", error.response?.data || error.message);
      setError(error.response?.data?.error || error.message || 'Failed to load activity logs');
      setActivities([]);
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === "all" || 
      activity.action.toLowerCase().includes(filter.toLowerCase());
    const matchesSearch = activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getActionColor = (action) => {
    if (action.includes('created')) return 'bg-green-100 text-green-800';
    if (action.includes('updated')) return 'bg-blue-100 text-blue-800';
    if (action.includes('deleted')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

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
              <Link to="/salerts" className="flex items-center p-3 rounded-lg hover:bg-indigo-800">
                <FaBell className="mr-3" />
                Alerts
              </Link>
            </li>
            <li>
              <Link to="/slogs" className="flex items-center p-3 rounded-lg bg-indigo-700 text-white">
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
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-indigo-900">Activity Logs</h1>
              <p className="text-indigo-600 mt-1">Monitor system changes and actions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="pl-10 pr-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <button 
                onClick={fetchActivityLogs}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
              >
                <FaRedo className="mr-2" />
                Refresh
              </button>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => handleFilterChange("all")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white border border-indigo-100"}`}
              data-aos="fade-up"
            >
              <h3 className="font-medium">All Activities</h3>
              <p className="text-2xl font-bold">{activities.length}</p>
              <p className="text-xs opacity-80 mt-1">Total actions</p>
            </div>
            <div 
              onClick={() => handleFilterChange("created")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "created" ? "bg-green-600 text-white" : "bg-white border border-indigo-100"}`}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <h3 className="font-medium">Created</h3>
              <p className="text-2xl font-bold">
                {activities.filter(a => a.action.toLowerCase().includes("created")).length}
              </p>
              <p className="text-xs opacity-80 mt-1">New entries</p>
            </div>
            <div 
              onClick={() => handleFilterChange("updated")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "updated" ? "bg-blue-600 text-white" : "bg-white border border-indigo-100"}`}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h3 className="font-medium">Updated</h3>
              <p className="text-2xl font-bold">
                {activities.filter(a => a.action.toLowerCase().includes("updated")).length}
              </p>
              <p className="text-xs opacity-80 mt-1">Modified entries</p>
            </div>
            <div 
              onClick={() => handleFilterChange("deleted")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "deleted" ? "bg-red-600 text-white" : "bg-white border border-indigo-100"}`}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <h3 className="font-medium">Deleted</h3>
              <p className="text-2xl font-bold">
                {activities.filter(a => a.action.toLowerCase().includes("deleted")).length}
              </p>
              <p className="text-xs opacity-80 mt-1">Removed entries</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="p-4 border-b border-indigo-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-indigo-900 flex items-center">
                <FaFilter className="mr-2 text-indigo-600" />
                Activity Log
              </h3>
              <button 
                onClick={fetchActivityLogs}
                className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 transition flex items-center text-sm"
              >
                <FaRedo className="mr-2" />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-indigo-600"></div>
              </div>
            ) : (
              <>
                <div className="divide-y divide-indigo-200">
                  {currentActivities.length === 0 ? (
                    <div className="text-center py-12 text-indigo-500">
                      No activities found
                    </div>
                  ) : (
                    currentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="p-4 hover:bg-indigo-50 transition"
                        data-aos="fade-up"
                        data-aos-delay={index * 50}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg ${getActionColor(activity.action)} mr-4`}>
                            <FaHistory />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                              <h4 className="font-medium text-indigo-900">{activity.action}</h4>
                              <span className="text-xs text-indigo-500">
                                {new Date(activity.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-indigo-600 mb-2">{activity.details}</p>
                            <div className="flex items-center text-xs text-indigo-500">
                              <span>By:</span>
                              <span className="ml-1 font-medium">{activity.user_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {filteredActivities.length > itemsPerPage && (
                  <div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 border-t border-indigo-200">
                    <div className="text-sm text-indigo-700 mb-2 md:mb-0">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredActivities.length)} of {filteredActivities.length} activities
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-indigo-200 rounded disabled:opacity-50 hover:bg-indigo-50 transition"
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
                            className={`px-3 py-1 border rounded transition ${
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
                        className="px-3 py-1 border border-indigo-200 rounded disabled:opacity-50 hover:bg-indigo-50 transition"
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SLogs;