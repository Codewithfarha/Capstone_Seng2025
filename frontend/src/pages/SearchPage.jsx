import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import SearchResults from '../components/search/SearchResults';
import { Filter, Grid, List, Search } from 'lucide-react';

const SearchPage = () => {
  const { libraries, loading } = useLibrary();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOS, setSelectedOS] = useState('all');
  const [selectedCost, setSelectedCost] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedOS('all');
    setSelectedCost('all');
    setMinRating(0);
  };

  // Filter libraries
  const filteredLibraries = libraries.filter(lib => {
    const categoryMatch = selectedCategory === 'all' || lib.category === selectedCategory;
    const osMatch = selectedOS === 'all' || lib.platforms?.includes(selectedOS);
    const costMatch = selectedCost === 'all' || lib.cost?.toLowerCase() === selectedCost;
    const ratingMatch = (lib.rating || 0) >= minRating;
    return categoryMatch && osMatch && costMatch && ratingMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-3 rounded-xl shadow-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Search 
            <span className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent"> Libraries</span>
          </h1>
          <p className="text-xl text-gray-700">
            Discover from <span className="font-bold text-orange-600">{libraries.length}</span> libraries across multiple platforms
          </p>
        </div>
        
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            {viewMode === 'grid' ? 'List' : 'Grid'} View
          </button>
        </div>

        <div className="flex gap-6">
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <FilterPanel
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedOS={selectedOS}
                setSelectedOS={setSelectedOS}
                selectedCost={selectedCost}
                setSelectedCost={setSelectedCost}
                minRating={minRating}
                setMinRating={setMinRating}
                onClearFilters={clearFilters}
                showFilters={showFilters}
              />
            </div>
          )}
          
          <div className="flex-1">
            <SearchResults
              libraries={filteredLibraries}
              loading={loading}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;