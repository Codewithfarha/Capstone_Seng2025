import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import LibraryCard from '../components/library/LibraryCard';
import Loading from '../components/layout/Loading';
import { Package, Grid, List } from 'lucide-react';

const LibrariesPage = () => {
  const { libraries, loading } = useLibrary();
  const [viewMode, setViewMode] = useState('grid');

  if (loading) return <Loading message="Loading libraries..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Package className="w-10 h-10" />
              All Libraries
            </h1>
            <p className="text-gray-600">
              Browse {libraries.length} libraries across all categories
            </p>
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            {viewMode === 'grid' ? 'List' : 'Grid'} View
          </button>
        </div>

        {libraries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Libraries Found</h3>
            <p className="text-gray-600">No libraries available at the moment.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {libraries.map(library => (
              <LibraryCard key={library.id} library={library} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrariesPage;