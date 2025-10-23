import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import CodeExample from '../components/library/CodeExample';
import Loading from '../components/layout/Loading';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  Download, 
  DollarSign, 
  Code, 
  ExternalLink,
  GitBranch,
  Star,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const LibraryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { libraries, loading } = useLibrary();
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    const found = libraries.find(lib => lib.id === parseInt(id));
    setLibrary(found);
  }, [id, libraries]);

  if (loading) return <Loading />;
  
  if (!library) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Library Not Found</h2>
        <p className="text-gray-600 mb-6">The library you're looking for doesn't exist.</p>
        <Link 
          to="/search" 
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>
      </div>
    );
  }

  const InfoCard = ({ icon, label, value, color = 'text-gray-600' }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className={color}>{icon}</div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{library.name}</h1>
                  <p className="text-xl text-gray-600">{library.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                  {library.category}
                </span>
                {library.platforms?.map((platform, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize"
                  >
                    {platform}
                  </span>
                ))}
                {library.license && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {library.license}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 md:w-48">
              {library.website && (
                <a
                  href={library.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
              )}
              {library.repository && (
                <a
                  href={library.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  <GitBranch className="w-4 h-4" />
                  Repository
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCard
                  icon={<Calendar className="w-5 h-5" />}
                  label="Version"
                  value={library.version}
                  color="text-blue-500"
                />
                <InfoCard
                  icon={<Download className="w-5 h-5" />}
                  label="Size"
                  value={library.size || 'N/A'}
                  color="text-green-500"
                />
                <InfoCard
                  icon={<DollarSign className="w-5 h-5" />}
                  label="Cost"
                  value={library.cost}
                  color="text-purple-500"
                />
                <InfoCard
                  icon={<Star className="w-5 h-5" />}
                  label="Rating"
                  value={library.rating ? `${library.rating}/5` : 'N/A'}
                  color="text-yellow-500"
                />
              </div>
            </div>

            {/* Code Examples */}
            {library.codeExamples && library.codeExamples.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Code className="w-6 h-6" />
                  Code Examples
                </h2>
                {library.codeExamples.map((example, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <CodeExample code={example.code} language={example.language || 'javascript'} />
                  </div>
                ))}
              </div>
            )}

            {/* Features */}
            {library.features && library.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                <ul className="space-y-3">
                  {library.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dependencies */}
            {library.dependencies && library.dependencies.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Dependencies
                </h2>
                <ul className="space-y-2">
                  {library.dependencies.map((dep, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                      {dep}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Platform Support */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Support</h2>
              <div className="space-y-2">
                {['windows', 'macos', 'linux'].map((platform) => (
                  <div key={platform} className="flex items-center justify-between py-2">
                    <span className="text-gray-700 capitalize">{platform}</span>
                    {library.platforms?.includes(platform) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Info</h2>
              <div className="space-y-3 text-sm">
                {library.lastUpdated && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="text-gray-900 font-medium">{library.lastUpdated}</span>
                  </div>
                )}
                {library.maintainers && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Maintainers</span>
                    <span className="text-gray-900 font-medium flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {library.maintainers}
                    </span>
                  </div>
                )}
                {library.downloads && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Downloads</span>
                    <span className="text-gray-900 font-medium">{library.downloads}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDetailPage;