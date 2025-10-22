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
    if (libIds) {
      const ids = libIds.split(',').map(id => parseInt(id));
      const foundLibs = ids.map(id => allLibraries.find(lib => lib.id === id)).filter(Boolean);
      setLibraries(foundLibs);
    }
  }, [searchParams, allLibraries]);

  if (loading) return <Loading />;

  if (libraries.length < 2) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Enough Libraries to Compare</h2>
        <p className="text-gray-600 mb-6">Please select at least 2 libraries to compare.</p>
        <Link 
          to="/search" 
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <GitCompare className="w-10 h-10" />
            Compare Libraries
          </h1>
          <p className="text-gray-600">Side-by-side comparison of library features and specifications</p>
        </div>

        {/* Library Headers */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className={`grid gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 ${
            libraries.length === 2 ? 'grid-cols-3' : 'grid-cols-4'
          }`}>
            <div className="font-semibold text-gray-700"></div>
            {libraries.map((lib) => (
              <div key={lib.id} className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg inline-block mb-3">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{lib.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 capitalize">{lib.category}</p>
                  <Link
                    to={`/library/${lib.id}`}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <ComparisonTable libraries={libraries} />

        {/* Quick Analysis */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Quick Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Highest Rated</p>
              <p className="text-lg font-semibold text-gray-900">
                {libraries.reduce((prev, current) => 
                  (prev.rating || 0) > (current.rating || 0) ? prev : current
                ).name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Most Downloaded</p>
              <p className="text-lg font-semibold text-gray-900">
                {libraries.reduce((prev, current) => {
                  const prevDownloads = parseInt(prev.downloads?.replace(/\D/g, '') || 0);
                  const currentDownloads = parseInt(current.downloads?.replace(/\D/g, '') || 0);
                  return prevDownloads > currentDownloads ? prev : current;
                }).name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;