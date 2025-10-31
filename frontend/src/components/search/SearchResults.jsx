import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LibraryCard from '../library/LibraryCard';
import Loading from '../layout/Loading';
import { GitCompare, AlertCircle } from 'lucide-react';

const SearchResults = ({ libraries, loading, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  const handleCompareToggle = (library) => {
    setSelectedForComparison(prev => {
      const isSelected = prev.some(lib => lib.id === library.id);
      
      if (isSelected) {
        // Remove from comparison
        return prev.filter(lib => lib.id !== library.id);
      } else {
        // Add to comparison (max 4 libraries)
        if (prev.length >= 4) {
          alert('You can only compare up to 4 libraries at once');
          return prev;
        }
        return [...prev, library];
      }
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      alert('Please select at least 2 libraries to compare');
      return;
    }
    
    const ids = selectedForComparison.map(lib => lib.id).join(',');
    navigate(`/compare?libs=${ids}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (!libraries || libraries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Libraries Found</h3>
        <p className="text-gray-600">Try adjusting your search filters or search term</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comparison Bar */}
      {selectedForComparison.length > 0 && (
        <div className="bg-gradient-to-r from-rose-400 via-orange-380 to-amber-300 text-white rounded-xl p-4 shadow-lg sticky top-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitCompare className="w-6 h-6" />
              <div>
                <p className="font-bold">
                  {selectedForComparison.length} {selectedForComparison.length === 1 ? 'library' : 'libraries'} selected
                </p>
                <p className="text-sm text-blue-100">
                  {selectedForComparison.map(lib => lib.name).join(', ')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedForComparison([])}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
              >
                Clear
              </button>
              <button
                onClick={handleCompare}
                disabled={selectedForComparison.length < 2}
                className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span className="font-bold text-gray-900">{libraries.length}</span> {libraries.length === 1 ? 'library' : 'libraries'}
        </p>
      </div>

      {/* Library Grid */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {libraries.map((library) => (
          <LibraryCard
            key={library.id}
            library={library}
            onCompare={handleCompareToggle}
            isSelected={selectedForComparison.some(lib => lib.id === library.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;