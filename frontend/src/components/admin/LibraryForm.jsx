import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';

const LibraryForm = ({ library, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'utility',
    description: '',
    version: '1.0.0',
    platforms: [],
    cost: 'Free',
    license: 'MIT',
    website: '',
    repository: '',
    dependencies: '',
    rating: 0,
    downloads: '0',
    size: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    maintainers: '0',
    features: '',
    codeExamples: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (library) {
      setFormData({
        ...library,
        platforms: library.platforms || [],
        dependencies: Array.isArray(library.dependencies) 
          ? library.dependencies.join(', ') 
          : '',
        features: Array.isArray(library.features) 
          ? library.features.join('\n') 
          : '',
        codeExamples: ''
      });
    }
  }, [library]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
    // Clear platform error
    if (errors.platforms) {
      setErrors(prev => ({ ...prev, platforms: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = 'Select at least one platform';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const libraryData = {
        ...formData,
        platforms: formData.platforms,
        dependencies: formData.dependencies
          .split(',')
          .map(d => d.trim())
          .filter(Boolean),
        features: formData.features
          .split('\n')
          .filter(Boolean),
        rating: parseFloat(formData.rating) || 0
      };

      const url = library 
        ? `http://localhost:5000/api/libraries/${library.id}`
        : 'http://localhost:5000/api/libraries';
      
      const method = library ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(libraryData)
      });

      if (response.ok) {
        onSuccess();
      } else {
        throw new Error('Failed to save library');
      }
    } catch (error) {
      console.error('Error saving library:', error);
      setErrors({ submit: 'Failed to save library. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const FormField = ({ label, name, type = 'text', required = false, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border ${
            errors[name] ? 'border-red-300' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border ${
            errors[name] ? 'border-red-300' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          {...props}
        >
          {props.children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border ${
            errors[name] ? 'border-red-300' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          {...props}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          {library ? 'Edit Library' : 'Add New Library'}
        </h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <span className="text-red-700">{errors.submit}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <FormField
            label="Library Name"
            name="name"
            required
            placeholder="e.g., React"
          />

          <FormField
            label="Category"
            name="category"
            type="select"
            required
          >
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="utility">Utility</option>
            <option value="testing">Testing</option>
            <option value="security">Security</option>
            <option value="ml-ai">ML & AI</option>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Description"
              name="description"
              type="textarea"
              required
              rows="3"
              placeholder="Brief description of the library..."
            />
          </div>

          {/* Version & License */}
          <FormField
            label="Version"
            name="version"
            placeholder="e.g., 1.0.0"
          />

          <FormField
            label="License"
            name="license"
            placeholder="e.g., MIT"
          />

          {/* Platforms */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platforms <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {['windows', 'macos', 'linux'].map(platform => (
                <label key={platform} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={() => handlePlatformToggle(platform)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 capitalize">{platform}</span>
                </label>
              ))}
            </div>
            {errors.platforms && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.platforms}
              </p>
            )}
          </div>

          {/* Cost */}
          <FormField
            label="Cost"
            name="cost"
            type="select"
          >
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
            <option value="Freemium">Freemium</option>
          </FormField>

          <FormField
            label="Rating (0-5)"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="e.g., 4.5"
          />

          {/* Links */}
          <FormField
            label="Website URL"
            name="website"
            type="url"
            placeholder="https://example.com"
          />

          <FormField
            label="Repository URL"
            name="repository"
            type="url"
            placeholder="https://github.com/..."
          />

          {/* Stats */}
          <FormField
            label="Downloads"
            name="downloads"
            placeholder="e.g., 10M+"
          />

          <FormField
            label="Size"
            name="size"
            placeholder="e.g., 2.5 MB"
          />

          <FormField
            label="Maintainers"
            name="maintainers"
            placeholder="e.g., 100+"
          />

          <FormField
            label="Last Updated"
            name="lastUpdated"
            type="date"
          />

          {/* Dependencies */}
          <div className="md:col-span-2">
            <FormField
              label="Dependencies (comma-separated)"
              name="dependencies"
              placeholder="e.g., react-dom, prop-types, lodash"
            />
          </div>

          {/* Features */}
          <div className="md:col-span-2">
            <FormField
              label="Key Features (one per line)"
              name="features"
              type="textarea"
              rows="5"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Library
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LibraryForm;