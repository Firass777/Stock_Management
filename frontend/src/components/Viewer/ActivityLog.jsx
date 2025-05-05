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
  FaUserShield,
  FaFilter,
  FaSearch,
  FaRedo
} from "react-icons/fa";

function SLogs() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const [categoryResponse, inventoryResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/category-stock-levels/recent-logs'),
        axios.get('http://127.0.0.1:8000/api/inventory/recent-logs')
      ]);

      const allActivities = [
        ...(categoryResponse.data.success ? categoryResponse.data.data : []),
        ...(inventoryResponse.data.success ? inventoryResponse.data.data : []),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setActivities(allActivities);
    } catch (error) {
      console.error("Error fetching activity logs:", error.response?.data || error.message);
      setError(error.response?.data?.error || error.message || 'Failed to load activity logs');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === "all" || 
      activity.action.toLowerCase().includes(filter.toLowerCase());
    const matchesSearch = activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActionColor = (action) => {
    if (action.includes('created')) return 'bg-green-100 text-green-800';
    if (action.includes('updated')) return 'bg-blue-100 text-blue-800';
    if (action.includes('deleted')) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
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
              <Link to="/viewerdb" className="flex items-center p-3 rounded-lg hover:bg-blue-800">
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
              <Link to="/vlogs" className="flex items-center p-3 rounded-lg bg-blue-700 text-white">
                <FaHistory className="mr-3" />
                Activity Logs
              </Link>
            </li>
          </ul>
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
        </nav>
      </aside>

      <main className="flex-1 pl-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Activity Logs</h1>
              <p className="text-blue-600 mt-1">Track all system activities and changes</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-blue-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search activities..."
                  className="pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <FaUserShield />
                </div>
                <span className="font-medium text-blue-900">Viewer</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => handleFilterChange("all")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "all" ? "bg-blue-600 text-white" : "bg-white border border-blue-100"}`}
              data-aos="fade-up"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">All Activities</h3>
                <span className="text-2xl font-bold">{activities.length}</span>
              </div>
              <p className="text-sm opacity-80 mt-1">Total actions</p>
            </div>
            <div 
              onClick={() => handleFilterChange("created")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "created" ? "bg-green-600 text-white" : "bg-white border border-blue-100"}`}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Created</h3>
                <span className="text-2xl font-bold">
                  {activities.filter(a => a.action.toLowerCase().includes("created")).length}
                </span>
              </div>
              <p className="text-sm opacity-80 mt-1">New items</p>
            </div>
            <div 
              onClick={() => handleFilterChange("updated")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "updated" ? "bg-blue-600 text-white" : "bg-white border border-blue-100"}`}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Updated</h3>
                <span className="text-2xl font-bold">
                  {activities.filter(a => a.action.toLowerCase().includes("updated")).length}
                </span>
              </div>
              <p className="text-sm opacity-80 mt-1">Modified items</p>
            </div>
            <div 
              onClick={() => handleFilterChange("deleted")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "deleted" ? "bg-red-600 text-white" : "bg-white border border-blue-100"}`}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Deleted</h3>
                <span className="text-2xl font-bold">
                  {activities.filter(a => a.action.toLowerCase().includes("deleted")).length}
                </span>
              </div>
              <p className="text-sm opacity-80 mt-1">Removed items</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100">
            <div className="p-4 border-b border-blue-100 flex items-center justify-between">
              <h3 className="font-semibold text-lg text-blue-900 flex items-center">
                <FaFilter className="mr-2 text-blue-600" />
                Recent Activities
              </h3>
              <button 
                onClick={fetchActivityLogs}
                className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
              >
                <FaRedo className="mr-2" />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-blue-600"></div>
              </div>
            ) : (
              <div className="divide-y divide-blue-200">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12 text-blue-500">
                    No activities found matching your criteria
                  </div>
                ) : (
                  filteredActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-blue-50 transition"
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg ${getActionColor(activity.action)} mr-4`}>
                          <FaHistory className="text-current" />
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
                            <span>Performed by:</span>
                            <span className="ml-1 font-medium">{activity.user_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SLogs;