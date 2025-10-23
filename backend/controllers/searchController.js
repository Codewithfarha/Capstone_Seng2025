const { db } = require('../config/firebase');

const librariesCollection = db.collection('libraries');

// Fuzzy search implementation
const fuzzySearch = (str, pattern) => {
  if (!pattern) return true;
  
  const strLower = str.toLowerCase();
  const patternLower = pattern.toLowerCase();
  
  // Exact match
  if (strLower.includes(patternLower)) return true;
  
  // Fuzzy match
  let patternIdx = 0;
  let strIdx = 0;
  
  while (strIdx < strLower.length && patternIdx < patternLower.length) {
    if (strLower[strIdx] === patternLower[patternIdx]) {
      patternIdx++;
    }
    strIdx++;
  }
  
  return patternIdx === patternLower.length;
};

// Main search controller
const searchLibraries = async (req, res) => {
  try {
    const { 
      query, 
      category, 
      platform, 
      license,
      minStars,
      maxStars,
      sortBy = 'name',
      order = 'asc',
      limit = 50
    } = req.query;

    // Get all libraries (we'll filter in memory for fuzzy search)
    const snapshot = await librariesCollection.get();
    let libraries = [];
    
    snapshot.forEach(doc => {
      libraries.push({ id: doc.id, ...doc.data() });
    });

    // Apply fuzzy search on name and description
    if (query) {
      libraries = libraries.filter(lib => 
        fuzzySearch(lib.name, query) || 
        fuzzySearch(lib.description || '', query) ||
        lib.tags?.some(tag => fuzzySearch(tag, query))
      );
    }

    // Apply filters
    if (category) {
      libraries = libraries.filter(lib => lib.category === category);
    }

    if (platform) {
      libraries = libraries.filter(lib => 
        lib.platforms?.includes(platform)
      );
    }

    if (license) {
      libraries = libraries.filter(lib => lib.license === license);
    }

    if (minStars) {
      libraries = libraries.filter(lib => 
        (lib.stars || 0) >= parseInt(minStars)
      );
    }

    if (maxStars) {
      libraries = libraries.filter(lib => 
        (lib.stars || 0) <= parseInt(maxStars)
      );
    }

    // Sort results
    libraries.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Limit results
    libraries = libraries.slice(0, parseInt(limit));

    res.json({
      success: true,
      count: libraries.length,
      query: query || 'all',
      filters: { category, platform, license, minStars, maxStars },
      data: libraries
    });
  } catch (error) {
    console.error('Error searching libraries:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Search failed',
      message: error.message 
    });
  }
};

// Get autocomplete suggestions
const getAutocomplete = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const snapshot = await librariesCollection.get();
    const suggestions = new Set();

    snapshot.forEach(doc => {
      const lib = doc.data();
      
      // Add library names that match
      if (fuzzySearch(lib.name, query)) {
        suggestions.add(lib.name);
      }

      // Add matching tags
      lib.tags?.forEach(tag => {
        if (fuzzySearch(tag, query)) {
          suggestions.add(tag);
        }
      });
    });

    res.json({
      success: true,
      suggestions: Array.from(suggestions).slice(0, 10)
    });
  } catch (error) {
    console.error('Error getting autocomplete:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Autocomplete failed',
      message: error.message 
    });
  }
};

// Get filter options
const getFilterOptions = async (req, res) => {
  try {
    const snapshot = await librariesCollection.get();
    
    const categories = new Set();
    const platforms = new Set();
    const licenses = new Set();

    snapshot.forEach(doc => {
      const lib = doc.data();
      
      if (lib.category) categories.add(lib.category);
      if (lib.license) licenses.add(lib.license);
      lib.platforms?.forEach(platform => platforms.add(platform));
    });

    res.json({
      success: true,
      data: {
        categories: Array.from(categories).sort(),
        platforms: Array.from(platforms).sort(),
        licenses: Array.from(licenses).sort()
      }
    });
  } catch (error) {
    console.error('Error getting filter options:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get filter options',
      message: error.message 
    });
  }
};

module.exports = {
  searchLibraries,
  getAutocomplete,
  getFilterOptions
};