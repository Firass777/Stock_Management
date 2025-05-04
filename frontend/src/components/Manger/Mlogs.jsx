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
  FaFilter,
  FaSearch,
  FaChevronRight
} from "react-icons/fa";

function MLogs() {
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
              <Link to="/managerdb" className="flex items-center p-3 rounded-lg hover:bg-emerald-800">
                <FaBoxes className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/inventory" className="flex items-center p-3 rounded-lg hover:bg-emerald-800">
                <FaClipboardList className="mr-3" />
                Inventory
              </Link>
            </li>
            <li>
              <Link to="/reports" className="flex items-center p-3 rounded-lg hover:bg-emerald-800">
                <FaChartLine className="mr-3" />
                Reports
              </Link>
            </li>
            <li>
              <Link to="/alerts" className="flex items-center p-3 rounded-lg hover:bg-emerald-800">
                <FaBell className="mr-3" />
                Alerts
              </Link>
            </li>
            <li>
              <Link to="/logs" className="flex items-center p-3 rounded-lg bg-emerald-700 text-white">
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

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-emerald-900">Activity Logs</h1>
                <p className="text-emerald-600">Track all system activities and changes</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search activities..."
                    className="pl-10 pr-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div 
              onClick={() => handleFilterChange("all")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "all" ? "bg-emerald-600 text-white" : "bg-white border border-emerald-100"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">All Activities</h3>
                <span className="text-2xl font-bold">{activities.length}</span>
              </div>
              <p className="text-sm opacity-80 mt-1">Total actions</p>
            </div>
            <div 
              onClick={() => handleFilterChange("created")}
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "created" ? "bg-green-600 text-white" : "bg-white border border-emerald-100"}`}
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
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "updated" ? "bg-blue-600 text-white" : "bg-white border border-emerald-100"}`}
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
              className={`p-4 rounded-xl cursor-pointer transition ${filter === "deleted" ? "bg-red-600 text-white" : "bg-white border border-emerald-100"}`}
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
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="p-4 border-b border-emerald-200 flex items-center justify-between">
              <h3 className="font-semibold text-lg text-emerald-900 flex items-center">
                <FaFilter className="mr-2 text-emerald-600" />
                Recent Activities
              </h3>
              <button 
                onClick={fetchActivityLogs}
                className="text-sm bg-emerald-100 text-emerald-600 px-3 py-1 rounded-md hover:bg-emerald-200 transition flex items-center"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-emerald-600"></div>
              </div>
            ) : (
              <div className="divide-y divide-emerald-200">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12 text-emerald-500">
                    No activities found matching your criteria
                  </div>
                ) : (
                  filteredActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-emerald-50 transition"
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg ${getActionColor(activity.action)} mr-4`}>
                          <FaHistory className="text-current" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                            <h4 className="font-medium text-emerald-900">{activity.action}</h4>
                            <span className="text-xs text-emerald-500">
                              {new Date(activity.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-emerald-600 mb-2">{activity.details}</p>
                          <div className="flex items-center text-xs text-emerald-500">
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

export default MLogs;