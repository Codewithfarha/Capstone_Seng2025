import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LibraryForm from './LibraryForm';
import LibraryTable from './LibraryTable';
import { useAuth } from '../../hooks/useAuth';
import { 
  Plus, 
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Search,
  RefreshCw
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [libraries, setLibraries] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingLibrary, setEditingLibrary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLibraries: 0,
    totalCategories: 0,
    totalDownloads: 0,
    avgRating: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchLibraries();
    }
  }, [user, navigate]);

  useEffect(() => {
    calculateStats();
  }, [libraries]);

  const fetchLibraries = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/libraries');
      const data = await response.json();
      setLibraries(data);
    } catch (error) {
      console.error('Error fetching libraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const categories = new Set(libraries.map(lib => lib.category));
    const totalDownloads = libraries.reduce((sum, lib) => {
      return sum + parseInt(lib.downloads?.replace(/\D/g, '') || 0);
    }, 0);
    const avgRating = libraries.reduce((sum, lib) => sum + (lib.rating || 0), 0) / libraries.length || 0;

    setStats({
      totalLibraries: libraries.length,
      totalCategories: categories.size,
      totalDownloads: formatNumber(totalDownloads),
      avgRating: avgRating.toFixed(1)
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    setEditingLibrary(null);
  };

  const handleEdit = (library) => {
    setEditingLibrary(library);
    setIsAddingNew(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this library?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/libraries/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchLibraries();
      }
    } catch (error) {
      console.error('Error deleting library:', error);
    }
  };

  const handleFormClose = () => {
    setIsAddingNew(false);
    setEditingLibrary(null);
  };

  const handleFormSuccess = () => {
    fetchLibraries();
    handleFormClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredLibraries = libraries.filter(lib =>
    lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lib.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lib.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} p-4 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-blue-100">Manage your library collection</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Total Libraries"
            value={stats.totalLibraries}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Categories"
            value={stats.totalCategories}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Downloads"
            value={stats.totalDownloads}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            icon={<Settings className="w-6 h-6" />}
            label="Avg Rating"
            value={stats.avgRating}
            color="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search libraries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={fetchLibraries}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Add Library</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {(isAddingNew || editingLibrary) && (
          <div className="mb-6">
            <LibraryForm
              library={editingLibrary}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}

        {/* Table Section */}
        <LibraryTable
          libraries={filteredLibraries}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AdminPanel;