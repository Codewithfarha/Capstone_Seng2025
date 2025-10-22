import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Code, GitCompare, BarChart3, Zap, Shield, Globe, Package } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Smart Search',
      description: 'Find libraries with fuzzy search, filtering by category, OS, and more',
      color: 'text-blue-500'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Code Examples',
      description: 'View practical code examples for each library in multiple languages',
      color: 'text-green-500'
    },
    {
      icon: <GitCompare className="w-8 h-8" />,
      title: 'Side-by-Side Compare',
      description: 'Compare libraries to make informed decisions for your project',
      color: 'text-purple-500'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Statistics & Analytics',
      description: 'Explore trends and insights across categories and platforms',
      color: 'text-orange-500'
    }
  ];

  const platforms = [
    { name: 'Windows', icon: '🪟', count: '450+' },
    { name: 'macOS', icon: '🍎', count: '420+' },
    { name: 'Linux', icon: '🐧', count: '480+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Package className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover the Perfect
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Library</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your comprehensive platform to find, compare, and analyze software libraries 
            across Windows, macOS, and Linux. Make informed decisions for your next project.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/search" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-lg"
            >
              <Search className="w-5 h-5" />
              Start Searching
            </Link>
            
            <Link 
              to="/stats" 
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 border-2 border-gray-200 flex items-center gap-2 text-lg"
            >
              <BarChart3 className="w-5 h-5" />
              View Statistics
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-3">{platform.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{platform.count}</div>
                <div className="text-gray-600 font-medium">{platform.name} Libraries</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Everything You Need
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Powerful features to streamline your library research
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white text-center">
            <div className="flex flex-col items-center">
              <Zap className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Fast & Accurate</h3>
              <p className="text-blue-100">Instant search results with fuzzy matching</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Trusted Sources</h3>
              <p className="text-blue-100">Data from official repositories and vendors</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Cross-Platform</h3>
              <p className="text-blue-100">Support for Windows, macOS, and Linux</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Library?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of developers making smarter library choices
          </p>
          <Link 
            to="/search" 
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 text-lg"
          >
            <Search className="w-5 h-5" />
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;