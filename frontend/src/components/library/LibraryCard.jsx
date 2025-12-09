import React, { useState, useEffect } from 'react';
import { Star, Download, Code, GitCompare, Heart, MessageSquare, CheckCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import LibraryInfoModal from './LibraryInfoModal';
import FeedbackModal from './FeedbackModal';
import { db } from '../../services/firebase';
import { collection, query, where, addDoc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const LibraryCard = ({ library, onCompare, isSelected = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.uid) {
      checkIfFavorited();
    }
  }, [user.uid, library.id]);

  // Auto-hide toast after 2.5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const checkIfFavorited = async () => {
    try {
      const favoritesRef = collection(db, 'favorites');
      const q = query(
        favoritesRef,
        where('userId', '==', user.uid),
        where('libraryId', '==', library.id)
      );
      const snapshot = await getDocs(q);
      setIsFavorited(!snapshot.empty);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    if (onCompare) {
      onCompare(library);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (!user.uid) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);

    try {
      if (isFavorited) {
        const favoritesRef = collection(db, 'favorites');
        const q = query(
          favoritesRef,
          where('userId', '==', user.uid),
          where('libraryId', '==', library.id)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const docToDelete = snapshot.docs[0];
          await deleteDoc(docToDelete.ref);
        }
        
        setIsFavorited(false);
        setToast({
          message: 'Removed from favorites',
          icon: 'heart'
        });
      } else {
        await addDoc(collection(db, 'favorites'), {
          userId: user.uid,
          libraryId: library.id,
          libraryName: library.name,
          libraryDescription: library.description,
          libraryRating: library.rating || null,
          libraryCategory: library.category || null,
          librarySource: library.source || 'firebase',
          libraryStars: library.stars || 0,
          libraryDownloads: library.downloads || 0,
          libraryVersion: library.version || 'N/A',
          libraryPlatforms: library.platforms || [],
          libraryLicense: library.license || 'Unknown',
          libraryCost: library.cost || 'Free',
          libraryHomepage: library.homepage || null,
          libraryRepository: library.repository || null,
          libraryDocumentation: library.documentation || null,
          libraryTags: library.tags || [],
          libraryCodeExample: library.codeExample || null,
          libraryNpmPage: library.npmPage || null,
          createdAt: serverTimestamp()
        });

        setIsFavorited(true);
        setToast({
          message: 'Added to favorites ',
          icon: 'heart'
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClick = (e) => {
    e.stopPropagation();
    
    if (!user.uid) {
      alert('Please login to submit feedback');
      return;
    }
    
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmitted = () => {
    setToast({
      message: 'Feedback sent successfully! ',
      icon: 'feedback'
    });
  };

  const formatNumber = (num) => {
    if (typeof num === 'string') return num;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  return (
    <>
      {/* Cylindrical Popup */}
      {toast && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none px-4">
          <div 
            className="bg-white rounded-full shadow-2xl px-10 py-5 flex items-center gap-4 pointer-events-auto"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
              border: '4px solid transparent',
              backgroundClip: 'padding-box',
              position: 'relative',
              animation: 'blowUpFromBottom 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                background: 'linear-gradient(to right, rgb(244, 63, 94), rgb(249, 115, 22), rgb(245, 158, 11))',
                borderRadius: '50px',
                zIndex: -1
              }}
            />
            
            {toast.icon === 'heart' && (
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500 flex-shrink-0" />
            )}
            {toast.icon === 'feedback' && (
              <MessageSquare className="w-8 h-8 text-orange-500 flex-shrink-0" />
            )}
            <p className="text-xl font-bold text-gray-900 whitespace-nowrap">
              {toast.message}
            </p>
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Keyframe Animation */}
      <style>
        {`
          @keyframes blowUpFromBottom {
            0% {
              transform: translateY(100vh) scale(0.3);
              opacity: 0;
            }
            50% {
              transform: translateY(-10px) scale(1.05);
              opacity: 1;
            }
            70% {
              transform: translateY(5px) scale(0.98);
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
        `}
      </style>

      <div
        onClick={handleCardClick}
        className={`bg-white border-2 rounded-xl p-6 hover:shadow-2xl transition-all cursor-pointer h-full flex flex-col overflow-hidden ${
          isSelected ? 'border-gray-900 bg-gray-50 shadow-xl' : 'border-gray-300 hover:border-gray-900'
        }`}
      >
        <div className="mb-3 flex items-start justify-between gap-2 min-w-0">
          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 break-words overflow-hidden">
              {library.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-medium truncate max-w-full">
                {library.category}
              </span>
              {library.version && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold border border-blue-200 truncate">
                  v{library.version}
                </span>
              )}
            </div>
          </div>
          
          {user.uid && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleFavoriteClick}
                disabled={loading}
                className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                  isFavorited
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md hover:shadow-lg'
                    : 'bg-white text-gray-400 border-2 border-gray-300 hover:border-rose-300 hover:text-rose-500'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={handleFeedbackClick}
                className="flex-shrink-0 p-2 rounded-lg transition-all duration-200 bg-white text-gray-400 border-2 border-gray-300 hover:border-orange-300 hover:text-orange-500 hover:scale-110"
                title="Submit feedback for this library"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed break-words overflow-hidden">
          {library.description}
        </p>

        {/* ✅ SECURITY BADGES */}
        {library.securityStatus?.hasSecurityConcerns && (
          <div className="mb-3 flex flex-wrap gap-2">
            {library.securityStatus.isDeprecated && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-300">
                <AlertTriangle className="w-3 h-3" />
                Deprecated
              </span>
            )}
            
            {library.securityStatus.isUnmaintained && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full border border-orange-300">
                <AlertCircle className="w-3 h-3" />
                Unmaintained
              </span>
            )}
            
            {library.securityStatus.isOutdated && !library.securityStatus.isDeprecated && !library.securityStatus.isUnmaintained && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-300">
                <Clock className="w-3 h-3" />
                Outdated
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4 overflow-hidden">
          {library.platforms?.slice(0, 3).map((platform, index) => (
            <span 
              key={`${platform}-${index}`} 
              className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs capitalize font-medium border border-gray-300 truncate max-w-full"
            >
              {platform === 'windows' ? '🪟 Windows' : platform === 'macos' ? '🍎 macOS' : platform === 'linux' ? '🐧 Linux' : platform}
            </span>
          ))}
          {library.platforms?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium border border-gray-300">
              +{library.platforms.length - 3}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm mb-4 min-w-0">
          {library.rating && (
            <div className="flex items-center gap-1 text-gray-700 min-w-0 overflow-hidden">
              <Star size={14} className="text-gray-900 fill-gray-900 flex-shrink-0" />
              <span className="font-semibold text-xs truncate">{library.rating}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-gray-700 min-w-0 overflow-hidden">
            <Download size={14} className="text-gray-900 flex-shrink-0" />
            <span className="font-semibold text-xs truncate">{formatNumber(library.downloads || 0)}</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-700 min-w-0 overflow-hidden">
            <Code size={14} className="text-gray-900 flex-shrink-0" />
            <span className="font-semibold text-xs truncate">{library.license || 'N/A'}</span>
          </div>
        </div>

        <button
          onClick={handleCompareClick}
          className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 mt-auto shadow-md ${
            isSelected 
              ? 'bg-gray-900 text-white hover:bg-gray-800' 
              : 'bg-white text-gray-900 hover:bg-gray-100 border-2 border-gray-900 hover:shadow-xl'
          }`}
        >
          <GitCompare className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm truncate">{isSelected ? 'Remove from Comparison' : 'Add to Compare'}</span>
        </button>
      </div>

      <LibraryInfoModal
        library={library}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <FeedbackModal
        library={library}
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmitSuccess={handleFeedbackSubmitted}
      />
    </>
  );
};

export default LibraryCard;