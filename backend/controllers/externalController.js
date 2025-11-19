const axios = require('axios');

// Libraries.io API Configuration
const LIBRARIES_IO_API_KEY = 'd74586c01b50a76e9fdb072d90e9e81c';
const LIBRARIES_IO_BASE_URL = 'https://libraries.io/api';

/**
 * Generate consistent ID for external libraries
 */
const generateLibraryId = (name, platform) => {
  return `${platform}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
};

/**
 * Fuzzy match implementation
 */
const fuzzyMatch = (text, query) => {
  if (!query || !text) return true;
  
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  if (textLower.includes(queryLower)) return true;
  
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === queryLower.length;
};

/**
 *  Get npm downloads with race condition to prevent blocking
 */
const getRealNPMDownloads = async (packageName) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
  
  try {
    const response = await axios.get(
      `https://api.npmjs.org/downloads/point/last-month/${packageName}`,
      { 
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }
    );
    clearTimeout(timeoutId);
    const downloads = response.data.downloads || 0;
    console.log(` npm: ${packageName} → ${downloads.toLocaleString()}`);
    return downloads;
  } catch (error) {
    clearTimeout(timeoutId);
    console.log(`npm failed for ${packageName}`);
    return 0;
  }
};

/**
 *  Get GitHub stats with timeout protection
 */
const getGitHubStats = async (repoUrl) => {
  if (!repoUrl || !repoUrl.includes('github.com')) return null;
  
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (!match) return null;
  
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);
  
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${cleanRepo}`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    clearTimeout(timeoutId);
    
    const data = response.data;
    console.log(`GitHub: ${owner}/${cleanRepo} → ${data.stargazers_count}`);
    
    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      watchers: data.watchers_count || 0,
      openIssues: data.open_issues_count || 0,
      language: data.language || null,
      lastUpdated: data.updated_at || null,
      description: data.description || null
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.log(` GitHub failed for ${owner}/${cleanRepo}`);
    return null;
  }
};

/**
 * Map platform to readable name and OS support
 */
const getPlatformInfo = (platform) => {
  const platformMap = {
    'npm': { name: 'JavaScript', install: 'npm install', osPlatforms: ['windows', 'macos', 'linux'] },
    'pypi': { name: 'Python', install: 'pip install', osPlatforms: ['windows', 'macos', 'linux'] },
    'maven': { name: 'Java', install: 'Maven dependency', osPlatforms: ['windows', 'macos', 'linux'] },
    'rubygems': { name: 'Ruby', install: 'gem install', osPlatforms: ['windows', 'macos', 'linux'] },
    'packagist': { name: 'PHP', install: 'composer require', osPlatforms: ['windows', 'macos', 'linux'] },
    'go': { name: 'Go', install: 'go get', osPlatforms: ['windows', 'macos', 'linux'] },
    'cargo': { name: 'Rust', install: 'cargo add', osPlatforms: ['windows', 'macos', 'linux'] },
    'nuget': { name: '.NET', install: 'dotnet add package', osPlatforms: ['windows', 'macos', 'linux'] },
    'cocoapods': { name: 'iOS', install: 'pod install', osPlatforms: ['macos'] },
    'pub': { name: 'Dart', install: 'pub get', osPlatforms: ['windows', 'macos', 'linux'] },
    'hex': { name: 'Elixir', install: 'mix deps.get', osPlatforms: ['windows', 'macos', 'linux'] },
    'cpan': { name: 'Perl', install: 'cpan install', osPlatforms: ['windows', 'macos', 'linux'] },
    'cran': { name: 'R', install: 'install.packages', osPlatforms: ['windows', 'macos', 'linux'] },
    'conda': { name: 'Conda', install: 'conda install', osPlatforms: ['windows', 'macos', 'linux'] },
    'swift': { name: 'Swift', install: 'swift package', osPlatforms: ['macos', 'linux'] },
    'carthage': { name: 'iOS/macOS', install: 'carthage update', osPlatforms: ['macos'] },
    'homebrew': { name: 'Homebrew', install: 'brew install', osPlatforms: ['macos', 'linux'] }
  };
  
  return platformMap[platform?.toLowerCase()] || { 
    name: platform, 
    install: 'install',
    osPlatforms: ['windows', 'macos', 'linux']
  };
};

/**
 * Get OS platforms
 */
const getOSPlatforms = (platform, language) => {
  const platformInfo = getPlatformInfo(platform);
  let osPlatforms = platformInfo.osPlatforms;

  if (language) {
    const lang = language.toLowerCase();
    if (lang === 'swift' || lang === 'objective-c') {
      osPlatforms = ['macos'];
    }
  }

  return osPlatforms;
};

/**
 * Generate code example
 */
const generateCodeExample = (name, platform) => {
  const info = getPlatformInfo(platform);
  
  const examples = {
    'npm': `// Install via npm\nnpm install ${name}\n\n// Basic usage\nconst lib = require('${name}');`,
    'pypi': `# Install via pip\npip install ${name}\n\n# Basic usage\nimport ${name}`,
    'maven': `<!-- Add to pom.xml -->\n<dependency>\n  <groupId>GROUP_ID</groupId>\n  <artifactId>${name}</artifactId>\n</dependency>`,
    'rubygems': `# Install via gem\ngem install ${name}\n\n# Basic usage\nrequire '${name}'`,
    'packagist': `// Install via composer\ncomposer require ${name}\n\n// Basic usage\nrequire 'vendor/autoload.php';`,
    'go': `// Install\ngo get ${name}\n\n// Usage\nimport "${name}"`,
    'cargo': `# Add to Cargo.toml\n[dependencies]\n${name} = "*"\n\n# Usage\nuse ${name};`,
    'nuget': `# Install\ndotnet add package ${name}\n\n// Usage\nusing ${name};`
  };
  
  return examples[platform?.toLowerCase()] || `${info.install} ${name}`;
};

/**
 * SMART RATING: Calculates realistic ratings based on multiple factors
 */
const calculateRating = (sourceRank, stars = 0, downloads = 0, forks = 0) => {
  // If no data at all, return null
  if (!sourceRank && !stars && !downloads) return null;
  
  let rating = 0;
  
  // Factor 1: SourceRank (0-100 → 1-4 stars, not 0-5)
  if (sourceRank > 0) {
    rating = 1 + (sourceRank / 100) * 3; // Min 1, Max 4
  }
  
  // Factor 2: GitHub Stars Boost
  if (stars >= 10000) rating += 1.0;
  else if (stars >= 5000) rating += 0.8;
  else if (stars >= 1000) rating += 0.6;
  else if (stars >= 500) rating += 0.4;
  else if (stars >= 100) rating += 0.2;
  
  // Factor 3: Download Boost (monthly)
  if (downloads >= 1000000) rating += 0.5;
  else if (downloads >= 100000) rating += 0.3;
  else if (downloads >= 10000) rating += 0.1;
  
  // Factor 4: Community Activity (forks)
  if (forks >= 1000) rating += 0.3;
  else if (forks >= 100) rating += 0.1;
  
  // Ensure minimum rating for active packages
  if ((stars > 50 || downloads > 5000) && rating < 2.5) {
    rating = 2.5;
  }
  
  // Cap and round
  const finalRating = Math.min(5.0, Math.max(0, rating));
  return parseFloat(finalRating.toFixed(1));
};

/**
 *  OPTIMIZED: Search with parallel API enrichment (non-blocking)
 */
