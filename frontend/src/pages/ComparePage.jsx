import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import ComparisonTable from '../components/comparison/ComparisonTable';
import Loading from '../components/layout/Loading';
import { ArrowLeft, GitCompare, Package, AlertCircle } from 'lucide-react';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allLibraries, loading } = useLibrary();
  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    const libIds = searchParams.get('libs');
    if (libIds && allLibraries.length > 0) {
      const ids = libIds.split(',').map(id => id.trim());
      const foundLibs = ids
        .map(id => allLibraries.find(lib => lib.id?.toString() === id))
        .filter(Boolean);
      
      console.log('🔍 Comparing libraries:', foundLibs.map(l => l.name));
      setLibraries(foundLibs);
    }
  }, [searchParams, allLibraries]);

  if (loading) return <Loading />;

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
                  {lib.rating && (
                    <div className="text-amber-500 font-bold mb-3">
                      ⭐ {lib.rating}
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
            <div className="bg-white rounded-lg p-5 border border-rose-200 shadow-md">
              <p className="text-sm text-gray-600 mb-2 font-medium">Highest Rated</p>
              <p className="text-xl font-bold text-rose-600">
                {libraries.reduce((prev, current) => 
                  (prev.rating || 0) > (current.rating || 0) ? prev : current
                ).name}
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-orange-200 shadow-md">
              <p className="text-sm text-gray-600 mb-2 font-medium">Most Stars</p>
              <p className="text-xl font-bold text-orange-600">
                {libraries.reduce((prev, current) => 
                  (prev.stars || 0) > (current.stars || 0) ? prev : current
                ).name}
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-amber-200 shadow-md">
              <p className="text-sm text-gray-600 mb-2 font-medium">Most Downloads</p>
              <p className="text-xl font-bold text-amber-600">
                {libraries.reduce((prev, current) => 
                  (prev.downloads || 0) > (current.downloads || 0) ? prev : current
                ).name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;