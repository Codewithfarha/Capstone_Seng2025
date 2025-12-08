import React, { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import SearchResults from '../components/search/SearchResults';
import SearchHistory from '../components/search/SearchHistory';
import { Filter, Grid, List, Search, Loader, RefreshCw, ChevronDown } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Popular search terms to get diverse packages from Libraries.io
const POPULAR_TERMS = [
  'react', 'vue', 'angular', 'svelte', 'preact',
  'express', 'fastify', 'koa', 'django', 'flask',
  'lodash', 'underscore', 'ramda', 'axios', 'requests',
  'webpack', 'vite', 'rollup', 'parcel', 'esbuild',
  'jest', 'mocha', 'pytest', 'cypress', 'playwright',
  'typescript', 'babel', 'eslint', 'prettier', 'black',
  'redux', 'mobx', 'zustand', 'recoil', 'vuex',
  'next', 'nuxt', 'gatsby', 'remix', 'astro',
  'tailwind', 'bootstrap', 'material-ui', 'ant-design', 'chakra-ui',
  'mongoose', 'sequelize', 'prisma', 'typeorm', 'sqlalchemy',
  'socket.io', 'ws', 'pusher', 'redis', 'celery',
  'passport', 'bcrypt', 'jsonwebtoken', 'jwt', 'oauth',
  'dotenv', 'joi', 'yup', 'zod', 'pydantic',
  'moment', 'dayjs', 'date-fns', 'luxon', 'arrow',
  'cheerio', 'jsdom', 'puppeteer', 'beautifulsoup', 'scrapy',
  'multer', 'sharp', 'pillow', 'opencv', 'imagemagick',
  'nodemailer', 'sendgrid', 'mailgun', 'flask-mail', 'smtp',
  'stripe', 'paypal', 'square', 'braintree', 'shopify',
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas',
  'numpy', 'matplotlib', 'seaborn', 'plotly', 'bokeh'
];

// Map category names to Libraries.io platform codes
const CATEGORY_TO_PLATFORM = {
  'JavaScript': 'npm',
  'Python': 'pypi',
  'Java': 'maven',
  'Ruby': 'rubygems',
  'PHP': 'packagist',
  'Go': 'go',
  'Rust': 'cargo',
  '.NET': 'nuget',
  'Swift': 'swift',
  'Dart': 'pub',
  'Elixir': 'hex',
  'Haskell': 'hackage',
  'Clojure': 'clojars',
  'R': 'cran',
  'Perl': 'cpan',
  'Elm': 'elm'
};

const SearchPage = () => {
  // Search History ref
  const searchHistoryRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOS, setSelectedOS] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [isUserSearch, setIsUserSearch] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResultsPage, setSearchResultsPage] = useState(1);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(''); // For search history

  // Auto-load packages on page mount
  useEffect(() => {
    if (!hasSearched) {
      console.log(' Auto-loading initial packages from Libraries.io...');
      loadInitialPackages();
    }
  }, []);

  // Reload results when filters change
  useEffect(() => {
    if (hasSearched) {
      console.log(' Filters changed, reloading results...');
      if (isUserSearch && userSearchQuery) {
        // Reload user search with filters
        searchExternal(userSearchQuery);
      } else {
        // Reload initial packages with filters
        loadInitialPackages();
      }
    }
  }, [selectedCategory, selectedOS]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedOS('all');
    setMinRating(0);
  };

  //  Fetch packages with platform/OS filter support
  const fetchLibrariesIO = async (searchTerm, page = 1) => {
    try {
      console.log(' Fetching packages for:', searchTerm, 'Page:', page);
      
      const params = {
        query: searchTerm,
        limit: 20,
        page: page
      };

      // Add platform filter if category is selected
      if (selectedCategory !== 'all' && CATEGORY_TO_PLATFORM[selectedCategory]) {
        params.platforms = CATEGORY_TO_PLATFORM[selectedCategory];
        console.log(' Filtering by platform:', params.platforms);
      }
      
      const response = await axios.get(`${API_URL}/external/search-external`, {
        params,
        timeout: 15000
      });
      
      let results = response.data?.data || [];
      console.log(' Fetched:', results.length, 'packages from page', page);
      
      //  Apply OS filter client-side (since API doesn't support it)
      if (selectedOS !== 'all') {
        results = results.filter(lib => 
          lib.platforms && lib.platforms.includes(selectedOS)
        );
        console.log(' After OS filter:', results.length, 'packages');
      }
      
      return results;
    } catch (error) {
      console.error('Error fetching packages:', error.message);
      return [];
    }
  };

  // Load initial batch of packages
  const loadInitialPackages = async () => {
    console.log('Loading initial packages from Libraries.io...');
    setLoading(true);
    setHasSearched(true);
    setIsUserSearch(false);
    setUserSearchQuery('');
    setCurrentSearchQuery('');
    setSearchResultsPage(1);
    
    try {
      //  Load more terms if filtering by category to get enough results
      const termsToLoad = selectedCategory !== 'all' ? 10 : 5;
      
      // Load first N terms in parallel for speed
      const promises = POPULAR_TERMS.slice(0, termsToLoad).map(term => fetchLibrariesIO(term));
      const results = await Promise.all(promises);
      
      // Flatten and deduplicate
      const allPackages = results.flat();
      const uniquePackages = deduplicatePackages(allPackages);
      
      console.log(' Initial load complete:', uniquePackages.length, 'unique packages');
      setLibraries(uniquePackages);
      setCurrentTermIndex(termsToLoad);
    } catch (error) {
      console.error(' Error in initial load:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more packages (for browsing mode)
  const loadMorePackages = async () => {
    if (currentTermIndex >= POPULAR_TERMS.length) {
      console.log(' No more terms to load');
      alert('All available packages loaded!');
      return;
    }

    console.log('Loading more packages... (starting from index', currentTermIndex, ')');
    setLoadMoreLoading(true);
    
    try {
      // Load next 5 terms
      const endIndex = Math.min(currentTermIndex + 5, POPULAR_TERMS.length);
      const termsToLoad = POPULAR_TERMS.slice(currentTermIndex, endIndex);
      
      console.log(' Loading terms:', termsToLoad);
      
      const promises = termsToLoad.map(term => fetchLibrariesIO(term));
      const results = await Promise.all(promises);
      
      // Flatten results
      const newPackages = results.flat();
      console.log('Fetched', newPackages.length, 'new packages');
      
      // Combine with existing and deduplicate
      const allPackages = [...libraries, ...newPackages];
      const uniquePackages = deduplicatePackages(allPackages);
      
      const addedCount = uniquePackages.length - libraries.length;
      console.log(' Added', addedCount, 'unique packages. Total:', uniquePackages.length);
      
      setLibraries(uniquePackages);
      setCurrentTermIndex(endIndex);
    } catch (error) {
      console.error(' Error loading more:', error);
    } finally {
      setLoadMoreLoading(false);
    }
  };

  // Load more search results with proper pagination
  const loadMoreSearchResults = async () => {
    if (!userSearchQuery) return;
    
    const nextPage = searchResultsPage + 1;
    console.log(' Loading page', nextPage, 'for search:', userSearchQuery);
    setLoadMoreLoading(true);
    
    try {
      // Fetch the NEXT page of results (page 2, 3, 4, etc.)
      const newResults = await fetchLibrariesIO(userSearchQuery, nextPage);
      
      console.log(' Fetched', newResults.length, 'results from page', nextPage);
      
      if (newResults.length > 0) {
        // Combine with existing and deduplicate
        const allPackages = [...libraries, ...newResults];
        const uniquePackages = deduplicatePackages(allPackages);
        
        const addedCount = uniquePackages.length - libraries.length;
        
        if (addedCount > 0) {
          setLibraries(uniquePackages);
          setSearchResultsPage(nextPage);
          console.log(' Added', addedCount, 'new results from page', nextPage, '. Total:', uniquePackages.length);
        } else {
          console.log(' No new unique results (all duplicates)');
          alert('No more new results available. All results have been loaded!');
        }
      } else {
        console.log(' No more results available');
        alert('No more results found for this search!');
      }
    } catch (error) {
      console.error(' Error loading more search results:', error);
    } finally {
      setLoadMoreLoading(false);
    }
  };

  // Deduplicate packages by ID
  const deduplicatePackages = (packages) => {
    const seen = new Set();
    return packages.filter(pkg => {
      if (seen.has(pkg.id)) {
        return false;
      }
      seen.add(pkg.id);
      return true;
    });
  };

  // Search Libraries.io (when user types and searches)
  const searchExternal = async (query) => {
    console.log(' User search with query:', query);
    
    if (!query || query.trim() === '') {
      // Empty search - reload initial packages
      console.log(' Empty search, reloading initial packages');
      setLibraries([]);
      setCurrentTermIndex(0);
      setIsUserSearch(false);
      setUserSearchQuery('');
      setCurrentSearchQuery('');
      setSearchResultsPage(1);
      loadInitialPackages();
      return;
    }
    
    //  Add to search history when user clicks Search button
    setCurrentSearchQuery(query.trim());
    if (searchHistoryRef.current) {
      searchHistoryRef.current.addToRecent(query.trim());
    }
    
    setLoading(true);
    setHasSearched(true);
    setIsUserSearch(true);
    setUserSearchQuery(query);
    setSearchResultsPage(1);
    
    try {
      const results = await fetchLibrariesIO(query);
      setLibraries(results);
      console.log('User search complete:', results.length, 'results');
    } catch (error) {
      console.error(' Error in user search:', error);
      setLibraries([]);
    } finally {
      setLoading(false);
    }
  };

  // Can load more in BOTH browse and search mode
  const canLoadMore = !loading && 
                      !loadMoreLoading && 
                      libraries.length > 0 &&
                      (isUserSearch || currentTermIndex < POPULAR_TERMS.length);

  console.log(' Render state:', {
    libraryCount: libraries.length,
    loading,
    canLoadMore,
    currentTermIndex,
    isUserSearch,
    userSearchQuery,
    searchResultsPage,
    selectedCategory,
    selectedOS
  });

  // Only filter by rating client-side (category and OS are handled server-side now)
  const filteredLibraries = libraries.filter(lib => {
    const ratingMatch = !lib.rating || (lib.rating >= minRating);
    return ratingMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-3 rounded-xl shadow-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Search 
            <span className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent"> Libraries</span>
          </h1>
          <p className="text-xl text-gray-700">
            Discover from <span className="font-bold text-orange-600">{libraries.length}</span> libraries across <span className="font-bold text-rose-600">40+</span> platforms
          </p>
          <p className="text-sm text-gray-600 mt-2">
            🌐 Powered by <a href="https://libraries.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Libraries.io</a> - 36 million+ open source packages
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            onExternalSearch={searchExternal}
            searchSource="libraries"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            {viewMode === 'grid' ? 'List' : 'Grid'} View
          </button>
          
          {/* Search History Component */}
          <SearchHistory 
            ref={searchHistoryRef}
            onSearchSelect={searchExternal}
            currentSearch={currentSearchQuery}
          />
          
          {/* Refresh Button */}
          <button
            onClick={() => {
              setLibraries([]);
              setCurrentTermIndex(0);
              setIsUserSearch(false);
              setUserSearchQuery('');
              setCurrentSearchQuery('');
              setSearchResultsPage(1);
              clearFilters();
              loadInitialPackages();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:shadow-md transition-all font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="flex gap-6">
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <FilterPanel
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedOS={selectedOS}
                setSelectedOS={setSelectedOS}
                minRating={minRating}
                setMinRating={setMinRating}
                onClearFilters={clearFilters}
                showFilters={showFilters}
              />
            </div>
          )}
          
          <div className="flex-1">
            <SearchResults
              libraries={filteredLibraries}
              loading={loading}
              viewMode={viewMode}
            />

            {/* Load More Button - Works for BOTH browse and search */}
            {canLoadMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={isUserSearch ? loadMoreSearchResults : loadMorePackages}
                  disabled={loadMoreLoading}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {loadMoreLoading ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Loading More Packages...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-6 h-6" />
                      Load More Libraries
                    </>
                  )}
                </button>
                {isUserSearch ? (
                  <p className="text-gray-600 mt-3 font-medium">
                    Showing {libraries.length} results for "<span className="text-orange-600 font-bold">{userSearchQuery}</span>" • Page {searchResultsPage} • Click to load page {searchResultsPage + 1}
                  </p>
                ) : (
                  <p className="text-gray-600 mt-3 font-medium">
                    Showing {libraries.length} libraries • {POPULAR_TERMS.length - currentTermIndex} more batches available
                  </p>
                )}
              </div>
            )}

            {/* No Results Message */}
            {!loading && libraries.length === 0 && hasSearched && (
              <div className="text-center py-12">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Libraries Found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;