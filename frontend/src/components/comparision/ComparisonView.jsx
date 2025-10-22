import React from 'react';
import { X, Star, Download } from 'lucide-react';

const ComparisonView = ({ library1, library2, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-900">Library Comparison</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-gray-600 font-semibold">Property</div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-blue-700">{library1.name}</h3>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-purple-700">{library2.name}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 py-4 border-b">
              <span className="font-medium text-gray-700">Version</span>
              <span className="text-gray-900">{library1.version}</span>
              <span className="text-gray-900">{library2.version}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-b">
              <span className="font-medium text-gray-700">Category</span>
              <span className="text-gray-900">{library1.category}</span>
              <span className="text-gray-900">{library2.category}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-b">
              <span className="font-medium text-gray-700">License</span>
              <span className="text-gray-900">{library1.license}</span>
              <span className="text-gray-900">{library2.license}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-b">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-500" />
                <span className="font-medium text-gray-700">Stars</span>
              </div>
              <span className="text-gray-900 font-semibold">{library1.stars?.toLocaleString()}</span>
              <span className="text-gray-900 font-semibold">{library2.stars?.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-b">
              <div className="flex items-center gap-2">
                <Download size={18} className="text-blue-500" />
                <span className="font-medium text-gray-700">Downloads</span>
              </div>
              <span className="text-gray-900">{library1.downloads}</span>
              <span className="text-gray-900">{library2.downloads}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-b">
              <span className="font-medium text-gray-700">Language</span>
              <span className="text-gray-900">{library1.language}</span>
              <span className="text-gray-900">{library2.language}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-b">
              <span className="font-medium text-gray-700">Platforms</span>
              <div className="flex flex-wrap gap-1">
                {library1.platforms?.map((p) => (
                  <span key={p} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {p}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {library2.platforms?.map((p) => (
                  <span key={p} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4">
              <span className="font-medium text-gray-700">Maintainer</span>
              <span className="text-gray-900">{library1.maintainer}</span>
              <span className="text-gray-900">{library2.maintainer}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;