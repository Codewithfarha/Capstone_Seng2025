import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ArrowRight, 
  Search, 
  Code,
  Sparkles,
  Target,
  Layers,
  TrendingUp
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Transparent with backdrop */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-rose-500 to-amber-500 p-2 rounded-lg shadow-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                LibraryFinder
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                className="px-5 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <div className="pt-24 pb-20 bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-200 mb-6">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-gray-700">Discover Libraries Effortlessly</span>
              </div>
              
              <h1 className="text-6xl font-black text-gray-900 mb-6 leading-tight">
                Search smarter,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-600">
                 not longer
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                The fastest way to discover, compare, and integrate the perfect libraries for your development projects.
              </p>

              <div className="flex items-center gap-4 mb-8">
                <Link 
                  to="/signup" 
                  className="group flex items-center gap-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                >
                  Start Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:shadow-md transition-all border-2 border-gray-200"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl border-2 border-orange-200">
                <div className="space-y-4">
                  {/* Search Bar Visual */}
                  <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-4 rounded-xl border-2 border-orange-200">
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-orange-500" />
                      <div className="flex-1 h-3 bg-orange-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Result Cards */}
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-xl border-2 border-rose-200">
                    <div className="flex items-start gap-3">
                      <div className="bg-rose-500 p-2 rounded-lg">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-rose-300 rounded w-3/4"></div>
                        <div className="h-2 bg-rose-200 rounded w-full"></div>
                        <div className="h-2 bg-rose-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-xl border-2 border-amber-200">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-500 p-2 rounded-lg">
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-amber-300 rounded w-2/3"></div>
                        <div className="h-2 bg-amber-200 rounded w-full"></div>
                        <div className="h-2 bg-amber-200 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-200">
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-500 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-orange-300 rounded w-1/2"></div>
                        <div className="h-2 bg-orange-200 rounded w-full"></div>
                        <div className="h-2 bg-orange-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-rose-500 to-amber-500 p-2 rounded-lg">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">LibraryFinder</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-8 text-sm text-gray-400">
              <Link to="#" className="hover:text-white transition-colors">Features</Link>
              <Link to="#" className="hover:text-white transition-colors">About</Link>
              <Link to="#" className="hover:text-white transition-colors">Contact</Link>
              <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © 2025 LibraryFinder
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;