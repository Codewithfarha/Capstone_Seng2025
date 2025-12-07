import React, { useState, useEffect } from 'react';
import { History, Star, X, Search, Trash2, Clock, Bookmark } from 'lucide-react';

const SearchHistory = ({ onSearchSelect, currentSearch }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = () => {
    try {
      const recent = localStorage.getItem('recentSearches');
      const saved = localStorage.getItem('savedSearches');
      
      if (recent) {
        setRecentSearches(JSON.parse(recent));
      }
      
      if (saved) {
        setSavedSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  // Add search to recent history (called from parent)
  const addToRecent = (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') return;

    const newSearch = {
      query: searchQuery.trim(),
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    // ⭐ AUTOMATICALLY SAVE TO SAVED SEARCHES
    setSavedSearches(prev => {
      // Check if already saved
      const exists = prev.some(s => s.query.toLowerCase() === searchQuery.trim().toLowerCase());
      if (!exists) {
        // Add to saved searches automatically
        const savedSearch = { ...newSearch, savedAt: newSearch.timestamp };
        const updated = [savedSearch, ...prev];
        localStorage.setItem('savedSearches', JSON.stringify(updated));
        console.log('✅ Auto-saved search:', searchQuery.trim());
        return updated;
      }
      return prev;
    });

    // Also add to recent for history tracking
    setRecentSearches(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(s => s.query.toLowerCase() !== searchQuery.trim().toLowerCase());
      // Add to beginning, keep only last 10
      const updated = [newSearch, ...filtered].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  // Save a search (called from parent or internally)
  const saveSearch = (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      alert('Please enter a search query to save!');
      return;
    }

    // Check if already saved
    const exists = savedSearches.some(s => s.query.toLowerCase() === searchQuery.trim().toLowerCase());
    if (exists) {
      alert('✓ This search is already saved!');
      return;
    }

    const newSaved = {
      query: searchQuery.trim(),
      savedAt: new Date().toISOString(),
      id: Date.now()
    };

    setSavedSearches(prev => {
      const updated = [newSaved, ...prev];
      localStorage.setItem('savedSearches', JSON.stringify(updated));
      return updated;
    });

    alert(`✓ Saved: "${searchQuery}"`);
  };

  // Remove from recent
  const removeFromRecent = (id, e) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  // Remove from saved
  const removeFromSaved = (id, e) => {
    e.stopPropagation();
    setSavedSearches(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('savedSearches', JSON.stringify(updated));
      return updated;
    });
  };

  // Clear all recent searches
  const clearAllRecent = (e) => {
    e.stopPropagation();
    if (window.confirm('Clear all recent searches?')) {
      setRecentSearches([]);
      localStorage.removeItem('recentSearches');
    }
  };

  // Clear all saved searches
  const clearAllSaved = (e) => {
    e.stopPropagation();
    if (window.confirm('Clear all saved searches?')) {
      setSavedSearches([]);
      localStorage.removeItem('savedSearches');
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Expose functions to parent via ref
  React.useImperativeHandle(React.useRef(), () => ({
    addToRecent,
    saveSearch
  }));

  const totalSearches = recentSearches.length + savedSearches.length;

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-all text-gray-700 hover:text-orange-600 font-medium shadow-sm hover:shadow-md"
      >
        <History className="w-5 h-5" />
        <span>History</span>
        {totalSearches > 0 && (
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
            {totalSearches}
          </span>
        )}
      </button>

      {/* History Panel */}
      {showHistory && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setShowHistory(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border-2 border-orange-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-gray-900 text-lg">Search History</h3>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {currentSearch && (
                <button
                  onClick={() => saveSearch(currentSearch)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-md transition-all text-sm font-semibold"
                >
                  <Bookmark className="w-4 h-4" />
                  Save Current Search: "{currentSearch}"
                </button>
              )}
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              {/* Saved Searches Section */}
              {savedSearches.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <h4 className="font-semibold text-gray-900">Saved Searches</h4>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                        {savedSearches.length}
                      </span>
                    </div>
                    <button
                      onClick={clearAllSaved}
                      className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {savedSearches.map(search => (
                      <div
                        key={search.id}
                        className="group flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all cursor-pointer border border-amber-200"
                        onClick={() => {
                          onSearchSelect(search.query);
                          setShowHistory(false);
                        }}
                      >
                        <div className="flex-1 flex items-center gap-2">
                          <Search className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{search.query}</p>
                            <p className="text-xs text-gray-500">{formatTime(search.savedAt)}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => removeFromSaved(search.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all text-red-600"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches Section */}
              {recentSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <h4 className="font-semibold text-gray-900">Recent Searches</h4>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                        {recentSearches.length}
                      </span>
                    </div>
                    <button
                      onClick={clearAllRecent}
                      className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map(search => (
                      <div
                        key={search.id}
                        className="group flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all cursor-pointer border border-blue-200"
                        onClick={() => {
                          onSearchSelect(search.query);
                          setShowHistory(false);
                        }}
                      >
                        <div className="flex-1 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{search.query}</p>
                            <p className="text-xs text-gray-500">{formatTime(search.timestamp)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveSearch(search.query);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-amber-100 rounded transition-all text-amber-600"
                            title="Save this search"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => removeFromRecent(search.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all text-red-600"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {recentSearches.length === 0 && savedSearches.length === 0 && (
                <div className="p-8 text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">No Search History</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Your recent and saved searches will appear here
                  </p>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 space-y-1">
                    <p>💡 <strong>Tip:</strong> Search for libraries to build your history</p>
                    <p>⭐ <strong>Save:</strong> Click star to save important searches</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Tips */}
            {(recentSearches.length > 0 || savedSearches.length > 0) && (
              <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
                <p className="text-center">
                  💡 Click any search to re-run • ⭐ Star to save • ✕ to remove
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchHistory;