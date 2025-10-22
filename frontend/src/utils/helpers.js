/**
 * Format large numbers with commas
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toLocaleString();
};

/**
 * Format downloads (e.g., 10M/week, 5K/month)
 */
export const formatDownloads = (downloads) => {
  if (!downloads) return 'N/A';
  return downloads;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Handle Firebase Timestamp
  if (date.toDate) {
    return date.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  return 'N/A';
};

/**
 * Get platform icon color
 */
export const getPlatformColor = (platform) => {
  const colors = {
    Windows: 'bg-blue-100 text-blue-700',
    MacOS: 'bg-gray-100 text-gray-700',
    Linux: 'bg-orange-100 text-orange-700',
  };
  return colors[platform] || 'bg-gray-100 text-gray-700';
};

/**
 * Get category icon color
 */
export const getCategoryColor = (category) => {
  const colors = {
    'Frontend Framework': 'bg-purple-100 text-purple-700',
    'Backend Framework': 'bg-green-100 text-green-700',
    'Database': 'bg-blue-100 text-blue-700',
    'CSS Framework': 'bg-pink-100 text-pink-700',
    'Machine Learning': 'bg-indigo-100 text-indigo-700',
    'Data Science': 'bg-cyan-100 text-cyan-700',
    'DevOps': 'bg-orange-100 text-orange-700',
    'Testing': 'bg-red-100 text-red-700',
    'Utility Library': 'bg-yellow-100 text-yellow-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Download text as file
 */
export const downloadAsFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if user is admin
 */
export const checkAdminStatus = async (user) => {
  if (!user) return false;
  
  try {
    const tokenResult = await user.getIdTokenResult();
    return tokenResult.claims.admin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};