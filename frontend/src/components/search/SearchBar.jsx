import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

const SearchBar = ({ onExternalSearch, searchSource = 'firebase' }) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedPlatform,
    setSelectedPlatform,
    categories,
  } = useLibrary();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Update context for Firebase search
    setSearchTerm(localSearchTerm);
    
    // Trigger external search if needed
    if (onExternalSearch && searchSource !== 'firebase') {
      onExternalSearch(localSearchTerm);
    }
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPlatform('all');
    
    // Clear external results
    if (onExternalSearch && searchSource !== 'firebase') {
      onExternalSearch('');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // For Firebase, update immediately
    if (searchSource === 'firebase') {
      setSearchTerm(value);
    }
  };

  const getPlaceholder = () => {
    if (searchSource === 'npm') {
      return 'Search NPM packages... (e.g., react, lodash)';
    } else if (searchSource === 'combined') {
      return 'Search all sources...';
    }
    return 'Search libraries by name, description, or tags...';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-orange-200">
      {/* Search Input Only */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" size={20} />
          <input
            type="text"
            value={localSearchTerm}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            className="w-full pl-12 pr-24 py-3.5 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base hover:border-orange-300"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {localSearchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                title="Clear search"
              >
                <X size={18} className="text-rose-600" />
              </button>
            )}
            
            {/* Search button for external */}
            {searchSource !== 'firebase' && (
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg font-semibold transition-all transform hover:scale-105"
              >
                Search
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;