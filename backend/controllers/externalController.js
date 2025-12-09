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
 *  FIXED: Increased timeout to 8s and added URL encoding for scoped packages
 */
const getRealNPMDownloads = async (packageName) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); //  FIXED: 8 second timeout (was 3)
  
  try {
    // FIXED: URL encode package name to handle @ and / characters (e.g., @vue/cli-plugin-eslint)
    const encodedName = encodeURIComponent(packageName);
    
    const response = await axios.get(
      `https://api.npmjs.org/downloads/point/last-month/${encodedName}`,
      { 
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 8000 //  FIXED: Added axios timeout as backup
      }
    );
    clearTimeout(timeoutId);
    const downloads = response.data.downloads || 0;
    
    if (downloads > 0) {
      console.log(` npm: ${packageName} → ${downloads.toLocaleString()}`);
    } else {
      console.log(` npm returned 0 downloads for ${packageName}`);
    }
    
    return downloads;
  } catch (error) {
    clearTimeout(timeoutId);
    console.log(` npm failed for ${packageName}: ${error.message}`);
    return 0;
  }
};

/**
 *  Get GitHub stats with timeout protection
 *  FIXED: Increased timeout to 8 seconds
 */
const getGitHubStats = async (repoUrl) => {
  if (!repoUrl || !repoUrl.includes('github.com')) return null;
  
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (!match) return null;
  
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // FIXED: 8 seconds (was 3)
  
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${cleanRepo}`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/vnd.github.v3+json'
        },
        timeout: 8000 // FIXED: Added axios timeout as backup
      }
    );
    clearTimeout(timeoutId);
    
    const data = response.data;
    console.log(`GitHub: ${owner}/${cleanRepo} → ${data.stargazers_count} stars`);
    
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
 * Get vulnerabilities from OSV (Open Source Vulnerabilities) Database
 * NO AUTHENTICATION REQUIRED - Free and unlimited
 * Works for: npm, PyPI, Maven, RubyGems, Go, Cargo, Packagist, NuGet
 */
const getOSVVulnerabilities = async (packageName, ecosystem) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  
  try {
    // Map platform to OSV ecosystem
    const osvEcosystem = {
      'npm': 'npm',
      'pypi': 'PyPI',
      'maven': 'Maven',
      'rubygems': 'RubyGems',
      'go': 'Go',
      'cargo': 'crates.io',
      'packagist': 'Packagist',
      'nuget': 'NuGet',
      'pub': 'Pub',
      'hex': 'Hex',
      'cocoapods': 'CocoaPods'
    }[ecosystem?.toLowerCase()] || 'npm';
    
    const response = await axios.post(
      'https://api.osv.dev/v1/query',
      {
        package: {
          name: packageName,
          ecosystem: osvEcosystem
        }
      },
      {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 8000
      }
    );
    
    clearTimeout(timeoutId);
    
    const vulns = response.data.vulns || [];
    
    // Count by severity
    const counts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      unknown: 0
    };
    
    vulns.forEach(vuln => {
      // OSV uses different severity formats, normalize them
      const severityStr = JSON.stringify(vuln).toLowerCase();
      
      if (severityStr.includes('critical')) counts.critical++;
      else if (severityStr.includes('high')) counts.high++;
      else if (severityStr.includes('medium') || severityStr.includes('moderate')) counts.medium++;
      else if (severityStr.includes('low')) counts.low++;
      else counts.unknown++;
    });
    
    const total = vulns.length;
    
    if (total > 0) {
      console.log(`🛡️ OSV: ${packageName} → ${total} vulnerabilities`);
    }
    
    return {
      source: 'OSV',
      vulnerabilities: {
        critical: counts.critical,
        high: counts.high,
        medium: counts.medium,
        low: counts.low,
        total: total
      },
      totalAlerts: total,
      openAlerts: total, // OSV doesn't track fixed status
      fixedAlerts: 0,
      alerts: vulns.slice(0, 5).map(vuln => ({
        id: vuln.id,
        severity: vuln.database_specific?.severity || 
                 vuln.severity?.[0]?.type || 
                 (counts.critical > 0 ? 'CRITICAL' : 
                  counts.high > 0 ? 'HIGH' : 
                  counts.medium > 0 ? 'MEDIUM' : 'LOW'),
        summary: vuln.summary || vuln.details?.substring(0, 100) || 'Security vulnerability',
        description: vuln.details,
        package: packageName,
        vulnerableVersions: vuln.affected?.[0]?.ranges?.[0]?.events
          ?.map(e => {
            if (e.introduced) return `>=${e.introduced}`;
            if (e.fixed) return `<${e.fixed}`;
            return null;
          })
          ?.filter(Boolean)
          ?.join(', ') || 'See details',
        patchedVersions: vuln.affected?.[0]?.ranges?.[0]?.events
          ?.find(e => e.fixed)?.fixed || 'See advisory',
        state: 'open',
        url: vuln.references?.[0]?.url || `https://osv.dev/vulnerability/${vuln.id}`
      }))
    };
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // If no vulnerabilities found, OSV returns empty response or 404
    if (error.response?.status === 404 || error.response?.data?.vulns?.length === 0) {
      console.log(` OSV: ${packageName} → No vulnerabilities`);
      return {
        source: 'OSV',
        vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
        totalAlerts: 0,
        openAlerts: 0,
        fixedAlerts: 0,
        alerts: []
      };
    }
    
    console.log(` OSV check failed for ${packageName}: ${error.message}`);
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

    console.log(`🔍 Searching: "${query}" | Page: ${page}`);

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
        
        // Parallel API calls (non-blocking) -  NOW WITH OSV SECURITY
        const [npmResult, githubResult, securityResult] = await Promise.allSettled([
          // Only fetch npm data for npm packages
          lib.platform === 'npm' || lib.platform === 'NPM' 
            ? getRealNPMDownloads(lib.name) 
            : Promise.resolve(lib.downloads || 0),
          // Fetch GitHub stats if repo exists
          lib.repository_url 
            ? getGitHubStats(lib.repository_url) 
            : Promise.resolve(null),
          //  NEW: Fetch OSV vulnerabilities (NO TOKEN NEEDED!)
          getOSVVulnerabilities(lib.name, lib.platform)
        ]);
        
        // Extract values with fallbacks
        const realDownloads = npmResult.status === 'fulfilled' ? npmResult.value : (lib.downloads || 0);
        const githubStats = githubResult.status === 'fulfilled' ? githubResult.value : null;
        const githubSecurity = securityResult.status === 'fulfilled' ? securityResult.value : null; // ✅ OSV Security
        const realStars = githubStats?.stars || lib.stars || 0;
        const realForks = githubStats?.forks || lib.forks || 0;
        
        // Calculate smart rating
        const enhancedRating = calculateRating(
          lib.rank || 0,
          realStars,
          realDownloads,
          realForks
        );
        
        // SECURITY STATUS - Calculate based on Libraries.io data
        const isOutdated = (() => {
          if (!lib.latest_release_published_at && !lib.latest_stable_release_published_at) return false;
          const lastUpdate = new Date(lib.latest_release_published_at || lib.latest_stable_release_published_at);
          const twoYearsAgo = new Date();
          twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
          return lastUpdate < twoYearsAgo;
        })();
        
        const isDeprecated = lib.status === 'Deprecated';
        const isUnmaintained = lib.status === 'Unmaintained';
        
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
          
          // ✅ SECURITY STATUS
          securityStatus: {
            status: lib.status || 'Active',
            isDeprecated: isDeprecated,
            isUnmaintained: isUnmaintained,
            isOutdated: isOutdated,
            hasSecurityConcerns: isDeprecated || isUnmaintained || isOutdated,
            lastReleaseDate: lib.latest_release_published_at || lib.latest_stable_release_published_at
          },
          
          // NEW: OSV SECURITY DATA (NO TOKEN NEEDED!)
          githubSecurity: githubSecurity,
          
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