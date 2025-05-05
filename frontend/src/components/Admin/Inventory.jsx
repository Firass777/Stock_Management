import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaBoxes, 
  FaClipboardList, 
  FaChartLine, 
  FaUsersCog, 
  FaBell, 
  FaHistory,
  FaSignOutAlt,
  FaWarehouse,
  FaSearch, 
  FaPlus,
  FaTimes,
  FaEdit, 
  FaTrash,
  FaFilter,
  FaSlidersH,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBoxOpen
} from 'react-icons/fa';

const Inventory = () => {
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
  const [showItemModal, setShowItemModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [currentLevelId, setCurrentLevelId] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit_price: ''
  });
  const [levelFormData, setLevelFormData] = useState({
    category: '',
    min_stock_level: '',
    max_stock_level: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
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

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/inventory/${id}`);
        if (response.data.success) {
          fetchItems();
        } else {
          throw new Error(response.data.error || 'Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        setError(error.response?.data?.error || error.message || 'Failed to delete item');
      }
    }
  };

  const handleDeleteLevel = async (id) => {
    if (window.confirm('Are you sure you want to delete this category level?')) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/category-levels/${id}`);
        if (response.data.success) {
          fetchCategoryLevels();
          fetchCategories();
        } else {
          throw new Error(response.data.error || 'Failed to delete category level');
        }
      } catch (error) {
        console.error('Error deleting category level:', error);
        setError(error.response?.data?.error || error.message || 'Failed to delete category level');
      }
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

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLevelInputChange = (e) => {
    const { name, value } = e.target;
    setLevelFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddItemModal = () => {
    setIsEditing(false);
    setCurrentItemId(null);
    setItemFormData({
      name: '',
      category: '',
      quantity: '',
      unit_price: ''
    });
    setFormErrors({});
    setShowItemModal(true);
  };

  const openEditItemModal = (item) => {
    setIsEditing(true);
    setCurrentItemId(item.id);
    setItemFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit_price: item.unit_price
    });
    setFormErrors({});
    setShowItemModal(true);
  };

  const openAddLevelModal = () => {
    setIsEditing(false);
    setCurrentLevelId(null);
    setLevelFormData({
      category: '',
      min_stock_level: '',
      max_stock_level: ''
    });
    setFormErrors({});
    setShowLevelModal(true);
  };

  const openEditLevelModal = (level) => {
    setIsEditing(true);
    setCurrentLevelId(level.id);
    setLevelFormData({
      category: level.category,
      min_stock_level: level.min_stock_level,
      max_stock_level: level.max_stock_level
    });
    setFormErrors({});
    setShowLevelModal(true);
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        name: itemFormData.name,
        category: itemFormData.category,
        quantity: Number(itemFormData.quantity),
        unit_price: Number(itemFormData.unit_price)
      };

      if (isEditing) {
        response = await axios.put(`http://127.0.0.1:8000/api/inventory/${currentItemId}`, payload);
      } else {
        response = await axios.post('http://127.0.0.1:8000/api/inventory', payload);
      }

      if (response.data.success) {
        setShowItemModal(false);
        fetchItems();
      } else {
        throw new Error(response.data.error || isEditing ? 'Failed to update item' : 'Failed to add item');
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setFormErrors(error.response.data.errors);
      } else {
        setError(error.response?.data?.error || error.message || (isEditing ? 'Failed to update item' : 'Failed to add item'));
      }
    }
  };

  const handleLevelSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        category: levelFormData.category,
        min_stock_level: Number(levelFormData.min_stock_level),
        max_stock_level: Number(levelFormData.max_stock_level)
      };

      if (isEditing) {
        response = await axios.put(`http://127.0.0.1:8000/api/category-levels/${currentLevelId}`, payload);
      } else {
        response = await axios.post('http://127.0.0.1:8000/api/category-levels', payload);
      }

      if (response.data.success) {
        setShowLevelModal(false);
        fetchCategoryLevels();
        fetchCategories();
      } else {
        throw new Error(response.data.error || isEditing ? 'Failed to update level' : 'Failed to add level');
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setFormErrors(error.response.data.errors);
      } else {
        setError(error.response?.data?.error || error.message || (isEditing ? 'Failed to update level' : 'Failed to add level'));
      }
    }
  };

  // Determine stock status for an item - UPDATED TO CALCULATE TOTAL CATEGORY QUANTITY
  const getStockStatus = (item) => {
    const level = categoryLevels.find(l => l.category === item.category);
    if (!level) return { status: 'Unknown', class: 'bg-gray-100 text-gray-800', icon: <FaBoxOpen className="inline mr-1" /> };
    
    // Calculate total quantity for this category
    const totalCategoryQuantity = items
      .filter(i => i.category === item.category)
      .reduce((sum, i) => sum + i.quantity, 0);

    if (totalCategoryQuantity <= level.min_stock_level) {
      return { status: 'Low Stock', class: 'bg-red-100 text-red-800', icon: <FaExclamationTriangle className="inline mr-1" /> };
    } else if (totalCategoryQuantity >= level.max_stock_level) {
      return { status: 'Overstocked', class: 'bg-purple-100 text-purple-800', icon: <FaExclamationTriangle className="inline mr-1" /> };
    } else if (totalCategoryQuantity <= level.min_stock_level * 1.5) {
      return { status: 'Warning', class: 'bg-yellow-100 text-yellow-800', icon: <FaExclamationTriangle className="inline mr-1" /> };
    } else {
      return { status: 'In Stock', class: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="inline mr-1" /> };
    }
  };

  const ItemModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
          <button 
            onClick={() => setShowItemModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleItemSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              name="name"
              value={itemFormData.name}
              onChange={handleItemInputChange}
              className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
              required
              placeholder="Enter item name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={itemFormData.category}
              onChange={handleItemInputChange}
              className={`w-full p-2 border rounded ${formErrors.category ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {formErrors.category && (
              <p className="text-red-500 text-xs mt-1">{formErrors.category[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={itemFormData.quantity}
              onChange={handleItemInputChange}
              className={`w-full p-2 border rounded ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'}`}
              required
              min="0"
              placeholder="Enter quantity"
            />
            {formErrors.quantity && (
              <p className="text-red-500 text-xs mt-1">{formErrors.quantity[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Unit Price ($)</label>
            <input
              type="number"
              name="unit_price"
              value={itemFormData.unit_price}
              onChange={handleItemInputChange}
              className={`w-full p-2 border rounded ${formErrors.unit_price ? 'border-red-500' : 'border-gray-300'}`}
              required
              min="0"
              step="0.01"
              placeholder="Enter unit price"
            />
            {formErrors.unit_price && (
              <p className="text-red-500 text-xs mt-1">{formErrors.unit_price[0]}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setShowItemModal(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {isEditing ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const LevelModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">{isEditing ? 'Edit Stock Levels' : 'Add New Stock Levels'}</h3>
          <button 
            onClick={() => setShowLevelModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleLevelSubmit} className="p-4">
          {!isEditing && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={levelFormData.category}
                onChange={handleLevelInputChange}
                className={`w-full p-2 border rounded ${formErrors.category ? 'border-red-500' : 'border-gray-300'}`}
                required
                placeholder="Enter category name"
              />
              {formErrors.category && (
                <p className="text-red-500 text-xs mt-1">{formErrors.category[0]}</p>
              )}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Minimum Stock Level</label>
            <input
              type="number"
              name="min_stock_level"
              value={levelFormData.min_stock_level}
              onChange={handleLevelInputChange}
              className={`w-full p-2 border rounded ${formErrors.min_stock_level ? 'border-red-500' : 'border-gray-300'}`}
              required
              min="0"
              placeholder="Enter minimum level"
            />
            {formErrors.min_stock_level && (
              <p className="text-red-500 text-xs mt-1">{formErrors.min_stock_level[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Maximum Stock Level</label>
            <input
              type="number"
              name="max_stock_level"
              value={levelFormData.max_stock_level}
              onChange={handleLevelInputChange}
              className={`w-full p-2 border rounded ${formErrors.max_stock_level ? 'border-red-500' : 'border-gray-300'}`}
              required
              min="0"
              placeholder="Enter maximum level"
            />
            {formErrors.max_stock_level && (
              <p className="text-red-500 text-xs mt-1">{formErrors.max_stock_level[0]}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setShowLevelModal(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {isEditing ? 'Update Levels' : 'Add Levels'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

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
                <Link to="/admindb" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                  <FaBoxes className="mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="flex items-center p-3 rounded-lg bg-blue-700 text-white">
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
                <Link to="/logs" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                  <FaHistory className="mr-3" />
                  Activity Logs
                </Link>
              </li>
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
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
              <p className="text-gray-600">Manage stock items and track inventory levels</p>
            </div>
            <div className="flex items-center space-x-4">
              {activeTab === 'inventory' ? (
                <button
                  onClick={openAddItemModal}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaPlus className="mr-2" /> Add Item
                </button>
              ) : (
                <button
                  onClick={openAddLevelModal}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaPlus className="mr-2" /> Add Levels
                </button>
              )}
            </div>
          </div>

          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 font-medium ${activeTab === 'inventory' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} transition`}
            >
              Inventory Items
            </button>
            <button
              onClick={() => setActiveTab('levels')}
              className={`px-4 py-2 font-medium ${activeTab === 'levels' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} transition`}
            >
              <FaSlidersH className="inline mr-2" />
              Stock Levels
            </button>
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

          {activeTab === 'inventory' ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Search by item name or category..."
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaFilter className="text-gray-400" />
                      </div>
                      <select
                        value={categoryFilter}
                        onChange={handleCategoryFilter}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
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
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.length > 0 ? (
                          items.map((item) => {
                            const status = getStockStatus(item);
                            return (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${Number(item.unit_price).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${(item.quantity * item.unit_price).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${status.class}`}>
                                    {status.icon} {status.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <button
                                    onClick={() => openEditItemModal(item)}
                                    className="text-blue-600 hover:text-blue-900 mr-4 transition"
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="text-red-600 hover:text-red-900 transition"
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                              No items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {pagination.total > 0 && (
                    <div className="flex flex-col md:flex-row items-center justify-between bg-white px-6 py-3 rounded-lg shadow">
                      <div className="text-sm text-gray-700 mb-2 md:mb-0">
                        Showing {pagination.from} to {pagination.to} of {pagination.total} items
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handlePageChange(pagination.current_page - 1)}
                          disabled={pagination.current_page === 1}
                          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 transition"
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
                                  : 'border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(pagination.current_page + 1)}
                          disabled={pagination.current_page === pagination.last_page}
                          className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 transition"
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
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Stock Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoryLevels.length > 0 ? (
                        categoryLevels.map((level) => (
                          <tr key={level.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">{level.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{level.min_stock_level}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{level.max_stock_level}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => openEditLevelModal(level)}
                                className="text-blue-600 hover:text-blue-900 mr-4 transition"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteLevel(level.id)}
                                className="text-red-600 hover:text-red-900 transition"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
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
        </main>
      </div>

      {showItemModal && <ItemModal />}
      {showLevelModal && <LevelModal />}
    </div>
  );
};

export default Inventory;