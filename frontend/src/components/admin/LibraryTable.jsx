import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, ExternalLink, Eye, Package } from 'lucide-react';

const LibraryTable = ({ libraries, loading, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedLibraries = [...libraries].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === 'rating') {
      comparison = (a.rating || 0) - (b.rating || 0);
    } else if (sortField === 'downloads') {
      const aDownloads = parseInt(a.downloads?.replace(/\D/g, '') || 0);
      const bDownloads = parseInt(b.downloads?.replace(/\D/g, '') || 0);
      comparison = aDownloads - bDownloads;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const SortableHeader = ({ field, children }) => (
    <th 
      onClick={() => handleSort(field)}
      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          <span className="text-blue-500">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-600">Loading libraries...</span>
        </div>
      </div>
    );
  }

  if (libraries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Libraries Found</h3>
        <p className="text-gray-600">Try adjusting your search or add a new library</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Table Header Info */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{libraries.length}</span> {libraries.length === 1 ? 'library' : 'libraries'}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortableHeader field="name">Name</SortableHeader>
              <SortableHeader field="category">Category</SortableHeader>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Version</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Platforms</th>
              <SortableHeader field="rating">Rating</SortableHeader>
              <SortableHeader field="downloads">Downloads</SortableHeader>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedLibraries.map((library) => (
              <tr key={library.id} className="hover:bg-gray-50 transition-colors">
                {/* Name & Description */}
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg flex-shrink-0">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {library.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {library.description}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize whitespace-nowrap">
                    {library.category}
                  </span>
                </td>

                {/* Version */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className="font-mono">{library.version}</span>
                </td>

                {/* Platforms */}
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {library.platforms?.slice(0, 3).map((platform, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize"
                      >
                        {platform}
                      </span>
                    ))}
                    {library.platforms?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{library.platforms.length - 3}
                      </span>
                    )}
                  </div>
                </td>

                {/* Rating */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {library.rating || 'N/A'}
                    </span>
                  </div>
                </td>

                {/* Downloads */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {library.downloads || 'N/A'}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/library/${library.id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {library.website && (
                      <a
                        href={library.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Visit Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onEdit(library)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(library.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Click column headers to sort</span>
          <span>{sortedLibraries.length} total {sortedLibraries.length === 1 ? 'entry' : 'entries'}</span>
        </div>
      </div>
    </div>
  );
};

export default LibraryTable;