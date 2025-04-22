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
  FaExclamationTriangle,
  FaUserShield,
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaPlus,
  FaTimes
} from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'Viewer'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [pagination.current_page, pagination.per_page, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://127.0.0.1:8000/api/users', { 
        params: {
          page: pagination.current_page,
          per_page: pagination.per_page,
          search: searchTerm
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.data || []);
        setPagination({
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          from: (response.data.meta.current_page - 1) * response.data.meta.per_page + 1,
          to: Math.min(response.data.meta.current_page * response.data.meta.per_page, response.data.meta.total),
          total: response.data.meta.total,
          per_page: response.data.meta.per_page
        });
      } else {
        throw new Error(response.data.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.error || error.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
        if (response.data.success) {
          fetchUsers();
        } else {
          throw new Error(response.data.error || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setError(error.response?.data?.error || error.message || 'Failed to delete user');
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentUserId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'Viewer'
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role: user.role
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      // Only include password if it's not empty
      if (formData.password) {
        payload.password = formData.password;
        payload.password_confirmation = formData.password_confirmation;
      }

      if (isEditing) {
        response = await axios.put(`http://127.0.0.1:8000/api/users/${currentUserId}`, payload);
      } else {
        response = await axios.post('http://127.0.0.1:8000/api/users', formData);
      }

      if (response.data.success) {
        setShowModal(false);
        fetchUsers();
      } else {
        throw new Error(response.data.error || isEditing ? 'Failed to update user' : 'Failed to add user');
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setFormErrors(error.response.data.errors);
      } else {
        setError(error.response?.data?.error || error.message || (isEditing ? 'Failed to update user' : 'Failed to add user'));
      }
    }
  };

  const UserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">{isEditing ? 'Edit User' : 'Add New User'}</h3>
          <button 
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({...prev, name: e.target.value}));
                setFormErrors(prev => ({...prev, name: undefined}));
              }}
              className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : ''}`}
              required
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({...prev, email: e.target.value}));
                setFormErrors(prev => ({...prev, email: undefined}));
              }}
              className={`w-full p-2 border rounded ${formErrors.email ? 'border-red-500' : ''}`}
              required
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                setFormData(prev => ({...prev, password: e.target.value}));
                setFormErrors(prev => ({...prev, password: undefined}));
              }}
              className={`w-full p-2 border rounded ${formErrors.password ? 'border-red-500' : ''}`}
              placeholder={isEditing ? "Leave blank to keep current password" : ""}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password[0]}</p>
            )}
          </div>
          {formData.password && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={(e) => {
                  setFormData(prev => ({...prev, password_confirmation: e.target.value}));
                  setFormErrors(prev => ({...prev, password_confirmation: undefined}));
                }}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) => {
                setFormData(prev => ({...prev, role: e.target.value}));
                setFormErrors(prev => ({...prev, role: undefined}));
              }}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Stock Keeper">Stock Keeper</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar - Dark Theme */}
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
                <Link to="/users" className="flex items-center p-3 rounded-lg bg-blue-700 text-white">
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

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto min-h-screen">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <p className="text-gray-600">Manage all system users and their permissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={openAddModal}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaPlus className="mr-2" /> Add User
              </button>
            </div>
          </div>

          {/* Search and Filter */}
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
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name, email or role..."
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={pagination.per_page}
                  onChange={handlePerPageChange}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'Stock Keeper' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(user)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.total > 0 && (
                <div className="flex items-center justify-between bg-white px-6 py-3 rounded-lg shadow">
                  <div className="text-sm text-gray-700">
                    Showing {pagination.from} to {pagination.to} of {pagination.total} users
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
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
                          className={`px-3 py-1 border rounded ${pagination.current_page === pageNum ? 'bg-blue-600 text-white' : 'bg-white'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* User Modal */}
      {showModal && <UserModal />}
    </div>
  );
};

export default Users;