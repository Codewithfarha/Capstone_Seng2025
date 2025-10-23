const { db } = require('../config/firebase');

// Collection reference
const librariesCollection = db.collection('libraries');

// Get all libraries with optional filters
const getAllLibraries = async (req, res) => {
  try {
    const { category, platform, minStars } = req.query;
    let query = librariesCollection;

    // Apply filters if provided
    if (category) {
      query = query.where('category', '==', category);
    }
    if (platform) {
      query = query.where('platforms', 'array-contains', platform);
    }

    const snapshot = await query.get();
    
    let libraries = [];
    snapshot.forEach(doc => {
      libraries.push({ id: doc.id, ...doc.data() });
    });

    // Filter by stars (Firestore doesn't support >= on arrays)
    if (minStars) {
      libraries = libraries.filter(lib => lib.stars >= parseInt(minStars));
    }

    res.json({
      success: true,
      count: libraries.length,
      data: libraries
    });
  } catch (error) {
    console.error('Error getting libraries:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch libraries',
      message: error.message 
    });
  }
};

// Get library by ID
const getLibraryById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await librariesCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Library not found' 
      });
    }

    res.json({
      success: true,
      data: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    console.error('Error getting library:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch library',
      message: error.message 
    });
  }
};

// Create new library (Admin only)
const createLibrary = async (req, res) => {
  try {
    const libraryData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await librariesCollection.add(libraryData);
    const doc = await docRef.get();

    res.status(201).json({
      success: true,
      message: 'Library created successfully',
      data: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    console.error('Error creating library:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create library',
      message: error.message 
    });
  }
};

// Update library (Admin only)
const updateLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await librariesCollection.doc(id).update(updateData);
    const doc = await librariesCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Library not found' 
      });
    }

    res.json({
      success: true,
      message: 'Library updated successfully',
      data: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    console.error('Error updating library:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update library',
      message: error.message 
    });
  }
};

// Delete library (Admin only)
const deleteLibrary = async (req, res) => {
  try {
    const { id } = req.params;
    await librariesCollection.doc(id).delete();

    res.json({
      success: true,
      message: 'Library deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting library:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete library',
      message: error.message 
    });
  }
};

// Get library stats
const getLibraryStats = async (req, res) => {
  try {
    const snapshot = await librariesCollection.get();
    const libraries = [];
    
    snapshot.forEach(doc => {
      libraries.push(doc.data());
    });

    // Calculate stats
    const stats = {
      total: libraries.length,
      byCategory: {},
      byPlatform: {},
      byLicense: {},
      averageStars: 0,
      totalDownloads: 0
    };

    libraries.forEach(lib => {
      // Category stats
      stats.byCategory[lib.category] = (stats.byCategory[lib.category] || 0) + 1;

      // Platform stats
      lib.platforms?.forEach(platform => {
        stats.byPlatform[platform] = (stats.byPlatform[platform] || 0) + 1;
      });

      // License stats
      if (lib.license) {
        stats.byLicense[lib.license] = (stats.byLicense[lib.license] || 0) + 1;
      }

      // Average stars
      stats.averageStars += lib.stars || 0;

      // Total downloads
      stats.totalDownloads += lib.downloads || 0;
    });

    stats.averageStars = Math.round(stats.averageStars / libraries.length);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch stats',
      message: error.message 
    });
  }
};

module.exports = {
  getAllLibraries,
  getLibraryById,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  getLibraryStats
};