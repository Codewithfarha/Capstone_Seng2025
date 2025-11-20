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
import UserProfilePage from './pages/UserProfilePage'; // NEW!

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
                      <Route path="/libraries/:id" element={<LibraryDetailPage />} />
                      <Route path="/compare" element={<ComparePage />} />
                      <Route path="/stats" element={<StatsPage />} />
                      <Route path="/profile" element={<UserProfilePage />} /> {/* NEW ROUTE! */}
                      <Route 
                        path="/admin" 
                        element={
                          <AdminRoute>
                            <AdminPage />
                          </AdminRoute>
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