import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import SearchResults from '../components/search/SearchResults';
import { Filter, Grid, List } from 'lucide-react';

const SearchPage = () => {
  const { libraries, loading } = useLibrary();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOS, setSelectedOS] = useState('all');
  const [selectedCost, setSelectedCost] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Search Libraries</h1>
        <p className="text-gray-600 mb-8">
          Discover from {libraries.length} libraries across multiple platforms
        </p>
        
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
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