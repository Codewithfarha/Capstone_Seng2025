import { useState, useCallback } from 'react';
import { debounce } from '../utils/helpers';
import { fuzzyFilter } from '../utils/fuzzySearch';

export const useSearch = (items, searchFields = ['name', 'description']) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  const performSearch = useCallback(
    debounce((term) => {
      if (!term) {
        setFilteredItems(items);
        return;
      }

      const results = fuzzyFilter(items, term);
      setFilteredItems(results);
    }, 300),
    [items]
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    performSearch(term);
  };

  return {
    searchTerm,
    filteredItems,
    handleSearch,
    clearSearch: () => handleSearch(''),
  };
};