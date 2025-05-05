import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaBoxes, 
  FaClipboardList, 
  FaUserShield,
  FaHistory,
  FaSignOutAlt,
  FaWarehouse,
  FaSearch, 
  FaFilter,
  FaSlidersH,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBoxOpen
} from 'react-icons/fa';
import AOS from "aos";
import "aos/dist/aos.css";

const SInventory = () => {
  const [items, setItems] = useState([]);
  const [categoryLevels, setCategoryLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({
    inventory: true,
    levels: true,
    categories: true
  });
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    AOS.init({ duration: 800 });
    const fetchData = async () => {
      try {
        await fetchCategories();
        if (activeTab === 'inventory') {
          await fetchItems();
        } else {
          await fetchCategoryLevels();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load data');
      }
    };
    
    fetchData();
  }, [pagination.current_page, pagination.per_page, searchTerm, categoryFilter, activeTab]);

  const fetchItems = async () => {
    try {
      setLoading(prev => ({ ...prev, inventory: true }));
      setError(null);
      
      const response = await axios.get('http://127.0.0.1:8000/api/inventory', { 
        params: {
          page: pagination.current_page,
          per_page: pagination.per_page,
          search: searchTerm,
          category: categoryFilter === ':1' ? '' : categoryFilter
        }
      });
      
      if (response.data.success) {
        setItems(response.data.data || []);
        setPagination({
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          from: (response.data.meta.current_page - 1) * response.data.meta.per_page + 1,
          to: Math.min(response.data.meta.current_page * response.data.meta.per_page, response.data.meta.total),
          total: response.data.meta.total,
          per_page: response.data.meta.per_page
        });
      } else {
        throw new Error(response.data.error || 'Failed to fetch inventory items');
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError(error.response?.data?.error || error.message || 'Failed to load inventory');
      setItems([]);
    } finally {
      setLoading(prev => ({ ...prev, inventory: false }));
    }
  };

  const fetchCategoryLevels = async () => {
    try {
      setLoading(prev => ({ ...prev, levels: true }));
      setError(null);
      
      const response = await axios.get('http://127.0.0.1:8000/api/category-levels');
      
      if (response.data.success) {
        setCategoryLevels(response.data.data || []);
      } else {
        throw new Error(response.data.error || 'Failed to fetch category levels');
      }
    } catch (error) {
      console.error('Error fetching category levels:', error);
      setError(error.response?.data?.error || error.message || 'Failed to load category levels');
      setCategoryLevels([]);
    } finally {
      setLoading(prev => ({ ...prev, levels: false }));
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      
      const response = await axios.get('http://127.0.0.1:8000/api/category-levels');
      if (response.data.success) {
        setCategories(response.data.data.map(level => level.category));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(['Electronics', 'Clothing', 'Food', 'Tools', 'Other']); 
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      current_page: page
    }));
  };

  const handlePerPageChange = (e) => {
    setPagination(prev => ({
      ...prev,
      per_page: Number(e.target.value),
      current_page: 1
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const getStockStatus = (item) => {
    const level = categoryLevels.find(l => l.category === item.category);
    if (!level) return { status: 'Unknown', class: 'bg-blue-100 text-blue-800', icon: <FaBoxOpen className="inline mr-1" /> };
    
    const totalCategoryQuantity = items
      .filter(i => i.category === item.category)
      .reduce((sum, i) => sum + i.quantity, 0);

    if (totalCategoryQuantity <= level.min_stock_level) {
      return { status: 'Low Stock', class: 'bg-red-100 text-red-800', icon: <FaExclamationTriangle className="inline mr-1" /> };
    } else if (totalCategoryQuantity >= level.max_stock_level) {
      return { status: 'Overstocked', class: 'bg-blue-100 text-blue-800', icon: <FaExclamationTriangle className="inline mr-1" /> };
    } else if (totalCategoryQuantity <= level.min_stock_level * 1.5) {
      return { status: 'Warning', class: 'bg-yellow-100 text-yellow-800', icon: <FaExclamationTriangle className="inline mr-1" /> };
    } else {
      return { status: 'In Stock', class: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="inline mr-1" /> };
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

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
              <Link to="/vinventory" className="flex items-center p-3 rounded-lg bg-blue-700 text-white">
                <FaClipboardList className="mr-3" />
                Inventory
              </Link>
            </li>
            <li>
              <Link to="/vlogs" className="flex items-center p-3 rounded-lg hover:bg-blue-800">
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
              <h2 className="text-3xl font-bold text-blue-900">Inventory Management</h2>
              <p className="text-blue-600 mt-1">View stock items and track inventory levels</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <FaUserShield />
                </div>
                <span className="font-medium text-blue-900">Viewer</span>
              </div>
            </div>
          </div>

          <div className="flex border-b border-blue-200 mb-6">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 font-medium ${activeTab === 'inventory' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-blue-500 hover:text-blue-700'} transition`}
            >
              Inventory Items
            </button>
            <button
              onClick={() => setActiveTab('levels')}
              className={`px-4 py-2 font-medium ${activeTab === 'levels' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-blue-500 hover:text-blue-700'} transition`}
            >
              <FaSlidersH className="inline mr-2" />
              Stock Levels
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

          {activeTab === 'inventory' ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-blue-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 pr-4 py-2 w-full border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Search by item name or category..."
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaFilter className="text-blue-400" />
                      </div>
                      <select
                        value={categoryFilter}
                        onChange={handleCategoryFilter}
                        className="pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <select
                      value={pagination.per_page}
                      onChange={handlePerPageChange}
                      className="border border-blue-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                </div>
              </div>

              {loading.inventory ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden mb-6">
                    <table className="min-w-full divide-y divide-blue-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Item Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Unit Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Total Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-blue-200">
                        {items.length > 0 ? (
                          items.map((item) => {
                            const status = getStockStatus(item);
                            return (
                              <tr key={item.id} className="hover:bg-blue-50">
                                <td className="px-6 py-4 whitespace-nowrap text-blue-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-blue-900">{item.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-blue-900">{item.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-blue-900">${Number(item.unit_price).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-blue-900">${(item.quantity * item.unit_price).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${status.class}`}>
                                    {status.icon} {status.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-blue-500">
                              No items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {pagination.total > 0 && (
                    <div className="flex flex-col md:flex-row items-center justify-between bg-white px-6 py-3 rounded-lg shadow-sm border border-blue-100">
                      <div className="text-sm text-blue-700 mb-2 md:mb-0">
                        Showing {pagination.from} to {pagination.to} of {pagination.total} items
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handlePageChange(pagination.current_page - 1)}
                          disabled={pagination.current_page === 1}
                          className="px-3 py-1 border border-blue-300 rounded disabled:opacity-50 hover:bg-blue-100 transition"
                        >
                          Previous
                        </button>
                        {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                          let pageNum;
                          if (pagination.last_page <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.current_page <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.current_page >= pagination.last_page - 2) {
                            pageNum = pagination.last_page - 4 + i;
                          } else {
                            pageNum = pagination.current_page - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1 border rounded transition ${
                                pagination.current_page === pageNum 
                                  ? 'bg-blue-600 text-white border-blue-600' 
                                  : 'border-blue-300 hover:bg-blue-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(pagination.current_page + 1)}
                          disabled={pagination.current_page === pagination.last_page}
                          className="px-3 py-1 border border-blue-300 rounded disabled:opacity-50 hover:bg-blue-100 transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {loading.levels ? (
                <LoadingSpinner />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-blue-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Min Stock Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Max Stock Level</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-200">
                      {categoryLevels.length > 0 ? (
                        categoryLevels.map((level) => (
                          <tr key={level.id} className="hover:bg-blue-50">
                            <td className="px-6 py-4 whitespace-nowrap text-blue-900">{level.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-blue-900">{level.min_stock_level}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-blue-900">{level.max_stock_level}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-blue-500">
                            No stock levels found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SInventory;