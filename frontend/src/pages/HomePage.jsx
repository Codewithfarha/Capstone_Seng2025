import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Code, GitCompare, BarChart3, Zap, Shield, Globe, Package } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Intelligent Discovery',
      description: 'Powerful search engine with advanced filters to locate exactly what your project needs',
      color: 'text-coral-500',
      bg: 'from-coral-50 to-rose-50',
      border: 'border-coral-200'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Ready-to-Use Snippets',
      description: 'Access implementation examples and working code samples for quick integration',
      color: 'text-amber-500',
      bg: 'from-amber-50 to-yellow-50',
      border: 'border-amber-200'
    },
    {
      icon: <GitCompare className="w-8 h-8" />,
      title: 'In-Depth Comparison',
      description: 'Evaluate multiple options head-to-head with detailed feature breakdowns',
      color: 'text-fuchsia-500',
      bg: 'from-fuchsia-50 to-pink-50',
      border: 'border-fuchsia-200'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Data-Driven Insights',
      description: 'Comprehensive metrics and visualizations to understand library ecosystems',
      color: 'text-sky-500',
      bg: 'from-sky-50 to-cyan-50',
      border: 'border-sky-200'
    }
  ];

  const platforms = [
    { name: 'Windows', icon: '🪟', count: '450+' },
    { name: 'macOS', icon: '🍎', count: '420+' },
    { name: 'Linux', icon: '🐧', count: '480+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-4 rounded-2xl shadow-lg">
              <Package className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Explore Powerful
            <span className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent"> Libraries</span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Navigate through an extensive collection of software libraries with intelligent tools 
            designed for modern developers. Research smarter, build faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/search" 
              className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-lg hover:scale-105"
            >
              <Search className="w-5 h-5" />
              Explore Libraries
            </Link>
            
            <Link 
              to="/stats" 
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 border-2 border-orange-200 flex items-center gap-2 text-lg hover:scale-105"
            >
              <BarChart3 className="w-5 h-5" />
              Analytics Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{platform.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent mb-1">{platform.count}</div>
                <div className="text-gray-600 font-medium">{platform.name} Compatible</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Begin Your Search Journey
            </h2>
            <p className="text-orange-50 text-lg mb-8 max-w-2xl mx-auto">
              Unlock access to curated libraries and powerful comparison tools trusted by professional developers
            </p>
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-10 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 text-lg hover:scale-105"
            >
              <Search className="w-5 h-5" />
              Start Exploring
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;