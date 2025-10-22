import React from 'react';
import { CheckCircle, XCircle, ExternalLink, Star } from 'lucide-react';

const ComparisonTable = ({ libraries }) => {
  if (!libraries || libraries.length < 2) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600">Please select at least 2 libraries to compare</p>
      </div>
    );
  }

  const ComparisonRow = ({ label, icon, values, type = 'text' }) => {
    return (
      <div className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
        <div className={`grid gap-4 py-4 px-6 ${libraries.length === 2 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          <div className="flex items-center gap-2 font-medium text-gray-700">
            {icon && <span className="text-blue-500">{icon}</span>}
            {label}
          </div>
          {values.map((value, index) => (
            <div key={index} className="text-gray-900 flex items-center">
              {type === 'boolean' ? (
                value ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Yes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">No</span>
                  </div>
                )
              ) : type === 'badge' ? (
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(value) ? (
                    value.map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm capitalize">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm capitalize">
                      {value}
                    </span>
                  )}
                </div>
              ) : type === 'list' ? (
                <ul className="space-y-1">
                  {Array.isArray(value) && value.length > 0 ? (
                    value.slice(0, 5).map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
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
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-lg">{value || 'N/A'}</span>
                  <span className="text-gray-500 text-sm">/ 5.0</span>
                </div>
              ) : type === 'link' ? (
                value ? (
                  <a 
                    href={value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-gray-400 italic text-sm">Not available</span>
                )
              ) : type === 'cost' ? (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  value?.toLowerCase() === 'free' 
                    ? 'bg-green-100 text-green-700'
                    : value?.toLowerCase() === 'paid'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {value || 'N/A'}
                </span>
              ) : (
                <span className="text-sm">{value || 'N/A'}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, icon }) => (
    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        {icon}
        {title}
      </h3>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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