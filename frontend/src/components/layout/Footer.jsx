import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Library Finder</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your comprehensive platform for discovering, comparing, and analyzing software
              libraries. Built for engineers, by engineers.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 fill-red-500" />
              <span>using React + Firebase</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary-400 transition-colors">
                  Search Libraries
                </Link>
              </li>
              <li>
                <Link to="/stats" className="hover:text-primary-400 transition-colors">
                  Statistics
                </Link>
              </li>
            
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  Firebase
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  React
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://tailwindcss.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  Tailwind CSS
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Github size={14} />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Library Finder. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>100 Libraries</span>
            <span>•</span>
            <span>9 Categories</span>
            <span>•</span>
            <span>3 Platforms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;