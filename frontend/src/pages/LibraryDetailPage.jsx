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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto border border-orange-200">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Library Not Found</h2>
            <p className="text-gray-600 mb-8 text-lg">The library you're looking for doesn't exist.</p>
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const InfoCard = ({ icon, label, value, color = 'text-gray-600' }) => (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
      <div className="flex items-center gap-2 mb-2">
        <div className={color}>{icon}</div>
        <span className="text-sm text-gray-600 font-medium">{label}</span>
      </div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors font-medium bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6 border border-orange-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-4 rounded-xl shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{library.name}</h1>
                  <p className="text-xl text-gray-600">{library.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full text-sm font-semibold capitalize border border-orange-300">
                  {library.category}
                </span>
                {library.platforms?.map((platform, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-sm font-semibold capitalize border border-emerald-300"
                  >
                    {platform}
                  </span>
                ))}
                {library.license && (
                  <span className="px-3 py-1 bg-gradient-to-r from-fuchsia-100 to-pink-100 text-fuchsia-700 rounded-full text-sm font-semibold border border-fuchsia-300">
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
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all font-semibold"
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
                  className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-semibold"
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
            <div className="bg-white rounded-xl shadow-xl p-6 border border-orange-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCard
                  icon={<Calendar className="w-5 h-5" />}
                  label="Version"
                  value={library.version}
                  color="text-rose-500"
                />
                <InfoCard
                  icon={<Download className="w-5 h-5" />}
                  label="Size"
                  value={library.size || 'N/A'}
                  color="text-emerald-500"
                />
                <InfoCard
                  icon={<DollarSign className="w-5 h-5" />}
                  label="Cost"
                  value={library.cost}
                  color="text-fuchsia-500"
                />
                <InfoCard
                  icon={<Star className="w-5 h-5" />}
                  label="Rating"
                  value={library.rating ? `${library.rating}/5` : 'N/A'}
                  color="text-amber-500"
                />
              </div>
            </div>

            {/* Code Examples */}
            {library.codeExamples && library.codeExamples.length > 0 && (
              <div className="bg-white rounded-xl shadow-xl p-6 border border-orange-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Code className="w-6 h-6 text-orange-600" />
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
              <div className="bg-white rounded-xl shadow-xl p-6 border border-orange-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                <ul className="space-y-3">
                  {library.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 bg-gradient-to-r from-rose-50 to-orange-50 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">{feature}</span>
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
              <div className="bg-white rounded-xl shadow-xl p-6 border border-orange-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  Dependencies
                </h2>
                <ul className="space-y-2">
                  {library.dependencies.map((dep, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-2 rounded-lg font-medium border border-orange-200">
                      {dep}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Platform Support */}
            <div className="bg-white rounded-xl shadow-xl p-6 border border-orange-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Support</h2>
              <div className="space-y-2">
                {['windows', 'macos', 'linux'].map((platform) => (
                  <div key={platform} className={`flex items-center justify-between py-3 px-3 rounded-lg ${
                    library.platforms?.includes(platform) 
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200' 
                      : 'bg-gray-50'
                  }`}>
                    <span className="text-gray-700 capitalize font-medium">{platform}</span>
                    {library.platforms?.includes(platform) ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-xl p-6 border border-orange-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Info</h2>
              <div className="space-y-3 text-sm">
                {library.lastUpdated && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Last Updated</span>
                    <span className="text-gray-900 font-bold">{library.lastUpdated}</span>
                  </div>
                )}
                {library.maintainers && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Maintainers</span>
                    <span className="text-gray-900 font-bold flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {library.maintainers}
                    </span>
                  </div>
                )}
                {library.downloads && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium">Downloads</span>
                    <span className="text-gray-900 font-bold">{library.downloads}</span>
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