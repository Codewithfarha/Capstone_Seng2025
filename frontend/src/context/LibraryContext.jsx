import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LibraryContext = createContext();

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
};

export const LibraryProvider = ({ children }) => {
  const [libraries, setLibraries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLibraries = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`${API_URL}/libraries?${params}`);
      setLibraries(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/libraries/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/libraries/stats`);
      setStatistics(response.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const getLibraryById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/libraries/${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchLibraries();
    fetchCategories();
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchLibraries({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      platform: selectedPlatform !== 'all' ? selectedPlatform : undefined,
      search: searchTerm || undefined,
    });
  }, [selectedCategory, selectedPlatform, searchTerm]);

  const value = {
    libraries,
    categories,
    statistics,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    selectedPlatform,
    setSelectedPlatform,
    searchTerm,
    setSearchTerm,
    getLibraryById,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};