import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication
      let userData = null;
      
      if (email === 'admin@library.com' && password === 'admin123') {
        userData = {
          id: 1,
          email: email,
          name: 'Admin User',
          role: 'admin'
        };
      } else if (email === 'user@library.com' && password === 'user123') {
        userData = {
          id: 2,
          email: email,
          name: 'Regular User',
          role: 'user'
        };
      } else {
        throw new Error('Invalid credentials');
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, [user]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    updateUser
  };
};

// Hook for protected routes
export const useRequireAuth = (requiredRole = null) => {
  const { user, loading, isAuthenticated } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        setAuthorized(false);
      } else if (requiredRole && user?.role !== requiredRole) {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }
  }, [user, loading, isAuthenticated, requiredRole]);

  return { authorized, loading };
};