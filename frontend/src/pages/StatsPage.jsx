import React, { useState, useEffect, useMemo } from 'react';
import StatCards from '../components/stats/StatCards';
import CategoryCharts from '../components/stats/CategoryCharts';
import PlatformCharts from '../components/stats/PlatformCharts';
import { BarChart3, RefreshCw, TrendingUp, Filter, X } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// EXPANDED search terms for better coverage (60+ terms)
const STATS_SEARCH_TERMS = [
  // JavaScript ecosystem (20 terms)
  'react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'gatsby',
  'express', 'koa', 'fastify', 'nest',
  'webpack', 'vite', 'rollup', 'parcel',
  'typescript', 'babel', 'eslint', 'prettier',
  'lodash', 'axios', 'moment', 'date-fns',
  
  // Python ecosystem (20 terms)
  'django', 'flask', 'fastapi', 'tornado', 'bottle',
  'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn',
  'requests', 'httpx', 'aiohttp',
  'pytest', 'unittest', 'nose',
  'sqlalchemy', 'peewee', 'pony',
  'celery', 'scrapy', 'beautifulsoup',
  
  // Java ecosystem (10 terms)
  'spring', 'hibernate', 'junit', 'mockito', 'log4j',
  'maven', 'gradle', 'gson', 'jackson', 'guava',
  
  // Other languages (20 terms)
  'rails', 'sinatra', 'devise', 'rspec',
  'laravel', 'symfony', 'composer', 'phpunit',
  'gin', 'echo', 'fiber', 'chi', 'buffalo',
  'actix', 'tokio', 'serde', 'rocket', 'warp',
  'dotnet', 'entity-framework'
];

const StatsPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentTerm, setCurrentTerm] = useState('');
  const [fetchingDetails, setFetchingDetails] = useState('');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOS, setSelectedOS] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    loadStatisticsData();
  }, []);

  const loadStatisticsData = async () => {
    console.log('📊 Loading statistics data from Libraries.io...');
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const allLibraries = [];
      const totalTerms = STATS_SEARCH_TERMS.length;
      
      // IMPROVED: Fetch MORE libraries per term (50 instead of 20)
      const LIMIT_PER_TERM = 50;
      
      // Fetch data for each search term
      for (let i = 0; i < STATS_SEARCH_TERMS.length; i++) {
        const term = STATS_SEARCH_TERMS[i];
        setCurrentTerm(term);
        setProgress(Math.round(((i + 1) / totalTerms) * 100));
        
        try {
          setFetchingDetails(`Fetching ${term}... (${i + 1}/${totalTerms})`);
          console.log(`🔍 Fetching data for: ${term}`);
          
          const response = await axios.get(`${API_URL}/external/search-external`, {
            params: {
              query: term,
              limit: LIMIT_PER_TERM,  // INCREASED from 20 to 50
              page: 1
            },
            timeout: 15000
          });
          
          if (response.data?.data) {
            allLibraries.push(...response.data.data);
            console.log(`✅ Fetched ${response.data.data.length} libraries for ${term} (Total: ${allLibraries.length})`);
          }
        } catch (err) {
          console.warn(`⚠️ Failed to fetch data for ${term}:`, err.message);
          // Continue with other terms even if one fails
        }
        
        // Small delay to avoid rate limiting (reduced from 200ms to 100ms)
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Deduplicate libraries by ID
      const uniqueLibraries = deduplicateLibraries(allLibraries);
      
      console.log(`✅ Statistics loaded: ${uniqueLibraries.length} unique libraries (from ${allLibraries.length} total fetched)`);
      setLibraries(uniqueLibraries);
      setProgress(100);
      setFetchingDetails('Complete!');
    } catch (err) {
      console.error('❌ Error loading statistics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setCurrentTerm('');
      setTimeout(() => setFetchingDetails(''), 1000);
    }
  };

  const deduplicateLibraries = (libs) => {
    const seen = new Set();
    return libs.filter(lib => {
      if (seen.has(lib.id)) {
        return false;
      }
      seen.add(lib.id);
      return true;
    });
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    libraries.forEach(lib => {
      if (lib.category) cats.add(lib.category);
      if (lib.packageManagerName) cats.add(lib.packageManagerName);
    });
    return Array.from(cats).sort();
  }, [libraries]);

  // Extract unique suppliers/manufacturers (package managers)
  const suppliers = useMemo(() => {
    const sups = new Set();
    libraries.forEach(lib => {
      if (lib.platform) sups.add(lib.platform);
      if (lib.packageManager) sups.add(lib.packageManager);
    });
    return Array.from(sups).sort();
  }, [libraries]);

  // OS options
  const osOptions = ['windows', 'macos', 'linux'];

  // Apply filters
  const filteredLibraries = useMemo(() => {
    return libraries.filter(lib => {
      // Category filter
      if (selectedCategory && 
          lib.category !== selectedCategory && 
          lib.packageManagerName !== selectedCategory) {
        return false;
      }

      // OS filter
      if (selectedOS && !lib.platforms?.includes(selectedOS)) {
        return false;
      }

      // Supplier filter
      if (selectedSupplier && 
          lib.platform !== selectedSupplier && 
          lib.packageManager !== selectedSupplier) {
        return false;
      }

      return true;
    });
  }, [libraries, selectedCategory, selectedOS, selectedSupplier]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedOS('');
    setSelectedSupplier('');
  };

  const hasActiveFilters = selectedCategory || selectedOS || selectedSupplier;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-3 rounded-xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Library Statistics
                </h1>
                <p className="text-gray-600 text-lg">
                  Real-time analytics from <span className="font-bold text-orange-600">Libraries.io</span> 
                </p>
              </div>
            </div>
            
            <button
              onClick={loadStatisticsData}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Stats
            </button>
          </div>

          {/* Info Banner */}
          {!loading && libraries.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 border-2 border-orange-200 mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="text-gray-700">
                  Showing <span className="font-bold text-orange-600">{filteredLibraries.length}</span> of <span className="font-bold text-orange-600">{libraries.length}</span> libraries
                  {hasActiveFilters && ' (filtered)'}
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          {!loading && libraries.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-900">Filter Statistics</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category / Platform Type
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">All Categories ({categories.length})</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* OS Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating System
                  </label>
                  <select
                    value={selectedOS}
                    onChange={(e) => setSelectedOS(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">All Operating Systems</option>
                    {osOptions.map(os => (
                      <option key={os} value={os}>
                        {os.charAt(0).toUpperCase() + os.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier/Manufacturer Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Manager / Supplier
                  </label>
                  <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">All Suppliers ({suppliers.length})</option>
                    {suppliers.map(sup => (
                      <option key={sup} value={sup}>
                        {sup.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('')} className="hover:bg-blue-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedOS && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      OS: {selectedOS}
                      <button onClick={() => setSelectedOS('')} className="hover:bg-green-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedSupplier && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      Supplier: {selectedSupplier}
                      <button onClick={() => setSelectedSupplier('')} className="hover:bg-purple-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-orange-200">
            <RefreshCw className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Statistics...</h3>
            <p className="text-gray-600 mb-6">
              Fetching real-time data from Libraries.io
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div
                  className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {fetchingDetails || 'Preparing...'}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {progress}% complete
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Statistics</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={loadStatisticsData}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats Content */}
        {!loading && !error && filteredLibraries.length > 0 && (
          <div className="space-y-8">
            <StatCards libraries={filteredLibraries} />
            <CategoryCharts libraries={filteredLibraries} />
            <PlatformCharts libraries={filteredLibraries} />
          </div>
        )}

        {/* No Results After Filtering */}
        {!loading && !error && libraries.length > 0 && filteredLibraries.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-orange-200">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Libraries Match Your Filters</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting or clearing your filters to see results
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && libraries.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-orange-200">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-6">
              Click the refresh button to load statistics
            </p>
            <button
              onClick={loadStatisticsData}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Load Statistics
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;