import React from 'react';
import { X, Filter } from 'lucide-react';

const FilterPanel = ({ 
  selectedCategory, 
  setSelectedCategory,
  selectedOS,
  setSelectedOS,
  minRating,
  setMinRating,
  onClearFilters,
  showFilters = true
}) => {
  // Real categories from Libraries.io API
  const categories = [
    { value: 'all', label: 'All Languages', icon: '🌐' },
    { value: 'JavaScript', label: 'JavaScript', icon: '💛' },
    { value: 'Python', label: 'Python', icon: '🐍' },
    { value: 'Java', label: 'Java', icon: '☕' },
    { value: 'Ruby', label: 'Ruby', icon: '💎' },
    { value: 'PHP', label: 'PHP', icon: '🐘' },
    { value: 'Go', label: 'Go', icon: '🔵' },
    { value: 'Rust', label: 'Rust', icon: '🦀' },
    { value: '.NET', label: '.NET (C#)', icon: '🔷' },
  { value: 'Dart', label: 'Dart/Flutter', icon: '🎯' },
    { value: 'Elixir', label: 'Elixir', icon: '💧' },
    { value: 'Haskell', label: 'Haskell', icon: '🎓' },
    { value: 'Clojure', label: 'Clojure', icon: '🔵' },
    { value: 'R', label: 'R', icon: '📊' },
    { value: 'Perl', label: 'Perl', icon: '🐪' },
    { value: 'Elm', label: 'Elm', icon: '🌳' }
  ];

  const operatingSystems = [
    { value: 'all', label: 'All Platforms', icon: '🌐' },
    { value: 'windows', label: 'Windows', icon: '🪟' },
    { value: 'macos', label: 'macOS', icon: '🍎' },
    { value: 'linux', label: 'Linux', icon: '🐧' }
  ];

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedOS !== 'all' || 
    minRating > 0;

  if (!showFilters) return null;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-rose-600" />
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-rose-600 hover:text-rose-700 font-semibold underline transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-orange-200">
        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💻</span>
          <span>Languages</span>
        </h4>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-lg scale-105 border-2 border-orange-400'
                  : 'bg-white text-gray-700 hover:bg-orange-50 hover:scale-102 border-2 border-gray-200 hover:border-orange-300'
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="text-sm">{category.label}</span>
              {selectedCategory === category.value && (
                <span className="ml-auto text-white font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Operating System Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-orange-200">
        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💻</span>
          <span>Operating System</span>
        </h4>
        <div className="space-y-2">
          {operatingSystems.map((os) => (
            <button
              key={os.value}
              onClick={() => setSelectedOS(os.value)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium ${
                selectedOS === os.value
                  ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-lg scale-105 border-2 border-orange-400'
                  : 'bg-white text-gray-700 hover:bg-orange-50 hover:scale-102 border-2 border-gray-200 hover:border-orange-300'
              }`}
            >
              <span className="text-xl">{os.icon}</span>
              <span className="text-sm">{os.label}</span>
              {selectedOS === os.value && (
                <span className="ml-auto text-white font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-orange-200">
        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>⭐</span>
          <span>Minimum Rating</span>
        </h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Any rating</span>
            <span className="font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2 rounded-full shadow-md">
              ★ {minRating.toFixed(1)}+
            </span>
          </div>
          {minRating > 0 && (
            <p className="text-xs text-gray-500 text-center">
              Showing libraries rated {minRating.toFixed(1)} stars or higher
            </p>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-orange-300 rounded-xl p-4 shadow-md">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Active Filters</span>
          </h4>
          <div className="space-y-2">
            {selectedCategory !== 'all' && (
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border-2 border-orange-200 shadow-sm">
                <span className="text-sm text-gray-900 font-semibold">{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-rose-600 hover:text-rose-700 transition-colors"
                  title="Remove filter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {selectedOS !== 'all' && (
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border-2 border-orange-200 shadow-sm">
                <span className="text-sm text-gray-900 capitalize font-semibold">{selectedOS}</span>
                <button
                  onClick={() => setSelectedOS('all')}
                  className="text-rose-600 hover:text-rose-700 transition-colors"
                  title="Remove filter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {minRating > 0 && (
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border-2 border-orange-200 shadow-sm">
                <span className="text-sm text-gray-900 font-semibold">Rating ≥ {minRating.toFixed(1)}</span>
                <button
                  onClick={() => setMinRating(0)}
                  className="text-rose-600 hover:text-rose-700 transition-colors"
                  title="Remove filter"
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