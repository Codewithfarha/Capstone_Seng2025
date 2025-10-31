import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryProvider } from './context/LibraryContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';

// Main Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LibrariesPage from './pages/LibrariesPage';
import LibraryDetailPage from './pages/LibraryDetailPage';
import ComparePage from './pages/ComparePage';
import StatsPage from './pages/StatsPage';
import AdminPage from './pages/AdminPage';

// Check if user is authenticated
const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return user && user !== '{}';
};

// Protected Route - Requires authentication
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
};

// Admin Route - Requires admin role
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.email || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route - Redirects to home if already logged in
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <LibraryProvider>
        <Routes>
          {/* Public Routes - Auth Pages (No Header/Footer) */}
          <Route 
            path="/welcome" 
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />

          {/* Protected Routes - Main App (With Header/Footer) */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen bg-gray-50">
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/libraries" element={<LibrariesPage />} />
                      <Route path="/library/:id" element={<LibraryDetailPage />} />
                      <Route path="/compare" element={<ComparePage />} />
                      <Route path="/stats" element={<StatsPage />} />
                      <Route 
                        path="/admin" 
                        element={
                          <AdminRoute>
                            <AdminPage />
                          </AdminRoute>
                        } 
                      />
                      <Route 
                        path="*" 
                        element={
                          <div className="container mx-auto px-4 py-20 text-center">
                            <h1 className="text-4xl font-bold mb-4 text-gray-900">404 - Page Not Found</h1>
                            <a href="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block">
                              Go Home
                            </a>
                          </div>
                        } 
                      />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </LibraryProvider>
    </Router>
  );
}

export default App;