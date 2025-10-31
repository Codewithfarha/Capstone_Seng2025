import React from 'react';
import { CheckCircle, XCircle, ExternalLink, Star } from 'lucide-react';

const ComparisonTable = ({ libraries }) => {
  if (!libraries || libraries.length < 2) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center border border-orange-200">
        <p className="text-gray-600">Please select at least 2 libraries to compare</p>
      </div>
    );
  }

  // Dynamic grid columns based on number of libraries
  const getGridCols = () => {
    switch(libraries.length) {
      case 2: return 'grid-cols-3';
      case 3: return 'grid-cols-4';
      case 4: return 'grid-cols-5';
      case 5: return 'grid-cols-6';
      default: return 'grid-cols-6';
    }
  };

  const ComparisonRow = ({ label, icon, values, type = 'text' }) => {
    return (
      <div className="border-b border-orange-100 last:border-b-0 hover:bg-gradient-to-r hover:from-rose-50 hover:to-orange-50 transition-all">
        <div className={`grid gap-4 py-4 px-6 ${getGridCols()}`}>
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            {icon && <span className="text-orange-600">{icon}</span>}
            {label}
          </div>
          {values.map((value, index) => (
            <div key={index} className="text-gray-900 flex items-center">
              {type === 'boolean' ? (
                value ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Yes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">No</span>
                  </div>
                )
              ) : type === 'badge' ? (
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(value) ? (
                    value.map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded text-sm capitalize font-medium border border-orange-200">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded text-sm capitalize font-medium border border-orange-200">
                      {value}
                    </span>
                  )}
                </div>
              ) : type === 'list' ? (
                <ul className="space-y-1">
                  {Array.isArray(value) && value.length > 0 ? (
                    value.slice(0, 5).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {item}
                      </li>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm italic">None</span>
                  )}
                  {Array.isArray(value) && value.length > 5 && (
                    <li className="text-sm text-gray-500 italic">+{value.length - 5} more</li>
                  )}
                </ul>
              ) : type === 'rating' ? (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-lg">{value || 'N/A'}</span>
                  <span className="text-gray-500 text-sm">/ 5.0</span>
                </div>
              ) : type === 'link' ? (
                value ? (
                  <a 
                    href={value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-sm font-semibold transition-colors"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-gray-400 italic text-sm">Not available</span>
                )
              ) : type === 'cost' ? (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  value?.toLowerCase() === 'free' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : value?.toLowerCase() === 'paid'
                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                    : 'bg-amber-100 text-amber-700 border border-amber-300'
                }`}>
                  {value || 'N/A'}
                </span>
              ) : (
                <span className="text-sm font-medium">{value || 'N/A'}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, icon }) => (
    <div className="px-6 py-4 bg-gradient-to-r from-rose-100 via-orange-100 to-amber-100 border-b-2 border-orange-300">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        {icon}
        {title}
      </h3>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-orange-200">
      {/* Basic Information */}
      <SectionHeader title="Basic Information" icon="📋" />
      <ComparisonRow
        label="Description"
        values={libraries.map(lib => lib.description)}
      />
      <ComparisonRow
        label="Version"
        values={libraries.map(lib => lib.version)}
      />
      <ComparisonRow
        label="Category"
        values={libraries.map(lib => lib.category)}
        type="badge"
      />
      <ComparisonRow
        label="License"
        values={libraries.map(lib => lib.license)}
        type="badge"
      />

      {/* Platform Support */}
      <SectionHeader title="Platform Support" icon="💻" />
      <ComparisonRow
        label="Platforms"
        values={libraries.map(lib => lib.platforms)}
        type="badge"
      />
      <ComparisonRow
        label="Windows"
        values={libraries.map(lib => lib.platforms?.includes('windows'))}
        type="boolean"
      />
      <ComparisonRow
        label="macOS"
        values={libraries.map(lib => lib.platforms?.includes('macos'))}
        type="boolean"
      />
      <ComparisonRow
        label="Linux"
        values={libraries.map(lib => lib.platforms?.includes('linux'))}
        type="boolean"
      />

      {/* Pricing & Statistics */}
      <SectionHeader title="Pricing & Statistics" icon="💰" />
      <ComparisonRow
        label="Cost"
        values={libraries.map(lib => lib.cost)}
        type="cost"
      />
      <ComparisonRow
        label="Rating"
        values={libraries.map(lib => lib.rating)}
        type="rating"
      />
      <ComparisonRow
        label="Downloads"
        values={libraries.map(lib => lib.downloads)}
      />
      <ComparisonRow
        label="Size"
        values={libraries.map(lib => lib.size)}
      />
      <ComparisonRow
        label="Last Updated"
        values={libraries.map(lib => lib.lastUpdated)}
      />
      <ComparisonRow
        label="Maintainers"
        values={libraries.map(lib => lib.maintainers)}
      />

      {/* Dependencies */}
      <SectionHeader title="Dependencies" icon="🔗" />
      <ComparisonRow
        label="Dependencies"
        values={libraries.map(lib => lib.dependencies || [])}
        type="list"
      />

      {/* Key Features */}
      <SectionHeader title="Key Features" icon="✨" />
      <ComparisonRow
        label="Features"
        values={libraries.map(lib => lib.features || [])}
        type="list"
      />

      {/* Links */}
      <SectionHeader title="Links & Resources" icon="🔗" />
      <ComparisonRow
        label="Website"
        values={libraries.map(lib => lib.website)}
        type="link"
      />
      <ComparisonRow
        label="Repository"
        values={libraries.map(lib => lib.repository)}
        type="link"
      />
    </div>
  );
};

export default ComparisonTable;