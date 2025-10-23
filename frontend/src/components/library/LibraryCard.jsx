import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Download, ExternalLink, GitCompare, Code } from 'lucide-react';

const LibraryCard = ({ library, onCompare, isSelected = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/library/${library.id}`);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    if (onCompare) {
      onCompare(library);
    }
  };

  const formatNumber = (num) => {
    if (typeof num === 'string') return num;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  return (
    <div
      className={`bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500'
      }`}
    >
      {/* Card Content */}
      <div onClick={handleCardClick}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{library.name}</h3>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {library.category}
            </span>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            v{library.version}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{library.description}</p>

        {/* Platforms */}
        <div className="flex flex-wrap gap-2 mb-4">
          {library.platforms?.map((platform) => (
            <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
              {platform === 'windows' ? '🪟 Windows' : platform === 'macos' ? '🍎 macOS' : '🐧 Linux'}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          {/* Rating */}
          {library.rating && (
            <div className="flex items-center gap-2 text-gray-600">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{library.rating}</span>
              <span className="text-xs text-gray-400">({formatNumber(library.reviews_count || 0)})</span>
            </div>
          )}
          
          {/* Stars */}
          <div className="flex items-center gap-2 text-gray-600">
            <Star size={16} className="text-gray-500" />
            <span className="font-medium">{formatNumber(library.stars || 0)}</span>
          </div>
          
          {/* Downloads */}
          <div className="flex items-center gap-2 text-gray-600">
            <Download size={16} className="text-blue-500" />
            <span className="font-medium text-xs">{formatNumber(library.downloads || 0)}</span>
          </div>
          
          {/* License */}
          <div className="flex items-center gap-2 text-gray-600">
            <Code size={16} className="text-purple-500" />
            <span className="font-medium text-xs">{library.license}</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <a href={library.homepage}target="_blank" rel="noopener noreferrer" onClick={(e)=> e.stopPropagation()} className="flex-1 flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Visit Website">
          <ExternalLink size={18} />
          </a>
          <a href={library.repository} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" title="View Repository">
            <Code size={18} />
          </a>
        </div>
      </div>
      
    {/* Compare Button - Moved to Bottom */}
      <button
        onClick={handleCompareClick}
        className={`w-full mt-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          isSelected 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <GitCompare className="w-5 h-5" />
        {isSelected ? 'Remove from Comparison' : 'Add to Compare'}
      </button>
    </div>
  );
};

export default LibraryCard;