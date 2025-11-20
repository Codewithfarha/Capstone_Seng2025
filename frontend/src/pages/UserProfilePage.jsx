import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Heart, LogOut, Loader, Trash2, Package, Star, Download, Code, ExternalLink, GitCompare, CheckCircle, Circle } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import LibraryInfoModal from '../components/library/LibraryInfoModal';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  
  // Compare mode state
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  
  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      loadFavorites();
    }
  }, [user]);

  const loadUserData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (!userData.email) {
        navigate('/login');
        return;
      }
      console.log('User data:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
      setError('Failed to load user data');
    }
  };

  const loadFavorites = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const favoritesRef = collection(db, 'favorites');
      const q = query(favoritesRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      const favoritesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by createdAt on client side
      favoritesData.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error loading favorites:', error);
      if (error.message.includes('index')) {
        setError('Setting up database... Please refresh the page in a moment.');
      } else {
        setError(`Failed to load favorites: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    if (!window.confirm('Are you sure you want to remove this from your favorites?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      // Remove from compare selection if it was selected
      setSelectedForCompare(prev => prev.filter(id => id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite. Please try again.');
    }
  };

  const handleViewLibrary = async (favorite) => {
    // Don't open modal if in compare mode
    if (compareMode) return;
    
    setLoadingLibrary(true);
    
    try {
      const libraryRef = doc(db, 'libraries', favorite.libraryId);
      const librarySnap = await getDoc(libraryRef);
      
      if (librarySnap.exists()) {
        setSelectedLibrary({
          id: librarySnap.id,
          ...librarySnap.data()
        });
      } else {
        setSelectedLibrary({
          id: favorite.libraryId,
          name: favorite.libraryName,
          description: favorite.libraryDescription,
          rating: favorite.libraryRating,
          category: favorite.libraryCategory,
          source: favorite.librarySource,
          stars: favorite.libraryStars,
          downloads: favorite.libraryDownloads,
          version: favorite.libraryVersion,
          platforms: favorite.libraryPlatforms,
          license: favorite.libraryLicense,
          cost: favorite.libraryCost,
          homepage: favorite.libraryHomepage,
          repository: favorite.libraryRepository,
          documentation: favorite.libraryDocumentation,
          tags: favorite.libraryTags,
          codeExample: favorite.libraryCodeExample,
          npmPage: favorite.libraryNpmPage
        });
      }
      
      setShowModal(true);
    } catch (error) {
      console.error('Error loading library details:', error);
      setSelectedLibrary({
        id: favorite.libraryId,
        name: favorite.libraryName,
        description: favorite.libraryDescription,
        rating: favorite.libraryRating,
        category: favorite.libraryCategory,
        source: favorite.librarySource,
        stars: favorite.libraryStars,
        downloads: favorite.libraryDownloads,
        version: favorite.libraryVersion,
        platforms: favorite.libraryPlatforms,
        license: favorite.libraryLicense,
        cost: favorite.libraryCost,
        homepage: favorite.libraryHomepage,
        repository: favorite.libraryRepository,
        documentation: favorite.libraryDocumentation,
        tags: favorite.libraryTags,
        codeExample: favorite.libraryCodeExample,
        npmPage: favorite.libraryNpmPage
      });
      setShowModal(true);
    } finally {
      setLoadingLibrary(false);
    }
  };

  // Toggle compare mode
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setSelectedForCompare([]);
  };

  // Toggle library selection for comparison
  const toggleLibrarySelection = (favorite) => {
    const libraryId = favorite.libraryId;
    
    if (selectedForCompare.includes(libraryId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== libraryId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare up to 4 libraries at once');
        return;
      }
      setSelectedForCompare(prev => [...prev, libraryId]);
    }
  };

  // Navigate to compare page
  const handleCompareSelected = () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 libraries to compare');
      return;
    }
    
    // Get the selected library objects
    const selectedLibraries = favorites
      .filter(fav => selectedForCompare.includes(fav.libraryId))
      .map(fav => ({
        id: fav.libraryId,
        name: fav.libraryName,
        description: fav.libraryDescription,
        rating: fav.libraryRating,
        category: fav.libraryCategory,
        source: fav.librarySource,
        stars: fav.libraryStars,
        downloads: fav.libraryDownloads,
        version: fav.libraryVersion,
        platforms: fav.libraryPlatforms,
        license: fav.libraryLicense,
        cost: fav.libraryCost,
        homepage: fav.libraryHomepage,
        repository: fav.libraryRepository,
        documentation: fav.libraryDocumentation,
        tags: fav.libraryTags,
        codeExample: fav.libraryCodeExample,
        npmPage: fav.libraryNpmPage
      }));
    
    console.log('🔍 Comparing libraries:', selectedLibraries.map(l => l.name));
    
    // Store in sessionStorage so ComparePage can find them
    sessionStorage.setItem('compareLibraries', JSON.stringify(selectedLibraries));
    
    const compareIds = selectedForCompare.join(',');
    console.log('📍 Navigating to:', `/compare?libs=${compareIds}`);
    navigate(`/compare?libs=${compareIds}`);
  };

  const getFirstLetter = (name) => {
    if (!name) return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      if (dateString.seconds) {
        return new Date(dateString.seconds * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (typeof num === 'string') return num;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-rose-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed to load, showing initial');
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="text-5xl font-bold text-white select-none">${getFirstLetter(user.name || user.email)}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-5xl font-bold text-white select-none">
                    {getFirstLetter(user.name || user.email)}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-orange-200">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.name || 'User'}
              </h1>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600 justify-center md:justify-start">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">{user.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 justify-center md:justify-start">
                  <Calendar className="w-5 h-5 text-rose-500" />
                  <span className="font-medium">
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-4 py-1.5 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700 rounded-full text-sm font-semibold border border-rose-200">
                  {favorites.length} Favorites
                </span>
                {user.role === 'admin' && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-200">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6 mb-8">
            <p className="text-red-700 font-medium mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}

        {/* Favorites Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
                My Favorite Libraries
              </h2>
              <span className="px-4 py-2 bg-gradient-to-r from-rose-50 to-orange-50 text-rose-700 rounded-lg font-semibold border border-rose-200">
                {favorites.length} Total
              </span>
            </div>

            {/* Compare Mode Toggle */}
            {favorites.length >= 2 && (
              <div className="flex gap-3">
                <button
                  onClick={toggleCompareMode}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
                    compareMode
                      ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <GitCompare className="w-5 h-5" />
                  {compareMode ? 'Cancel Compare' : 'Compare Mode'}
                </button>

                {compareMode && selectedForCompare.length >= 2 && (
                  <button
                    onClick={handleCompareSelected}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all animate-pulse"
                  >
                    <GitCompare className="w-5 h-5" />
                    Compare {selectedForCompare.length} Libraries
                  </button>
                )}
              </div>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
              <p className="text-gray-600 mb-6">
                Start exploring and save your favorite libraries!
              </p>
              <button
                onClick={() => navigate('/search')}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Browse Libraries
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => {
                const isSelected = selectedForCompare.includes(favorite.libraryId);
                
                return (
                  <div
                    key={favorite.id}
                    className={`bg-gradient-to-br from-white to-orange-50 rounded-xl p-6 border-2 transition-all group cursor-pointer relative ${
                      compareMode
                        ? isSelected
                          ? 'border-orange-500 shadow-xl ring-4 ring-orange-200'
                          : 'border-orange-200 hover:border-orange-400'
                        : 'border-orange-200 hover:shadow-xl'
                    }`}
                    onClick={() => {
                      if (compareMode) {
                        toggleLibrarySelection(favorite);
                      } else {
                        handleViewLibrary(favorite);
                      }
                    }}
                  >
                    {/* Compare Mode Selection Indicator */}
                    {compareMode && (
                      <div className="absolute top-3 right-3 z-10">
                        {isSelected ? (
                          <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-full p-1.5 shadow-lg">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                        ) : (
                          <div className="bg-gray-200 text-gray-400 rounded-full p-1.5 border-2 border-gray-300">
                            <Circle className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 pr-12">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">
                          {favorite.libraryName || 'Unknown Library'}
                        </h3>
                        {favorite.libraryCategory && (
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full text-xs font-semibold">
                            {favorite.libraryCategory}
                          </span>
                        )}
                      </div>
                      
                      {!compareMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(favorite.id);
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors group/delete"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-5 h-5 text-gray-400 group-hover/delete:text-red-600 transition-colors" />
                        </button>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {favorite.libraryDescription || 'No description available'}
                    </p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {favorite.libraryRating && (
                        <div className="flex items-center gap-1 text-gray-700">
                          <Star size={14} className="text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold">{favorite.libraryRating}</span>
                        </div>
                      )}
                      {favorite.libraryDownloads && (
                        <div className="flex items-center gap-1 text-gray-700">
                          <Download size={14} className="text-green-600" />
                          <span className="text-xs font-bold">{formatNumber(favorite.libraryDownloads)}</span>
                        </div>
                      )}
                      {favorite.libraryVersion && (
                        <div className="flex items-center gap-1 text-gray-700">
                          <Code size={14} className="text-blue-600" />
                          <span className="text-xs font-bold">{favorite.libraryVersion}</span>
                        </div>
                      )}
                    </div>

                    {/* Platforms */}
                    {favorite.libraryPlatforms && favorite.libraryPlatforms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {favorite.libraryPlatforms.slice(0, 3).map((platform, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium border border-gray-300">
                            {platform === 'windows' ? '🪟' : platform === 'macos' ? '🍎' : '🐧'} {platform}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    {!compareMode && (
                      <div className="flex gap-2 mb-3">
                        {favorite.libraryHomepage && (
                          <a
                            href={favorite.libraryHomepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <ExternalLink size={12} />
                            Homepage
                          </a>
                        )}
                        {favorite.libraryRepository && (
                          <a
                            href={favorite.libraryRepository}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <ExternalLink size={12} />
                            GitHub
                          </a>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 border-t border-gray-200 pt-2">
                      Added {formatDate(favorite.createdAt)}
                    </p>

                    {/* Compare Mode Badge */}
                    {compareMode && isSelected && (
                      <div className="absolute bottom-3 right-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-full text-xs font-bold shadow-lg">
                          Selected
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Library Info Modal */}
      {selectedLibrary && (
        <LibraryInfoModal
          library={selectedLibrary}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedLibrary(null);
          }}
        />
      )}

      {/* Loading Overlay */}
      {loadingLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            <Loader className="w-12 h-12 text-rose-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Loading library details...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;