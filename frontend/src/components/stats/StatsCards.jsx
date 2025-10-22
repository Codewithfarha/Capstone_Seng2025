import React from 'react';
import { 
  Package, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  Star, 
  Download,
  Code,
  Shield
} from 'lucide-react';

const StatCards = ({ libraries }) => {
  // Calculate statistics
  const totalLibraries = libraries.length;
  const categories = new Set(libraries.map(lib => lib.category));
  const totalCategories = categories.size;
  
  const platforms = ['windows', 'macos', 'linux'];
  const totalPlatforms = platforms.length;
  
  const freeLibraries = libraries.filter(lib => 
    lib.cost?.toLowerCase() === 'free'
  ).length;
  const freePercentage = ((freeLibraries / totalLibraries) * 100).toFixed(1);
  
  const totalDownloads = libraries.reduce((sum, lib) => {
    const downloads = lib.downloads?.replace(/\D/g, '') || '0';
    return sum + parseInt(downloads);
  }, 0);
  
  const avgRating = libraries.reduce((sum, lib) => 
    sum + (lib.rating || 0), 0
  ) / totalLibraries || 0;
  
  const crossPlatformLibs = libraries.filter(lib => 
    lib.platforms?.length >= 2
  ).length;
  const crossPlatformPercentage = ((crossPlatformLibs / totalLibraries) * 100).toFixed(1);
  
  const recentlyUpdated = libraries.filter(lib => {
    if (!lib.lastUpdated) return false;
    const lastUpdate = new Date(lib.lastUpdated);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return lastUpdate >= threeMonthsAgo;
  }).length;

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {trend > 0 ? `+${trend}%` : trend === 0 ? 'Stable' : `${trend}%`}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );

  const stats = [
    {
      icon: Package,
      title: 'Total Libraries',
      value: totalLibraries,
      subtitle: `Across ${totalCategories} categories`,
      color: 'bg-blue-100 text-blue-600',
      trend: null
    },
    {
      icon: BarChart3,
      title: 'Categories',
      value: totalCategories,
      subtitle: 'Diverse library types',
      color: 'bg-purple-100 text-purple-600',
      trend: null
    },
    {
      icon: Globe,
      title: 'Platforms',
      value: totalPlatforms,
      subtitle: 'Windows, macOS, Linux',
      color: 'bg-green-100 text-green-600',
      trend: null
    },
    {
      icon: TrendingUp,
      title: 'Free Libraries',
      value: `${freePercentage}%`,
      subtitle: `${freeLibraries} out of ${totalLibraries}`,
      color: 'bg-emerald-100 text-emerald-600',
      trend: 0
    },
    {
      icon: Download,
      title: 'Total Downloads',
      value: formatNumber(totalDownloads),
      subtitle: 'Combined across all libraries',
      color: 'bg-orange-100 text-orange-600',
      trend: 12
    },
    {
      icon: Star,
      title: 'Average Rating',
      value: avgRating.toFixed(1),
      subtitle: 'Out of 5.0 stars',
      color: 'bg-yellow-100 text-yellow-600',
      trend: null
    },
    {
      icon: Code,
      title: 'Cross-Platform',
      value: `${crossPlatformPercentage}%`,
      subtitle: `${crossPlatformLibs} support 2+ platforms`,
      color: 'bg-indigo-100 text-indigo-600',
      trend: 8
    },
    {
      icon: Shield,
      title: 'Recently Updated',
      value: recentlyUpdated,
      subtitle: 'Updated in last 3 months',
      color: 'bg-pink-100 text-pink-600',
      trend: 5
    }
  ];

  return (
    <div>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Most Popular Category */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h4 className="text-sm font-medium opacity-90 mb-2">Most Popular Category</h4>
          <p className="text-3xl font-bold mb-1">
            {Array.from(categories).reduce((max, cat) => {
              const count = libraries.filter(lib => lib.category === cat).length;
              const maxCount = libraries.filter(lib => lib.category === max).length;
              return count > maxCount ? cat : max;
            }, Array.from(categories)[0]).charAt(0).toUpperCase() + 
            Array.from(categories).reduce((max, cat) => {
              const count = libraries.filter(lib => lib.category === cat).length;
              const maxCount = libraries.filter(lib => lib.category === max).length;
              return count > maxCount ? cat : max;
            }, Array.from(categories)[0]).slice(1)}
          </p>
          <p className="text-sm opacity-75">
            {libraries.filter(lib => lib.category === Array.from(categories).reduce((max, cat) => {
              const count = libraries.filter(lib => lib.category === cat).length;
              const maxCount = libraries.filter(lib => lib.category === max).length;
              return count > maxCount ? cat : max;
            }, Array.from(categories)[0])).length} libraries
          </p>
        </div>

        {/* Highest Rated */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h4 className="text-sm font-medium opacity-90 mb-2">Highest Rated Library</h4>
          <p className="text-2xl font-bold mb-1 truncate">
            {libraries.reduce((max, lib) => 
              (lib.rating || 0) > (max.rating || 0) ? lib : max
            , libraries[0])?.name}
          </p>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-lg font-semibold">
              {libraries.reduce((max, lib) => 
                (lib.rating || 0) > (max.rating || 0) ? lib : max
              , libraries[0])?.rating || 'N/A'}
            </span>
          </div>
        </div>

        {/* Most Downloaded */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <h4 className="text-sm font-medium opacity-90 mb-2">Most Downloaded</h4>
          <p className="text-2xl font-bold mb-1 truncate">
            {libraries.reduce((max, lib) => {
              const libDownloads = parseInt(lib.downloads?.replace(/\D/g, '') || 0);
              const maxDownloads = parseInt(max.downloads?.replace(/\D/g, '') || 0);
              return libDownloads > maxDownloads ? lib : max;
            }, libraries[0])?.name}
          </p>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="text-lg font-semibold">
              {libraries.reduce((max, lib) => {
                const libDownloads = parseInt(lib.downloads?.replace(/\D/g, '') || 0);
                const maxDownloads = parseInt(max.downloads?.replace(/\D/g, '') || 0);
                return libDownloads > maxDownloads ? lib : max;
              }, libraries[0])?.downloads || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;