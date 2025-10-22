import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Package, 
  BarChart3, 
  Settings,
  GitCompare,
  Shield,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Home',
      description: 'Dashboard overview'
    },
    { 
      path: '/search', 
      icon: Search, 
      label: 'Search',
      description: 'Find libraries'
    },
    { 
      path: '/libraries', 
      icon: Package, 
      label: 'Libraries',
      description: 'Browse all'
    },
    { 
      path: '/compare', 
      icon: GitCompare, 
      label: 'Compare',
      description: 'Side by side'
    },
    { 
      path: '/stats', 
      icon: BarChart3, 
      label: 'Statistics',
      description: 'Analytics'
    },
    { 
      path: '/admin', 
      icon: Shield, 
      label: 'Admin',
      description: 'Manage content'
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } min-h-screen sticky top-0 shadow-xl`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">LibFinder</h2>
                <p className="text-xs text-gray-400">Discovery Tool</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${
                active ? 'scale-110' : 'group-hover:scale-110'
              } transition-transform`} />
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-75 truncate">
                    {item.description}
                  </div>
                </div>
              )}

              {!isCollapsed && active && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Quick Stats</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Libraries</span>
                <span className="font-semibold">450+</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Categories</span>
                <span className="font-semibold">8</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;