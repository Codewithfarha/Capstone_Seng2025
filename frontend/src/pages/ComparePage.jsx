import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import ComparisonTable from '../components/comparison/ComparisonTable';
import Loading from '../components/layout/Loading';
import { ArrowLeft, GitCompare, Package, AlertCircle, Star, Download, GitBranch } from 'lucide-react';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allLibraries, loading } = useLibrary();
  const [libraries, setLibraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const libIds = searchParams.get('libs');
    if (!libIds) {
      setIsLoading(false);
      return;
    }

    const ids = libIds.split(',').map(id => id.trim());
    
    // Try to get libraries from sessionStorage first (for external libs)
    const storedLibs = sessionStorage.getItem('compareLibraries');
    if (storedLibs) {
      try {
        const parsedLibs = JSON.parse(storedLibs);
        const matchedLibs = ids
          .map(id => parsedLibs.find(lib => lib.id === id))
          .filter(Boolean);
        
        if (matchedLibs.length > 0) {
          console.log('✅ Loaded libraries from sessionStorage:', matchedLibs.map(l => l.name));
          setLibraries(matchedLibs);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing stored libraries:', error);
      }
    }

    // Fallback to context (for Firebase libs)
    if (allLibraries.length > 0) {
      const foundLibs = ids
        .map(id => allLibraries.find(lib => lib.id?.toString() === id))
        .filter(Boolean);
      
      console.log('✅ Loaded libraries from context:', foundLibs.map(l => l?.name || 'Unknown'));
      setLibraries(foundLibs);
    }
    
    setIsLoading(false);
  }, [searchParams, allLibraries]);

  // ✅ Helper function to safely get numeric value
  const getNumericValue = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value.replace(/\D/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // ✅ Helper to format numbers
  const formatNumber = (num) => {
    const value = getNumericValue(num);
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // ✅ Safe comparison helpers
  const getHighestRated = () => {
    return libraries.reduce((prev, current) => {
      const prevRating = prev.rating || 0;
      const currentRating = current.rating || 0;
      return prevRating > currentRating ? prev : current;
    }, libraries[0]);
  };

  const getMostStars = () => {
    return libraries.reduce((prev, current) => {
      const prevStars = getNumericValue(prev.stars);
      const currentStars = getNumericValue(current.stars);
      return prevStars > currentStars ? prev : current;
    }, libraries[0]);
  };

  const getMostDownloads = () => {
    return libraries.reduce((prev, current) => {
      const prevDownloads = getNumericValue(prev.downloads);
      const currentDownloads = getNumericValue(current.downloads);
      return prevDownloads > currentDownloads ? prev : current;
    }, libraries[0]);
  };

  if (loading || isLoading) return <Loading />;

  if (libraries.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto border border-orange-200">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Not Enough Libraries</h2>
            <p className="text-gray-600 mb-8 text-lg">Please select at least 2 libraries to compare.</p>
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Go to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const highestRated = getHighestRated();
  const mostStars = getMostStars();
  const mostDownloads = getMostDownloads();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors font-medium bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-3 rounded-xl shadow-lg">
              <GitCompare className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Compare 
            <span className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent"> Libraries</span>
          </h1>
          <p className="text-xl text-gray-700">Side-by-side comparison of <span className="font-bold text-orange-600">{libraries.length}</span> libraries</p>
        </div>

        {/* Library Headers */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6 border border-orange-200">
          <div className={`grid gap-4 p-6 bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 ${
            libraries.length === 2 ? 'grid-cols-3' : libraries.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
          }`}>
            <div className="font-semibold text-gray-700"></div>
            {libraries.map((lib) => (
              <div key={lib.id} className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-md border border-orange-200 hover:shadow-xl transition-all">
                  <div className="bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-3 rounded-lg inline-block mb-3 shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{lib.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 font-medium">{lib.category}</p>
                  {lib.source && lib.source !== 'firebase' && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-2">
                      {lib.source.toUpperCase()}
                    </span>
                  )}
                  {lib.rating && (
                    <div className="text-amber-500 font-bold mt-2 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-amber-500" />
                      {lib.rating}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <ComparisonTable libraries={libraries} />

        {/* Quick Analysis */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 rounded-xl p-8 border-2 border-amber-300 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📊 Quick Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Highest Rated */}
            <div className="bg-white rounded-lg p-5 border border-rose-200 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <p className="text-sm text-gray-600 font-medium">Highest Rated</p>
              </div>
              <p className="text-xl font-bold text-rose-600 mb-2">
                {highestRated.name}
              </p>
              <p className="text-sm text-gray-500">
                ⭐ {highestRated.rating || 'N/A'}/5.0
              </p>
            </div>

            {/* Most Stars */}
            <div className="bg-white rounded-lg p-5 border border-orange-200 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="w-5 h-5 text-orange-500" />
                <p className="text-sm text-gray-600 font-medium">Most Stars</p>
              </div>
              <p className="text-xl font-bold text-orange-600 mb-2">
                {mostStars.name}
              </p>
              <p className="text-sm text-gray-500">
                ⭐ {formatNumber(mostStars.stars)} stars
              </p>
            </div>

            {/* Most Downloads */}
            <div className="bg-white rounded-lg p-5 border border-amber-200 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Download className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-gray-600 font-medium">Most Downloads</p>
              </div>
              <p className="text-xl font-bold text-amber-600 mb-2">
                {mostDownloads.name}
              </p>
              <p className="text-sm text-gray-500">
                ⬇️ {formatNumber(mostDownloads.downloads)} downloads
              </p>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cross-Platform Support */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Cross-Platform Support</p>
              <div className="space-y-2">
                {libraries.map(lib => (
                  <div key={lib.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{lib.name}</span>
                    <span className="text-sm text-gray-600">
                      {lib.platforms?.length || 0}/3 platforms
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Rank */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Source Rank (Higher is Better)</p>
              <div className="space-y-2">
                {libraries
                  .sort((a, b) => (b.sourceRank || 0) - (a.sourceRank || 0))
                  .map(lib => (
                    <div key={lib.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{lib.name}</span>
                      <span className="text-sm font-bold text-purple-600">
                        {lib.sourceRank || 'N/A'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;