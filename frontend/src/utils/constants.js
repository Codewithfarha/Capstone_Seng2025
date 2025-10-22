export const PLATFORMS = ['Windows', 'MacOS', 'Linux'];

export const CATEGORIES = [
  'Frontend Framework',
  'Backend Framework',
  'Database',
  'CSS Framework',
  'Machine Learning',
  'Data Science',
  'DevOps',
  'Testing',
  'Utility Library',
];

export const LICENSES = [
  'MIT',
  'Apache 2.0',
  'GPL',
  'BSD',
  'ISC',
  'Other',
];

export const COST_TYPES = ['Free', 'Paid'];

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'stars', label: 'Most Popular' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'updated', label: 'Recently Updated' },
];

export const ITEMS_PER_PAGE = 12;

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const APP_NAME = process.env.REACT_APP_NAME || 'Library Finder';
export const APP_VERSION = process.env.REACT_APP_VERSION || '1.0.0';