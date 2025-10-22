/**
 * Fuzzy search algorithm
 * Matches characters in order, allowing for typos
 */
export const fuzzyMatch = (text, search) => {
  if (!search || !text) return true;
  
  const searchLower = search.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact substring match
  if (textLower.includes(searchLower)) return true;
  
  // Fuzzy match - characters in order
  let searchIndex = 0;
  for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
    if (textLower[i] === searchLower[searchIndex]) {
      searchIndex++;
    }
  }
  
  return searchIndex === searchLower.length;
};

/**
 * Calculate relevance score for search results
 */
export const calculateRelevance = (library, searchTerm) => {
  if (!searchTerm) return 0;
  
  const searchLower = searchTerm.toLowerCase();
  let score = 0;
  
  // Name match (highest priority)
  if (library.name.toLowerCase() === searchLower) score += 100;
  else if (library.name.toLowerCase().startsWith(searchLower)) score += 50;
  else if (library.name.toLowerCase().includes(searchLower)) score += 25;
  
  // Category match
  if (library.category.toLowerCase().includes(searchLower)) score += 15;
  
  // Description match
  if (library.description.toLowerCase().includes(searchLower)) score += 10;
  
  // Language match
  if (library.language.toLowerCase().includes(searchLower)) score += 5;
  
  return score;
};

/**
 * Filter libraries with fuzzy search
 */
export const fuzzyFilter = (libraries, searchTerm) => {
  if (!searchTerm) return libraries;
  
  return libraries
    .map(lib => ({
      ...lib,
      _score: calculateRelevance(lib, searchTerm)
    }))
    .filter(lib => lib._score > 0)
    .sort((a, b) => b._score - a._score);
};