
import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy, updateDoc, doc, getDoc } from 'firebase/firestore';
import { 
  Users,
  MessageSquare,
  RefreshCw,
  Mail,
  Calendar,
  Edit,
  X,
  Check,
  Star,
  Download,
  Globe,
  GitBranch,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  // State
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersList, setUsersList] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [feedbackFilter, setFeedbackFilter] = useState('all'); // all, solved, unsolved
  
  // Loading states
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  // Edit library state
  const [editingLibrary, setEditingLibrary] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [libraryDetails, setLibraryDetails] = useState({});
  const [loadingLibrary, setLoadingLibrary] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    // Auto-load library details for all feedbacks
    if (feedbacks.length > 0) {
      feedbacks.forEach(feedback => {
        if (feedback.libraryId && !libraryDetails[feedback.libraryId]) {
          fetchLibraryDetails(feedback.libraryId);
        }
      });
    }
  }, [feedbacks]);

  const fetchAllData = async () => {
    await Promise.all([
      fetchUsers(),
      fetchFeedbacks()
    ]);
  };

  /**
   * Fetch users from Firestore
   */
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      console.log('👥 Fetching users from Firestore...');
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const users = [];
      snapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setUsersList(users);
      setTotalUsers(snapshot.size);
      console.log(`Loaded ${snapshot.size} users`);
    } catch (err) {
      console.error(' Error fetching users:', err);
      setTotalUsers(0);
      setUsersList([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  /**
   * Fetch feedbacks from Firestore
   */
  const fetchFeedbacks = async () => {
    setLoadingFeedbacks(true);
    try {
      console.log('💬 Fetching feedbacks from Firestore...');
      const feedbacksRef = collection(db, 'feedback');
      const q = query(feedbacksRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const feedbackList = [];
      snapshot.forEach((doc) => {
        feedbackList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setFeedbacks(feedbackList);
      console.log(`✅ Loaded ${feedbackList.length} feedbacks`);
    } catch (err) {
      console.error('❌ Error fetching feedbacks:', err);
      setFeedbacks([]);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  /**
   * Fetch library details
   */
  const fetchLibraryDetails = async (libraryId) => {
    if (libraryDetails[libraryId] || loadingLibrary[libraryId]) return;

    setLoadingLibrary(prev => ({ ...prev, [libraryId]: true }));

    try {
      const libraryRef = doc(db, 'libraries', libraryId);
      const libraryDoc = await getDoc(libraryRef);
      
      if (libraryDoc.exists()) {
        const data = { id: libraryDoc.id, ...libraryDoc.data() };
        setLibraryDetails(prev => ({ ...prev, [libraryId]: data }));
      }
    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      setLoadingLibrary(prev => ({ ...prev, [libraryId]: false }));
    }
  };

  /**
   * Toggle feedback solved status
   */
  const handleToggleSolved = async (feedbackId, currentStatus) => {
    try {
      const feedbackRef = doc(db, 'feedback', feedbackId);
      const newStatus = !currentStatus;
      
      await updateDoc(feedbackRef, {
        solved: newStatus,
        solvedAt: newStatus ? new Date() : null
      });
      
      console.log(`Feedback marked as ${newStatus ? 'solved' : 'unsolved'}`);
      
      // Update local state
      setFeedbacks(prev => prev.map(f => 
        f.id === feedbackId 
          ? { ...f, solved: newStatus, solvedAt: newStatus ? new Date() : null }
          : f
      ));
    } catch (error) {
      console.error(' Error updating feedback status:', error);
      alert('Failed to update feedback status');
    }
  };

  /**
   * Start editing a library
   */
  const handleEditLibrary = (library) => {
    setEditingLibrary(library.id);
    setEditForm({ ...library });
  };

  /**
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingLibrary(null);
    setEditForm({});
  };

  /**
   * Save library changes
   */
  const handleSaveLibrary = async () => {
    if (!editingLibrary) return;

    try {
      const libraryRef = doc(db, 'libraries', editingLibrary);
      const updateData = {
        name: editForm.name,
        description: editForm.description,
        category: editForm.category,
        version: editForm.version,
        homepage: editForm.homepage,
        repository: editForm.repository,
        stars: parseInt(editForm.stars) || 0,
        downloads: parseInt(editForm.downloads) || 0,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(libraryRef, updateData);
      console.log(' Library updated');
      
      // Update cache
      setLibraryDetails(prev => ({
        ...prev,
        [editingLibrary]: { ...prev[editingLibrary], ...updateData }
      }));
      
      setEditingLibrary(null);
      setEditForm({});
      alert('Library updated successfully!');
    } catch (error) {
      console.error(' Error updating library:', error);
      alert('Failed to update library');
    }
  };

  /**
   * Update edit form field
   */
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return new Date(timestamp).toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  // Filter feedbacks based on solved status
  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (feedbackFilter === 'solved') return feedback.solved === true;
    if (feedbackFilter === 'unsolved') return !feedback.solved;
    return true;
  });

  // Calculate feedback stats
  const solvedCount = feedbacks.filter(f => f.solved === true).length;
  const unsolvedCount = feedbacks.filter(f => !f.solved).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-2 border-orange-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-3 rounded-xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 font-medium">Manage Users & Feedbacks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Users"
            value={totalUsers}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<MessageSquare className="w-6 h-6" />}
            label="Total Feedbacks"
            value={feedbacks.length}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="Solved"
            value={solvedCount}
            gradient="from-green-500 to-green-600"
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6" />}
            label="Pending"
            value={unsolvedCount}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 mb-6">
          <div className="flex border-b-2 border-orange-100">
            <TabButton
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
              icon={<Users className="w-5 h-5" />}
              label="Users"
              count={totalUsers}
            />
            <TabButton
              active={activeTab === 'feedbacks'}
              onClick={() => setActiveTab('feedbacks')}
              icon={<MessageSquare className="w-5 h-5" />}
              label="Feedbacks"
              count={feedbacks.length}
            />
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Refresh Button */}
            <div className="mb-6 flex justify-between items-center">
              <div className="flex gap-2">
                {activeTab === 'feedbacks' && (
                  <>
                    <button
                      onClick={() => setFeedbackFilter('all')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        feedbackFilter === 'all'
                          ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All ({feedbacks.length})
                    </button>
                    <button
                      onClick={() => setFeedbackFilter('unsolved')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        feedbackFilter === 'unsolved'
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Pending ({unsolvedCount})
                    </button>
                    <button
                      onClick={() => setFeedbackFilter('solved')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        feedbackFilter === 'solved'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Solved ({solvedCount})
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={fetchAllData}
                disabled={loadingUsers || loadingFeedbacks}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${(loadingUsers || loadingFeedbacks) ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
            </div>

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div>
                {loadingUsers ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading users...</p>
                  </div>
                ) : usersList.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Users Yet</h3>
                    <p className="text-gray-600">Users will appear here when they register</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {usersList.map((user) => (
                      <div 
                        key={user.id} 
                        className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-orange-300 transition-all hover:shadow-lg"
                      >
                        <div className="flex items-start gap-4 mb-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {(user.displayName || user.name)?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-gray-900 mb-1 truncate">
                              {user.displayName || user.name || 'No Name'}
                            </h4>
                            
                            {user.role && (
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === 'admin' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{user.email || 'No email'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FEEDBACKS TAB */}
            {activeTab === 'feedbacks' && (
              <div>
                {loadingFeedbacks ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading feedbacks...</p>
                  </div>
                ) : filteredFeedbacks.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feedbackFilter === 'solved' ? 'No Solved Feedbacks' : 
                       feedbackFilter === 'unsolved' ? 'No Pending Feedbacks' : 
                       'No Feedbacks Yet'}
                    </h3>
                    <p className="text-gray-600">
                      {feedbackFilter === 'all' ? 'User feedbacks will appear here' : 
                       `No ${feedbackFilter} feedbacks at the moment`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredFeedbacks.map((feedback) => {
                      const library = libraryDetails[feedback.libraryId];
                      const isSolved = feedback.solved === true;
                      
                      return (
                        <div 
                          key={feedback.id} 
                          className={`bg-white border-2 rounded-xl p-5 transition-all hover:shadow-lg ${
                            isSolved 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-base mb-1">
                                {feedback.userName || 'Anonymous User'}
                              </h4>
                              <p className="text-sm text-gray-600 truncate">{feedback.userEmail || 'No email'}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                              <span className="text-xs text-gray-500">
                                {formatDate(feedback.createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-800 mb-3 text-sm leading-relaxed">
                            {feedback.message}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {feedback.type && (
                              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                                {feedback.type}
                              </span>
                            )}
                            {feedback.libraryName && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                 {feedback.libraryName}
                              </span>
                            )}
                            {isSolved && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Solved
                              </span>
                            )}
                          </div>

                          {/* Mark as Solved Button */}
                          <div className="mb-4">
                            <button
                              onClick={() => handleToggleSolved(feedback.id, isSolved)}
                              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                                isSolved
                                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                              }`}
                            >
                              {isSolved ? (
                                <>
                                  <Circle className="w-5 h-5" />
                                  Mark as Unsolved
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  Mark as Solved
                                </>
                              )}
                            </button>
                          </div>

                          {/* Library Details */}
                          {library && (
                            <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                              {editingLibrary === library.id ? (
                                // EDIT MODE
                                <div className="space-y-3">
                                  <h5 className="font-bold text-sm text-gray-900 mb-3">Edit Library</h5>
                                  <div className="grid grid-cols-1 gap-3">
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                                      <input
                                        type="text"
                                        value={editForm.name || ''}
                                        onChange={(e) => handleEditFormChange('name', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                                        <input
                                          type="text"
                                          value={editForm.category || ''}
                                          onChange={(e) => handleEditFormChange('category', e.target.value)}
                                          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Version</label>
                                        <input
                                          type="text"
                                          value={editForm.version || ''}
                                          onChange={(e) => handleEditFormChange('version', e.target.value)}
                                          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                                      <textarea
                                        value={editForm.description || ''}
                                        onChange={(e) => handleEditFormChange('description', e.target.value)}
                                        rows="2"
                                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Homepage</label>
                                        <input
                                          type="url"
                                          value={editForm.homepage || ''}
                                          onChange={(e) => handleEditFormChange('homepage', e.target.value)}
                                          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Repository</label>
                                        <input
                                          type="url"
                                          value={editForm.repository || ''}
                                          onChange={(e) => handleEditFormChange('repository', e.target.value)}
                                          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 justify-end pt-2">
                                    <button
                                      onClick={handleCancelEdit}
                                      className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                      Cancel
                                    </button>
                                    <button
                                      onClick={handleSaveLibrary}
                                      className="flex items-center gap-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                      <Check className="w-4 h-4" />
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // VIEW MODE
                                <>
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <h5 className="text-base font-bold text-gray-900">{library.name}</h5>
                                        <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                                          {library.category}
                                        </span>
                                        <span className="px-2 py-1 bg-white text-gray-600 rounded text-xs font-mono border border-gray-300">
                                          v{library.version}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 mb-3 text-sm leading-relaxed">{library.description}</p>
                                      
                                      <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                                        {library.stars && (
                                          <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-600" />
                                            <span className="font-medium">{library.stars.toLocaleString()}</span>
                                          </div>
                                        )}
                                        {library.downloads && (
                                          <div className="flex items-center gap-1">
                                            <Download className="w-4 h-4 text-green-600" />
                                            <span className="font-medium">{library.downloads.toLocaleString()}</span>
                                          </div>
                                        )}
                                        {library.homepage && (
                                          <a 
                                            href={library.homepage} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-blue-700 hover:underline font-medium"
                                          >
                                            <Globe className="w-4 h-4" />
                                            <span>Homepage</span>
                                          </a>
                                        )}
                                        {library.repository && (
                                          <a 
                                            href={library.repository} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-blue-700 hover:underline font-medium"
                                          >
                                            <GitBranch className="w-4 h-4" />
                                            <span>Repo</span>
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-2 ml-4 flex-shrink-0">
                                      <button
                                        onClick={() => handleEditLibrary(library)}
                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                        title="Edit library"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, gradient }) => (
  <div className="bg-white rounded-xl shadow-md p-5 border-2 border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all">
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient} text-white mb-3 shadow-lg`}>
      {icon}
    </div>
    <p className="text-sm text-gray-600 mb-1 font-medium">{label}</p>
    <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
      {value}
    </p>
  </div>
);

const TabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
      active
        ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white border-b-4 border-orange-600'
        : 'text-gray-600 hover:bg-orange-50'
    }`}
  >
    {icon}
    <span>{label}</span>
    {count !== undefined && (
      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
        active ? 'bg-white text-orange-600' : 'bg-gray-200 text-gray-700'
      }`}>
        {count}
      </span>
    )}
  </button>
);

export default AdminDashboard;