import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaChartLine, 
  FaClipboardList, 
  FaSignOutAlt, 
  FaWarehouse, 
  FaUserShield, 
  FaDownload 
} from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

function Reports() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [reportType, setReportType] = useState("stock");
  const [dateRange, setDateRange] = useState("last30days");

  const stockReportData = {
    labels: ["Electronics", "Hardware", "Office", "Tools", "Safety"],
    datasets: [
      {
        label: "Current Stock",
        backgroundColor: "#3B82F6",
        borderColor: "#3B82F6",
        borderWidth: 1,
        hoverBackgroundColor: "#2563EB",
        hoverBorderColor: "#2563EB",
        data: [350, 250, 200, 150, 50],
      },
    ],
  };

  const movementReportData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Stock In",
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        fill: true,
        data: [500, 600, 400, 700, 800, 650],
      },
      {
        label: "Stock Out",
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        fill: true,
        data: [300, 400, 350, 500, 600, 550],
      },
    ],
  };

  const handleExport = () => {
    // Simulate export functionality
    alert("Exporting report as PDF...");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar - Blue Theme */}
        <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold flex items-center">
              <FaWarehouse className="mr-2" />
              StockMaster
            </h1>
            <p className="text-sm text-gray-400 mt-1">Reports</p>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-2">
              <li>
                <Link to="/admindb" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
                  <FaClipboardList className="mr-3" />
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
                  <FaClipboardList className="mr-3" />
                  User Management
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
                  <FaClipboardList className="mr-3" />
                  Alerts
                </Link>
              </li>
              <li>
                <Link to="/logs" className="flex items-center p-3 rounded-lg hover:bg-gray-800">
                  <FaClipboardList className="mr-3" />
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

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto min-h-screen">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
              <p className="text-gray-600">Generate and analyze inventory reports.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <FaUserShield />
                </div>
                <span className="font-medium">Admin</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="stock">Stock Levels</option>
                  <option value="movement">Stock Movement</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleExport}
                  className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FaDownload className="mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="grid grid-cols-1 gap-6">
            {/* Chart */}
            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">
                {reportType === "stock" ? "Stock Levels by Category" : "Stock Movement History"}
              </h3>
              <div className="h-96">
                {reportType === "stock" ? (
                  <Bar
                    data={stockReportData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                ) : (
                  <Line
                    data={movementReportData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            {/* Report Summary */}
            <div data-aos="fade-up" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Report Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Total Items</p>
                  <h4 className="text-xl font-bold mt-1">1,250</h4>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Categories</p>
                  <h4 className="text-xl font-bold mt-1">5</h4>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
                  <h4 className="text-xl font-bold mt-1 text-red-600">15</h4>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reports;