import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PlatformCharts = ({ libraries }) => {
  const platforms = ['windows', 'macos', 'linux'];
  
  // Calculate platform statistics
  const platformStats = platforms.map(platform => {
    const count = libraries.filter(lib => lib.platforms?.includes(platform)).length;
    const percentage = ((count / libraries.length) * 100).toFixed(1);
    return {
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      libraries: count,
      percentage: parseFloat(percentage),
      icon: platform === 'windows' ? '🪟' : platform === 'macos' ? '🍎' : '🐧'
    };
  });

  // Multi-platform support analysis
  const multiPlatformData = [
    {
      support: 'Single Platform',
      count: libraries.filter(lib => lib.platforms?.length === 1).length
    },
    {
      support: 'Two Platforms',
      count: libraries.filter(lib => lib.platforms?.length === 2).length
    },
    {
      support: 'All Platforms',
      count: libraries.filter(lib => lib.platforms?.length === 3).length
    }
  ];

  // Category by platform analysis
  const categories = [...new Set(libraries.map(lib => lib.category))];
  const categoryPlatformData = categories.map(category => {
    const categoryLibs = libraries.filter(lib => lib.category === category);
    const data = {
      category: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' & ')
    };
    
    platforms.forEach(platform => {
      data[platform] = categoryLibs.filter(lib => lib.platforms?.includes(platform)).length;
    });
    
    return data;
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].payload.platform || payload[0].payload.support}</p>
          <p className="text-sm text-gray-600">
            Libraries: <span className="font-bold text-blue-600">{payload[0].value}</span>
          </p>
          {payload[0].payload.percentage && (
            <p className="text-xs text-gray-500">
              {payload[0].payload.percentage}% coverage
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Platform Distribution Bar Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={platformStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="platform" tick={{ fontSize: 14 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="libraries" 
              fill="#10b981" 
              radius={[8, 8, 0, 0]}
              name="Number of Libraries"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platformStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{stat.icon}</span>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{stat.libraries}</div>
                <div className="text-sm text-gray-500">libraries</div>
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{stat.platform}</h4>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">{stat.percentage}% coverage</p>
          </div>
        ))}
      </div>

      {/* Multi-Platform Support */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Multi-Platform Support</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={multiPlatformData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="support" type="category" width={120} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#8b5cf6" 
              radius={[0, 8, 8, 0]}
              name="Libraries"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category by Platform */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Categories by Platform</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categoryPlatformData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="category" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fontSize: 11 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="windows" stackId="a" fill="#0ea5e9" name="Windows" />
            <Bar dataKey="macos" stackId="a" fill="#f59e0b" name="macOS" />
            <Bar dataKey="linux" stackId="a" fill="#10b981" name="Linux" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Compatibility Matrix */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Compatibility Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Platform Combination</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Libraries</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">🪟 🍎 🐧 All Three</td>
                <td className="px-4 py-3 text-center font-bold text-green-600">
                  {libraries.filter(lib => lib.platforms?.length === 3).length}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {((libraries.filter(lib => lib.platforms?.length === 3).length / libraries.length) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">🪟 🍎 Windows & macOS</td>
                <td className="px-4 py-3 text-center font-bold text-blue-600">
                  {libraries.filter(lib => 
                    lib.platforms?.includes('windows') && 
                    lib.platforms?.includes('macos') && 
                    lib.platforms?.length === 2
                  ).length}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {((libraries.filter(lib => 
                    lib.platforms?.includes('windows') && 
                    lib.platforms?.includes('macos') && 
                    lib.platforms?.length === 2
                  ).length / libraries.length) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">🪟 🐧 Windows & Linux</td>
                <td className="px-4 py-3 text-center font-bold text-purple-600">
                  {libraries.filter(lib => 
                    lib.platforms?.includes('windows') && 
                    lib.platforms?.includes('linux') && 
                    lib.platforms?.length === 2
                  ).length}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {((libraries.filter(lib => 
                    lib.platforms?.includes('windows') && 
                    lib.platforms?.includes('linux') && 
                    lib.platforms?.length === 2
                  ).length / libraries.length) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">🍎 🐧 macOS & Linux</td>
                <td className="px-4 py-3 text-center font-bold text-orange-600">
                  {libraries.filter(lib => 
                    lib.platforms?.includes('macos') && 
                    lib.platforms?.includes('linux') && 
                    lib.platforms?.length === 2
                  ).length}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {((libraries.filter(lib => 
                    lib.platforms?.includes('macos') && 
                    lib.platforms?.includes('linux') && 
                    lib.platforms?.length === 2
                  ).length / libraries.length) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlatformCharts;