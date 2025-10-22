import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Layers, Monitor } from 'lucide-react';

const StatsView = ({ statistics }) => {
  if (!statistics) return null;

  const categoryData = Object.entries(statistics.byCategory || {}).map(([name, value]) => ({ name, value }));
  const platformData = Object.entries(statistics.byPlatform || {}).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0ea5e9', '#a855f7', '#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <Package size={32} className="mb-4" />
          <div className="text-4xl font-bold mb-2">{statistics.total}</div>
          <div className="text-blue-100">Total Libraries</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <Layers size={32} className="mb-4" />
          <div className="text-4xl font-bold mb-2">{Object.keys(statistics.byCategory || {}).length}</div>
          <div className="text-purple-100">Categories</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
          <Monitor size={32} className="mb-4" />
          <div className="text-4xl font-bold mb-2">3</div>
          <div className="text-green-100">Platforms</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Libraries by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Support</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsView;