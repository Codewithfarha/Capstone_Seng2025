import React, { useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const FeedbackModal = ({ library, isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.uid) {
      alert('Please login to submit feedback');
      return;
    }

    if (!message.trim()) {
      alert('Please enter your feedback');
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || user.name || '',
        type: feedbackType,
        message: message.trim(),
        libraryId: library.id,
        libraryName: library.name,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      alert('Feedback submitted successfully! Thank you for your input.');
      setMessage('');
      setFeedbackType('general');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Submit Feedback</h2>
              <p className="text-sm text-white/90">{library.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Feedback Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'bug', label: 'Bug Report', color: 'red' },
                { value: 'feature', label: 'Feature Request', color: 'blue' },
                { value: 'improvement', label: 'Improvement', color: 'green' },
                { value: 'general', label: 'General', color: 'gray' }
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFeedbackType(type.value)}
                  className={`
                    px-4 py-3 rounded-lg font-medium text-sm transition-all border-2
                    ${feedbackType === type.value
                      ? `bg-${type.color}-100 border-${type.color}-500 text-${type.color}-700`
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please share your thoughts, suggestions, or issues..."
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Your feedback helps us improve the library database!
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;