import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import StatCards from '../components/stats/StatCards';
import CategoryCharts from '../components/stats/CategoryCharts';
import PlatformCharts from '../components/stats/PlatformCharts';
import Loading from '../components/layout/Loading';
import { BarChart3 } from 'lucide-react';

const StatsPage = () => {
  const { allLibraries, loading, error } = useLibrary();

  if (loading) return <Loading />;
  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BarChart3 className="w-10 h-10" />
            Library Statistics
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive analytics and insights across all platforms
          </p>
        </div>

        <div className="space-y-8">
          <StatCards libraries={allLibraries} />
          <CategoryCharts libraries={allLibraries} />
          <PlatformCharts libraries={allLibraries} />
        </div>
      </div>
    </div>
  );
};

export default StatsPage;