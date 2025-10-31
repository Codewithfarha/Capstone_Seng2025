import React, { useState, useEffect } from 'react';
import { Star, Download, Code, GitCompare, Heart, MessageSquare } from 'lucide-react';
import LibraryInfoModal from './LibraryInfoModal';
import FeedbackModal from './FeedbackModal';
import { db } from '../../services/firebase';
import { collection, query, where, addDoc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const LibraryCard = ({ library, onCompare, isSelected = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.uid) {
      checkIfFavorited();
    }
  }, [user.uid, library.id]);

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
    e.stopPropagation(); // Prevent card click

    if (!user.uid) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
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
      } else {
        // Add to favorites
        await addDoc(collection(db, 'favorites'), {
          userId: user.uid,
          libraryId: library.id,
          libraryName: library.name,
          libraryDescription: library.description,
          libraryRating: library.rating || null,
          libraryCategory: library.category || null,
          createdAt: serverTimestamp()
        });

        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClick = (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!user.uid) {
      alert('Please login to submit feedback');
      return;
    }
    
    setShowFeedbackModal(true);
  };

  const formatNumber = (num) => {
    if (typeof num === 'string') return num;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num;
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`bg-white border-2 rounded-xl p-6 hover:shadow-2xl transition-all cursor-pointer h-full flex flex-col ${
          isSelected ? 'border-gray-900 bg-gray-50 shadow-xl' : 'border-gray-300 hover:border-gray-900'
        }`}
      >
        {/* Header with Favorite and Feedback Buttons */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{library.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-medium">
                {library.category}
              </span>
              {library.version && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold border border-blue-200">
                  v{library.version}
                </span>
              )}
            </div>
          </div>
          
          {/* Favorite and Feedback Buttons */}
          {user.uid && (
            <div className="flex gap-2">
              {/* Favorite Button */}
              <button
                onClick={handleFavoriteClick}
                disabled={loading}
                className={`
                  flex-shrink-0 p-2 rounded-lg transition-all duration-200
                  ${isFavorited
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md hover:shadow-lg'
                    : 'bg-white text-gray-400 border-2 border-gray-300 hover:border-rose-300 hover:text-rose-500'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                `}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`}
                />
              </button>

              {/* Feedback Button */}
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

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">{library.description}</p>

        {/* Platforms */}
        <div className="flex flex-wrap gap-2 mb-4">
          {library.platforms?.slice(0, 3).map((platform) => (
            <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs capitalize font-medium border border-gray-300">
              {platform === 'windows' ? '🪟 Windows' : platform === 'macos' ? '🍎 macOS' : '🐧 Linux'}
            </span>
          ))}
          {library.platforms?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium border border-gray-300">
              +{library.platforms.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
          {library.rating && (
            <div className="flex items-center gap-1 text-gray-700">
              <Star size={14} className="text-gray-900 fill-gray-900 flex-shrink-0" />
              <span className="font-semibold text-xs truncate">{library.rating}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-gray-700">
            <Download size={14} className="text-gray-900 flex-shrink-0" />
            <span className="font-semibold text-xs truncate">{formatNumber(library.downloads || 0)}</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-700">
            <Code size={14} className="text-gray-900 flex-shrink-0" />
            <span className="font-semibold text-xs truncate">{library.license}</span>
          </div>
        </div>

        {/* Compare Button */}
        <button
          onClick={handleCompareClick}
          className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 mt-auto shadow-md ${
            isSelected 
              ? 'bg-gray-900 text-white hover:bg-gray-800' 
              : 'bg-white text-gray-900 hover:bg-gray-100 border-2 border-gray-900 hover:shadow-xl'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span className="text-sm">{isSelected ? 'Remove from Comparison' : 'Add to Compare'}</span>
        </button>
      </div>

      {/* Info Modal */}
      <LibraryInfoModal
        library={library}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        library={library}
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </>
  );
};

export default LibraryCard;