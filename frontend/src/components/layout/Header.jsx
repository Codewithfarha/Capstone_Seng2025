import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, BarChart3, Menu, X, Package, Shield, User, LogOut, ChevronDown } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/stats', label: 'Statistics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-2 rounded-lg shadow-lg">
              <Package className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">Library Finder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-rose-50 to-orange-50 text-rose-700 font-medium'
                    : 'text-gray-600 hover:bg-amber-50'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            
            {/* Admin Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/admin')
                    ? 'bg-gradient-to-r from-fuchsia-50 to-pink-50 text-fuchsia-700 font-medium'
                    : 'text-gray-600 hover:bg-amber-50'
                }`}
              >
                <Shield size={18} />
                Admin
              </Link>
            )}

            {/* User Dropdown Button */}
            {user.email ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                    <User size={18} />
                  </div>
                  <span className="hidden lg:inline">{user.name || user.email.split('@')[0]}</span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Logout Link */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg">
                        <LogOut size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-600">Logout</p>
                        <p className="text-xs text-gray-500">Sign out of your account</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                  isActive(path) ? 'bg-gradient-to-r from-rose-50 to-orange-50 text-rose-700 font-medium' : 'text-gray-600'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            
            {/* Mobile Admin Link */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                  isActive('/admin') ? 'bg-gradient-to-r from-fuchsia-50 to-pink-50 text-fuchsia-700 font-medium' : 'text-gray-600'
                }`}
              >
                <Shield size={18} />
                Admin
              </Link>
            )}

            {/* Mobile User Section */}
            {user.email ? (
              <div className="mt-2 border-t border-gray-200 pt-2">
                {/* User Info */}
                <div className="px-4 py-2 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg mb-2 mx-4">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user.email}
                  </p>
                </div>

                {/* Mobile Logout */}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg text-center mt-2 font-medium"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;