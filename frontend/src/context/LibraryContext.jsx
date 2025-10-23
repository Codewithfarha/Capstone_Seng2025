import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';

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
  const [allLibraries, setAllLibraries] = useState([]);
  const [filteredLibraries, setFilteredLibraries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fuse.js configuration for fuzzy search
  const fuseOptions = {
    keys: [
      { name: 'name', weight: 3 },           // Name is most important
      { name: 'description', weight: 2 },    // Description second
      { name: 'category', weight: 1.5 },     // Category third
      { name: 'tags', weight: 1 },           // Tags least important
    ],
    threshold: 0.3,              // Lower = more strict (0-1, where 0 is exact match)
    distance: 100,               // How far to search
    minMatchCharLength: 2,       // Minimum characters to match
    includeScore: true,
    ignoreLocation: true,        // Search everywhere in the string
  };

  const fetchLibraries = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.platform && filters.platform !== 'all') params.append('platform', filters.platform.toLowerCase());
      
      const response = await axios.get(`${API_URL}/libraries?${params}`);
      const librariesData = response.data.data || [];
      
      setAllLibraries(librariesData);
      setFilteredLibraries(librariesData);
      
      // Apply fuzzy search if there's a search term
      if (filters.search) {
        applyFuzzySearch(filters.search, librariesData);
      } else {
        setLibraries(librariesData);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching libraries:', err);
      setLibraries([]);
      setAllLibraries([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFuzzySearch = (query, dataToSearch = filteredLibraries) => {
    if (!query || query.trim() === '') {
      setLibraries(dataToSearch);
      return;
    }

    const fuse = new Fuse(dataToSearch, fuseOptions);
    const results = fuse.search(query);
    
    console.log(`🔍 Fuzzy search for "${query}": found ${results.length} results`);
    
    setLibraries(results.map(result => result.item));
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/search/filters`);
      const categoriesData = response.data.data?.categories || [];
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories(['Frontend', 'Backend', 'Database', 'Utility', 'Testing', 'CSS Framework', 'Build Tool', 'Machine Learning', 'Data Science']);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/libraries/stats`);
      const statsData = response.data.data || null;
      setStatistics(statsData);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const getLibraryById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/libraries/${id}`);
      return response.data.data || null;
    } catch (err) {
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLibraries();
    fetchCategories();
    fetchStatistics();
  }, []);

  // Fetch filtered libraries when filters change
  useEffect(() => {
    const filters = {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      platform: selectedPlatform !== 'all' ? selectedPlatform : undefined,
      search: searchTerm || undefined,
    };
    fetchLibraries(filters);
  }, [selectedCategory, selectedPlatform, searchTerm]);

  const value = {
    libraries,
    allLibraries,
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
    fetchLibraries,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};