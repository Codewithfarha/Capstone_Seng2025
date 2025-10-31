import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

const SearchBar = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedPlatform,
    setSelectedPlatform,
    categories,
  } = useLibrary();

  const [showFilters, setShowFilters] = useState(false);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPlatform('all');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedPlatform !== 'all';

  const platforms = ['windows', 'macos', 'linux'];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-24 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearSearch}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Clear filters"
            >
              <X size={18} className="text-gray-500" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg ${showFilters ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            title="Toggle filters"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>


      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Platforms</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

    
      
    </div>
  );
};

export default SearchBar;