const searchLibrariesIO = async (query, limit = 20, platforms = null, page = 1) => {
  try {
    const params = {
      q: query,
      per_page: limit,
      page: page,
      api_key: LIBRARIES_IO_API_KEY
    };

    if (platforms && platforms.length > 0) {
      params.platforms = platforms.join(',');
    }

    console.log(` Searching: "${query}" | Page: ${page}`);

    const response = await axios.get(`${LIBRARIES_IO_BASE_URL}/search`, {
      params,
      timeout: 12000
    });

    console.log(` Found ${response.data?.length || 0} results`);

    //  OPTIMIZED: Process with Promise.allSettled (doesn't fail if one API fails)
    const results = await Promise.allSettled(
      response.data.map(async (lib) => {
        const platformInfo = getPlatformInfo(lib.platform);
        const osPlatforms = getOSPlatforms(lib.platform, lib.language);
        
        // Parallel API calls (non-blocking)
        const [npmResult, githubResult] = await Promise.allSettled([
          // Only fetch npm data for npm packages
          lib.platform === 'npm' || lib.platform === 'NPM' 
            ? getRealNPMDownloads(lib.name) 
            : Promise.resolve(lib.downloads || 0),
          // Fetch GitHub stats if repo exists
          lib.repository_url 
            ? getGitHubStats(lib.repository_url) 
            : Promise.resolve(null)
        ]);
        
        // Extract values with fallbacks
        const realDownloads = npmResult.status === 'fulfilled' ? npmResult.value : (lib.downloads || 0);
        const githubStats = githubResult.status === 'fulfilled' ? githubResult.value : null;
        const realStars = githubStats?.stars || lib.stars || 0;
        const realForks = githubStats?.forks || lib.forks || 0;
        
        // Calculate smart rating
        const enhancedRating = calculateRating(
          lib.rank || 0,
          realStars,
          realDownloads,
          realForks
        );
        
        return {
          id: generateLibraryId(lib.name, lib.platform),
          name: lib.name,
          description: githubStats?.description || lib.description || 'No description available',
          category: platformInfo.name,
          version: lib.latest_release_number || lib.versions?.[0] || 'N/A',
          platform: lib.platform,
          platforms: osPlatforms,
          license: lib.licenses || lib.normalized_licenses?.[0] || 'Unknown',
          cost: 'Free',
          
          // REAL-TIME METRICS
          stars: realStars,
          forks: realForks,
          watchers: githubStats?.watchers || lib.subscribers_count || 0,
          downloads: realDownloads,
          dependents: lib.dependents_count || 0,
          dependent_repos: lib.dependent_repos_count || 0,
          openIssues: githubStats?.openIssues || 0,
          
          //  ENHANCED RATING
          sourceRank: lib.rank || 0,
          rating: enhancedRating,
          
          // Links
          homepage: lib.homepage || lib.repository_url || `https://libraries.io/${lib.platform}/${lib.name}`,
          repository: lib.repository_url || null,
          documentation: lib.homepage || `https://libraries.io/${lib.platform}/${lib.name}`,
          package_manager_url: lib.package_manager_url || null,
          
          // Additional info
          tags: lib.keywords || [],
          language: githubStats?.language || lib.language || null,
          latest_release_published_at: lib.latest_release_published_at || null,
          lastUpdated: githubStats?.lastUpdated || lib.latest_release_published_at || null,
          
          // Package manager
          packageManager: lib.platform,
          packageManagerName: platformInfo.name,
          
          // Code example
          codeExample: generateCodeExample(lib.name, lib.platform),
          codeExampleLanguage: lib.language || platformInfo.name.toLowerCase(),
          
          source: 'libraries.io'
        };
      })
    );

    // Filter out failed results and return successful ones
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

  } catch (error) {
    console.error(' Libraries.io error:', error.message);
    throw error;
  }
};

/**
 * Main search endpoint
 */
const searchExternal = async (req, res) => {
  try {
    const { 
      query, 
      platforms, 
      limit = 20,
      sort = 'rank',
      page = 1
    } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }

    const platformList = platforms ? platforms.split(',').map(p => p.trim()) : null;

    // Search with real-time enrichment
    let results = await searchLibrariesIO(query, parseInt(limit), platformList, parseInt(page));
    
    // Fuzzy filter
    results = results.filter(lib => 
      fuzzyMatch(lib.name, query) ||
      fuzzyMatch(lib.description, query) ||
      lib.tags?.some(tag => fuzzyMatch(tag, query))
    );

    // Sort results
    const sortFunctions = {
      'stars': (a, b) => (b.stars || 0) - (a.stars || 0),
      'downloads': (a, b) => (b.downloads || 0) - (a.downloads || 0),
      'rating': (a, b) => (b.rating || 0) - (a.rating || 0),
      'dependents': (a, b) => (b.dependents || 0) - (a.dependents || 0),
      'rank': (a, b) => (b.sourceRank || 0) - (a.sourceRank || 0)
    };
    
    results.sort(sortFunctions[sort] || sortFunctions['rank']);

    console.log(`Returning ${results.length} enriched results`);

    res.json({
      success: true,
      count: results.length,
      source: 'libraries.io',
      query: query,
      platforms: platformList,
      page: parseInt(page),
      limit: parseInt(limit),
      data: results
    });
  } catch (error) {
    console.error(' Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch libraries',
      message: error.message
    });
  }
};

const searchCombined = async (req, res) => {
  return searchExternal(req, res);
};

module.exports = {
  searchExternal,
  searchCombined
};