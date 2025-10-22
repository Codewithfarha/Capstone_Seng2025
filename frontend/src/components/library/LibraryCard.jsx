import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Download, ExternalLink, GitCompare, Code } from 'lucide-react';

const LibraryCard = ({ library, onCompare, isComparing = false }) => {
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

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer"
    >
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

      <div className="flex flex-wrap gap-2 mb-4">
        {library.platforms?.map((platform) => (
          <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            {platform}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Star size={16} className="text-yellow-500" />
          <span className="font-medium">{library.stars?.toLocaleString() || '0'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Download size={16} className="text-blue-500" />
          <span className="font-medium text-xs">{library.downloads || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Code size={16} className="text-purple-500" />
          <span className="font-medium text-xs">{library.language}</span>
        </div>
      </div>

      <div className="pt-3 border-t flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          library.cost === 'Free' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {library.cost}
        </span>

        <div className="flex items-center gap-2">
          {onCompare && (
            <button
              onClick={handleCompareClick}
              className={`p-2 rounded-lg transition-colors ${
                isComparing ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
              }`}
              title="Compare"
            >
              <GitCompare size={18} />
            </button>
          )}
          <a
            href={library.repository}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 hover:bg-gray-200 rounded-lg"
            title="View Repository"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LibraryCard;