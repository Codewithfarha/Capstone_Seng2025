import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Star, Download, ExternalLink, Calendar } from 'lucide-react';

const SearchResults = ({ libraries, loading, viewMode = 'grid' }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Searching libraries...</span>
      </div>
    );
  }

  if (libraries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Libraries Found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or filters</p>
      </div>
    );
  }

  const LibraryCard = ({ library }) => (
    <Link
      to={`/library/${library.id}`}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 text-white" />
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
            {library.category}
          </span>
        </div>
        
        {/* Title & Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {library.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {library.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{library.rating || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{library.downloads || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">v{library.version}</span>
          </div>
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap gap-2">
          {library.platforms?.slice(0, 3).map((platform, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
              {platform}
            </span>
          ))}
          {library.platforms?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              +{library.platforms.length - 3}
            </span>
          )}
        </div>

        {/* Cost Badge */}
        {library.cost && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              library.cost.toLowerCase() === 'free' 
                ? 'bg-green-100 text-green-700'
                : library.cost.toLowerCase() === 'paid'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {library.cost}
            </span>
          </div>
        )}
      </div>
    </Link>
  );

  const LibraryListItem = ({ library }) => (
    <Link
      to={`/library/${library.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
    >
      <div className="p-6 flex items-center gap-6">
        {/* Icon */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform">
          <Package className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {library.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-1">
                {library.description}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                {library.category}
              </span>
              {library.website && (
                <a
                  href={library.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{library.rating || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>{library.downloads || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>v{library.version}</span>
            </div>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
              library.cost?.toLowerCase() === 'free' 
                ? 'bg-green-100 text-green-700'
                : library.cost?.toLowerCase() === 'paid'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {library.cost}
            </span>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-2 mt-3">
            {library.platforms?.map((platform, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Found <span className="font-semibold text-gray-900">{libraries.length}</span> {libraries.length === 1 ? 'library' : 'libraries'}
        </p>
      </div>

      {/* Results Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {libraries.map(library => (
            <LibraryCard key={library.id} library={library} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {libraries.map(library => (
            <LibraryListItem key={library.id} library={library} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;