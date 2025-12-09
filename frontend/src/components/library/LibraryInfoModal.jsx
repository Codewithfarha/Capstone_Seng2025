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
  DollarSign
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

              {/* Last Updated - SMART DATE HANDLING */}
              {library.lastUpdated && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-semibold text-gray-900">
                    {(() => {
                      try {
                        const dateStr = library.lastUpdated;
                        const date = new Date(dateStr);
                        const now = new Date();
                        
                        // Check if date is valid
                        if (isNaN(date.getTime())) {
                          console.warn(`⚠️ Invalid date for ${library.name}: ${dateStr}`);
                          return 'Unknown';
                        }
                        
                        // ✅ CHANGED: Allow dates up to 7 days in the future (for timezone issues)
                        // GitHub might show dates slightly ahead due to server time differences
                        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        
                        // ✅ CHANGED: Only flag dates MORE THAN 7 days in the future as suspicious
                        if (date > sevenDaysFromNow) {
                          console.warn(`⚠️ Suspicious future date for ${library.name}: ${dateStr}`);
                          // If it's MORE than 1 year in the future, it's definitely wrong
                          const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
                          if (date > oneYearFromNow) {
                            return 'Recently';
                          }
                          // If it's just a few weeks/months ahead, show with warning
                          return (
                            <span className="flex items-center gap-2">
                              {date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Verify date
                              </span>
                            </span>
                          );
                        }
                        
                        // ✅ CHANGED: Format date nicely for valid dates (including today/recent)
                        return date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });
                      } catch (e) {
                        console.error('Date parsing error:', e);
                        return 'Unknown';
                      }
                    })()}
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