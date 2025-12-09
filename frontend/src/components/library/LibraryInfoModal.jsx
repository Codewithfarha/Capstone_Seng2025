import React from 'react';
import { 
  X, 
  Star, 
  Download, 
  ExternalLink, 
  Code, 
  Package,
  CheckCircle,
  XCircle,
  GitBranch,
  DollarSign,
  Shield,
  AlertTriangle,
  AlertCircle,
  Clock
} from 'lucide-react';
import CodeExample from './CodeExample';

const LibraryInfoModal = ({ library, isOpen, onClose }) => {
  if (!isOpen || !library) return null;

  const formatNumber = (num) => {
    if (typeof num === 'string') return num;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Rose/Orange/Amber Gradient */}
        <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Package className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{library.name}</h2>
              <p className="text-rose-50 mb-3">{library.description}</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span className="font-semibold">{library.rating || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>{formatNumber(library.downloads || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
          
          {/* Basic Info - Simple Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-5 h-5 text-gray-700" />
                <span className="text-sm text-gray-600 font-medium">Downloads</span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {library.downloads ? formatNumber(library.downloads) : '0'}
                {(!library.downloads || library.downloads === 0) && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-normal">
                    Data unavailable
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-gray-700" />
                <span className="text-sm text-gray-600 font-medium">Cost</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{library.cost || 'Free'}</div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-gray-700" />
                <span className="text-sm text-gray-600 font-medium">Rating</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{library.rating ? `${library.rating}/5` : 'N/A'}</div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-5 h-5 text-gray-700" />
                <span className="text-sm text-gray-600 font-medium">License</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{library.license}</div>
            </div>
          </div>

          {/* Ecosystem (was Category) */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
            <div className="text-sm text-gray-600 mb-1">Ecosystem</div>
            <div className="font-semibold text-gray-900 capitalize">{library.category}</div>
          </div>

          {/* Platform Support */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Platform Support</h3>
            <div className="grid grid-cols-3 gap-3">
              {['windows', 'macos', 'linux'].map((platform) => (
                <div 
                  key={platform} 
                  className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                    library.platforms?.includes(platform)
                      ? 'bg-white border-gray-900'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="capitalize font-medium text-gray-700">
                    {platform === 'windows' ? '🪟 Windows' : platform === 'macos' ? '🍎 macOS' : '🐧 Linux'}
                  </span>
                  {library.platforms?.includes(platform) ? (
                    <CheckCircle className="w-5 h-5 text-gray-900" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Code Examples  */}
          {(() => {
            let examples = [];
            
            //  codeExamples array with language
            if (library.codeExamples && Array.isArray(library.codeExamples) && library.codeExamples.length > 0) {
              examples = library.codeExamples;
            }
            // Single codeExample string with codeExampleLanguage
            else if (library.codeExample && typeof library.codeExample === 'string') {
              examples = [{
                title: 'Code Example',
                code: library.codeExample,
                // Use codeExampleLanguage from library data or fall back to language or platform
                language: library.codeExampleLanguage || library.language || 'javascript'
              }];
            }
            
            return examples.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Code className="w-6 h-6 text-gray-900" />
                  Code Examples
                </h3>
                <div className="space-y-4">
                  {examples.map((example, index) => (
                    <CodeExample
                      key={index}
                      code={example.code}
                      language={example.language || library.codeExampleLanguage || library.language || 'javascript'}
                      title={example.title}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Key Features */}
          {library.features && library.features.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {library.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg border-2 border-gray-300">
                    <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dependencies */}
          {library.dependencies && library.dependencies.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Dependencies</h3>
              <div className="flex flex-wrap gap-2">
                {library.dependencies.map((dep, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium border-2 border-gray-300"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ✅ SECURITY STATUS SECTION */}
          {library.securityStatus && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-6 h-6 text-gray-900" />
                Security Status
              </h3>
              
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-700">Package Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    library.securityStatus.hasSecurityConcerns 
                      ? 'bg-red-100 text-red-800 border border-red-300' 
                      : 'bg-green-100 text-green-800 border border-green-300'
                  }`}>
                    {library.securityStatus.status || 'Active'}
                  </span>
                </div>
                
                {/* Deprecated Warning */}
                {library.securityStatus.isDeprecated && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg mb-2 border border-red-200">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 text-sm">Deprecated</p>
                      <p className="text-red-700 text-sm">This package is no longer maintained. Consider using alternatives.</p>
                    </div>
                  </div>
                )}
                
                {/* Unmaintained Warning */}
                {library.securityStatus.isUnmaintained && (
                  <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg mb-2 border border-orange-200">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900 text-sm">Unmaintained</p>
                      <p className="text-orange-700 text-sm">This package is not actively maintained and may have security vulnerabilities.</p>
                    </div>
                  </div>
                )}
                
                {/* Outdated Warning */}
                {library.securityStatus.isOutdated && !library.securityStatus.isDeprecated && !library.securityStatus.isUnmaintained && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg mb-2 border border-yellow-200">
                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-900 text-sm">Outdated</p>
                      <p className="text-yellow-700 text-sm">No updates in 2+ years. May have unpatched vulnerabilities.</p>
                    </div>
                  </div>
                )}
                
                {/* Active & Healthy */}
                {!library.securityStatus.hasSecurityConcerns && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Active & Maintained</p>
                      <p className="text-green-700 text-sm">This package is actively maintained and regularly updated.</p>
                    </div>
                  </div>
                )}
                
                {/* Last Release Date */}
                {library.securityStatus.lastReleaseDate && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Last Release:</span> {new Date(library.securityStatus.lastReleaseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
              
              {/* ✅ GITHUB SECURITY VULNERABILITIES */}
              {library.githubSecurity && library.githubSecurity.totalAlerts > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Known Vulnerabilities (GitHub Security)
                  </h4>
                  
                  {/* Vulnerability Summary */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Total Vulnerabilities:</span>
                      <span className="font-bold text-gray-900">{library.githubSecurity.totalAlerts}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Open (Unfixed):</span>
                      <span className={`font-bold ${library.githubSecurity.openAlerts > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {library.githubSecurity.openAlerts}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Fixed:</span>
                      <span className="font-bold text-green-600">{library.githubSecurity.fixedAlerts}</span>
                    </div>
                  </div>
                  
                  {/* Severity Breakdown */}
                  {library.githubSecurity.vulnerabilities.total > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Severity Breakdown:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {library.githubSecurity.vulnerabilities.critical > 0 && (
                          <div className="bg-red-100 border border-red-300 rounded p-2 text-center">
                            <div className="text-lg font-bold text-red-800">
                              {library.githubSecurity.vulnerabilities.critical}
                            </div>
                            <div className="text-xs text-red-700">Critical</div>
                          </div>
                        )}
                        
                        {library.githubSecurity.vulnerabilities.high > 0 && (
                          <div className="bg-orange-100 border border-orange-300 rounded p-2 text-center">
                            <div className="text-lg font-bold text-orange-800">
                              {library.githubSecurity.vulnerabilities.high}
                            </div>
                            <div className="text-xs text-orange-700">High</div>
                          </div>
                        )}
                        
                        {library.githubSecurity.vulnerabilities.medium > 0 && (
                          <div className="bg-yellow-100 border border-yellow-300 rounded p-2 text-center">
                            <div className="text-lg font-bold text-yellow-800">
                              {library.githubSecurity.vulnerabilities.medium}
                            </div>
                            <div className="text-xs text-yellow-700">Medium</div>
                          </div>
                        )}
                        
                        {library.githubSecurity.vulnerabilities.low > 0 && (
                          <div className="bg-blue-100 border border-blue-300 rounded p-2 text-center">
                            <div className="text-lg font-bold text-blue-800">
                              {library.githubSecurity.vulnerabilities.low}
                            </div>
                            <div className="text-xs text-blue-700">Low</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Individual Vulnerabilities */}
                  {library.githubSecurity.alerts && library.githubSecurity.alerts.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Recent Vulnerabilities:</p>
                      <div className="space-y-2">
                        {library.githubSecurity.alerts.map((alert, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg border ${
                              alert.state === 'open' 
                                ? 'bg-red-50 border-red-200' 
                                : 'bg-green-50 border-green-200'
                            }`}
                          >
                            {/* Severity Badge */}
                            <div className="flex items-start justify-between mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                alert.severity === 'critical' ? 'bg-red-600 text-white' :
                                alert.severity === 'high' ? 'bg-orange-500 text-white' :
                                alert.severity === 'medium' ? 'bg-yellow-500 text-white' :
                                'bg-blue-500 text-white'
                              }`}>
                                {alert.severity}
                              </span>
                              
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                alert.state === 'open' 
                                  ? 'bg-red-200 text-red-800' 
                                  : 'bg-green-200 text-green-800'
                              }`}>
                                {alert.state === 'open' ? '🔓 Unfixed' : '✅ Fixed'}
                              </span>
                            </div>
                            
                            {/* Vulnerability Details */}
                            <p className="font-semibold text-gray-900 text-sm mb-1">
                              {alert.summary}
                            </p>
                            
                            {alert.package && (
                              <p className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Package:</span> {alert.package}
                              </p>
                            )}
                            
                            {alert.vulnerableVersions && (
                              <p className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Vulnerable:</span> {alert.vulnerableVersions}
                              </p>
                            )}
                            
                            {alert.patchedVersions && (
                              <p className="text-xs text-green-700 mb-1">
                                <span className="font-medium">Fixed in:</span> {alert.patchedVersions}
                              </p>
                            )}
                            
                            {alert.url && (
                              <a 
                                href={alert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                              >
                                View on GitHub →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  {library.repository && (
                    <a
                      href={`${library.repository}/security`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      View Full Security Report on GitHub
                    </a>
                  )}
                </div>
              )}

              {/* If No Vulnerabilities Found */}
              {library.githubSecurity && library.githubSecurity.totalAlerts === 0 && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900 text-sm">No Known Vulnerabilities</p>
                        <p className="text-green-700 text-xs">
                          GitHub Dependabot has not detected any security vulnerabilities in this repository.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Additional Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Additional Information</h3>
            <div className="space-y-2 bg-white p-4 rounded-lg border-2 border-gray-300">
              {/* Version */}
              {library.version && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Version</span>
                  <span className="font-semibold text-gray-900">
                    {library.version}
                    {(library.version.includes('alpha') || 
                      library.version.includes('beta') || 
                      library.version.includes('rc') ||
                      library.version.includes('pr-') ||
                      library.version.startsWith('0.0.0-pr')) && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Pre-release
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* GitHub Stars */}
              {library.stars && library.stars > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">GitHub Stars</span>
                  <span className="font-semibold text-gray-900">{formatNumber(library.stars)}</span>
                </div>
              )}

              {/* Forks */}
              {library.forks && library.forks > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Forks</span>
                  <span className="font-semibold text-gray-900">{formatNumber(library.forks)}</span>
                </div>
              )}

              {/* Dependents */}
              {library.dependents && library.dependents > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Dependents</span>
                  <span className="font-semibold text-gray-900">{formatNumber(library.dependents)}</span>
                </div>
              )}

              {/* Maintainers */}
              {library.maintainers && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Maintainers</span>
                  <span className="font-semibold text-gray-900">{library.maintainers}</span>
                </div>
              )}

              {/* Size */}
              {library.size && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Size</span>
                  <span className="font-semibold text-gray-900">{library.size}</span>
                </div>
              )}

              {/* Language */}
              {library.language && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Language</span>
                  <span className="font-semibold text-gray-900">{library.language}</span>
                </div>
              )}

              {/* Package Manager */}
              {library.packageManager && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Package Manager</span>
                  <span className="font-semibold text-gray-900">{library.packageManager}</span>
                </div>
              )}

              {/* Source */}
              {library.source && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Data Source</span>
                  <span className="font-semibold text-gray-900 capitalize">{library.source}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {library.homepage && (
              <a
                href={library.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-xl transition-all font-semibold"
              >
                <ExternalLink className="w-5 h-5" />
                Visit Website
              </a>
            )}
            {library.repository && (
              <a
                href={library.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:shadow-xl transition-all font-semibold"
              >
                <GitBranch className="w-5 h-5" />
                Repository
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryInfoModal;