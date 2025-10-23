const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// GET all libraries with filters
router.get('/', async (req, res) => {
  try {
    const { category, platform, license, search } = req.query;
    
    console.log('📥 Received filters:', { category, platform, license, search });
    
    let librariesRef = db.collection('libraries');
    
    // Apply category filter in Firestore query
    if (category && category !== 'all') {
      librariesRef = librariesRef.where('category', '==', category);
    }
    
    const snapshot = await librariesRef.get();
    let libraries = [];
    
    snapshot.forEach(doc => {
      libraries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`📊 Found ${libraries.length} libraries before filtering`);

    // Filter by platform (case-insensitive)
    if (platform && platform !== 'all') {
      const platformLower = platform.toLowerCase();
      libraries = libraries.filter(lib => 
        lib.platforms && lib.platforms.some(p => 
          p.toLowerCase() === platformLower
        )
      );
      console.log(`🔍 After platform filter (${platform}): ${libraries.length} libraries`);
    }

    // Filter by license
    if (license && license !== 'all') {
      libraries = libraries.filter(lib => 
        lib.license && lib.license.toLowerCase() === license.toLowerCase()
      );
      console.log(`🔍 After license filter: ${libraries.length} libraries`);
    }

    // Search filter (name, description, tags)
    if (search) {
      const searchLower = search.toLowerCase();
      libraries = libraries.filter(lib =>
        (lib.name && lib.name.toLowerCase().includes(searchLower)) ||
        (lib.description && lib.description.toLowerCase().includes(searchLower)) ||
        (lib.tags && lib.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
      console.log(`🔍 After search filter: ${libraries.length} libraries`);
    }

    res.json({
      success: true,
      count: libraries.length,
      data: libraries
    });
  } catch (error) {
    console.error('❌ Error fetching libraries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching libraries',
      error: error.message
    });
  }
});

// GET library by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('libraries').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching library:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching library',
      error: error.message
    });
  }
});

// GET library statistics
router.get('/stats', async (req, res) => {
  try {
    const snapshot = await db.collection('libraries').get();
    const libraries = [];
    
    snapshot.forEach(doc => {
      libraries.push(doc.data());
    });

    // Calculate statistics
    const stats = {
      total: libraries.length,
      byCategory: {},
      byLicense: {},
      byPlatform: {
        windows: 0,
        macos: 0,
        linux: 0
      },
      totalStars: 0,
      totalDownloads: 0,
      averageRating: 0
    };

    libraries.forEach(lib => {
      // Category count
      stats.byCategory[lib.category] = (stats.byCategory[lib.category] || 0) + 1;
      
      // License count
      stats.byLicense[lib.license] = (stats.byLicense[lib.license] || 0) + 1;
      
      // Platform count
      if (lib.platforms) {
        lib.platforms.forEach(platform => {
          const platformLower = platform.toLowerCase();
          if (stats.byPlatform[platformLower] !== undefined) {
            stats.byPlatform[platformLower]++;
          }
        });
      }
      
      // Aggregated stats
      stats.totalStars += lib.stars || 0;
      stats.totalDownloads += lib.downloads || 0;
    });

    // Calculate average rating
    const librariesWithRatings = libraries.filter(lib => lib.rating);
    if (librariesWithRatings.length > 0) {
      const totalRating = librariesWithRatings.reduce((sum, lib) => sum + lib.rating, 0);
      stats.averageRating = parseFloat((totalRating / librariesWithRatings.length).toFixed(2));
    }

    stats.averageStars = Math.round(stats.totalStars / libraries.length);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;