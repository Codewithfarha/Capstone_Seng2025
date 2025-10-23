import React from 'react';
import { X, Filter } from 'lucide-react';

const FilterPanel = ({ 
  selectedCategory, 
  setSelectedCategory,
  selectedOS,
  setSelectedOS,
  selectedCost,
  setSelectedCost,
  minRating,
  setMinRating,
  onClearFilters,
  showFilters = true
}) => {
  const categories = [
    { value: 'all', label: 'All Categories', icon: '📦' },
    { value: 'Frontend', label: 'Frontend', icon: '🎨' },
    { value: 'Backend', label: 'Backend', icon: '⚙️' },
    { value: 'Database', label: 'Database', icon: '🗄️' },
    { value: 'Utility', label: 'Utility', icon: '🔧' },
    { value: 'Testing', label: 'Testing', icon: '🧪' },
    { value: 'CSS Framework', label: 'CSS Framework', icon: '💅' },
    { value: 'Machine Learning', label: 'Machine Learning', icon: '🤖' },
    { value: 'Data Science', label: 'Data Science', icon: '📊' },
    { value: 'Build Tool', label: 'Build Tools', icon: '🔨' }
  ];

  const operatingSystems = [
    { value: 'all', label: 'All Platforms', icon: '🌐' },
    { value: 'windows', label: 'Windows', icon: '🪟' },
    { value: 'macos', label: 'macOS', icon: '🍎' },
    { value: 'linux', label: 'Linux', icon: '🐧' }
  ];

  const costOptions = [
    { value: 'all', label: 'All' },
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
    { value: 'freemium', label: 'Freemium' }
  ];

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedOS !== 'all' || 
    selectedCost !== 'all' ||
    minRating > 0;

  if (!showFilters) return null;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="font-medium">{category.label}</span>
              {selectedCategory === category.value && (
                <span className="ml-auto text-white">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Operating System Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Operating System</h4>
        <div className="space-y-2">
          {operatingSystems.map((os) => (
            <button
              key={os.value}
              onClick={() => setSelectedOS(os.value)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                selectedOS === os.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
              }`}
            >
              <span className="text-xl">{os.icon}</span>
              <span className="font-medium">{os.label}</span>
              {selectedOS === os.value && (
                <span className="ml-auto text-white">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cost Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Cost</h4>
        <div className="space-y-2">
          {costOptions.map((cost) => (
            <button
              key={cost.value}
              onClick={() => setSelectedCost(cost.value)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedCost === cost.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="font-medium">{cost.label}</span>
              {selectedCost === cost.value && (
                <span className="ml-2">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Minimum Rating</h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Any rating</span>
            <span className="font-bold text-gray-900 bg-yellow-100 px-3 py-1 rounded-full">
              ★ {minRating.toFixed(1)}+
            </span>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">Active Filters</h4>
          <div className="space-y-2">
            {selectedCategory !== 'all' && (
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg">
                <span className="text-sm text-blue-700">{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {selectedOS !== 'all' && (
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg">
                <span className="text-sm text-blue-700 capitalize">{selectedOS}</span>
                <button
                  onClick={() => setSelectedOS('all')}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {selectedCost !== 'all' && (
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg">
                <span className="text-sm text-blue-700 capitalize">{selectedCost}</span>
                <button
                  onClick={() => setSelectedCost('all')}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {minRating > 0 && (
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg">
                <span className="text-sm text-blue-700">Rating ≥ {minRating.toFixed(1)}</span>
                <button
                  onClick={() => setMinRating(0)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;