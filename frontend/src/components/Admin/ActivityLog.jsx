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
  FaSearch
} from "react-icons/fa";

function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const [categoryResponse, inventoryResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/category-stock-levels/recent-logs'),
        axios.get('http://127.0.0.1:8000/api/inventory/recent-logs')
      ]);

      const allActivities = [
        ...(categoryResponse.data.success ? categoryResponse.data.data : []),
        ...(inventoryResponse.data.success ? inventoryResponse.data.data : []),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setActivities(allActivities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity logs:", error.response?.data || error.message);
      setActivities([]);
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
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Unchanged */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col fixed h-full">
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
              <Link to="/admindb" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                <FaBoxes className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/inventory" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                <FaClipboardList className="mr-3" />
                Inventory
              </Link>
            </li>
            <li>
              <Link to="/reports" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                <FaChartLine className="mr-3" />
                Reports
              </Link>
            </li>
            <li>
              <Link to="/users" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                <FaUsersCog className="mr-3" />
                User Management
              </Link>
            </li>
            <li>
              <Link to="/alerts" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                <FaBell className="mr-3" />
                Alerts
              </Link>
            </li>
            <li>
              <Link to="/logs" className="flex items-center p-3 rounded-lg bg-blue-700 text-white">
                <FaHistory className="mr-3" />
                Activity Logs
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link to="/logout" className="flex items-center p-3 rounded-lg hover:bg-gray-800 text-red-400 transition">
            <FaSignOutAlt className="mr-3" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content - Redesigned */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Activity Logs</h1>
                <p className="text-gray-600">Track all system activities and changes</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search activities..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm">
                  <FaUserShield className="text-blue-600" />
                  <span className="text-sm font-medium">Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => handleFilterChange("all")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "all" ? "bg-blue-600 text-white" : "bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">All Activities</h3>
                <span className="text-2xl font-bold">{activities.length}</span>
              </div>
              <p className="text-sm opacity-80 mt-1">Total actions</p>
            </div>
            <div 
              onClick={() => handleFilterChange("created")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "created" ? "bg-green-600 text-white" : "bg-white"}`}
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
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "updated" ? "bg-blue-600 text-white" : "bg-white"}`}
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
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "deleted" ? "bg-red-600 text-white" : "bg-white"}`}
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

          {/* Activity List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center">
                <FaFilter className="mr-2 text-blue-600" />
                Recent Activities
              </h3>
              <button 
                onClick={fetchActivityLogs}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-blue-600"></div>
              </div>
            ) : (
              <div className="divide-y">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No activities found matching your criteria
                  </div>
                ) : (
                  filteredActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-gray-50 transition"
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg ${getActionColor(activity.action)} mr-4`}>
                          <FaHistory className="text-current" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                            <h4 className="font-medium text-gray-800">{activity.action}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                          <div className="flex items-center text-xs text-gray-500">
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

export default ActivityLog;