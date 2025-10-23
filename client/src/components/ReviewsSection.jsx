import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, ThumbsUp, Clock, Award } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { rating: filter } : {};
      const response = await axios.get(`${API_URL}/api/reviews/public`, { params });
      setReviews(response.data.data.reviews);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentName = (dept) => {
    const names = {
      road_service: 'Road Service',
      water_management: 'Water Management',
      electrical_service: 'Electrical Service',
      hospital_emergency: 'Hospital Emergency',
      general: 'General'
    };
    return names[dept] || dept;
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      road_service: 'bg-blue-100 text-blue-800',
      water_management: 'bg-cyan-100 text-cyan-800',
      electrical_service: 'bg-yellow-100 text-yellow-800',
      hospital_emergency: 'bg-red-100 text-red-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[dept] || 'bg-gray-100 text-gray-800';
  };

  const getExperienceBadge = (experience) => {
    const badges = {
      excellent: { color: 'bg-green-100 text-green-800', icon: '🌟' },
      good: { color: 'bg-blue-100 text-blue-800', icon: '👍' },
      average: { color: 'bg-yellow-100 text-yellow-800', icon: '👌' },
      poor: { color: 'bg-red-100 text-red-800', icon: '👎' }
    };
    return badges[experience] || badges.average;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-down">
          <h2 className="text-4xl font-bold mb-4">
            Citizen <span className="gradient-text">Reviews & Experiences</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Real feedback from citizens about their issue resolution experience
          </p>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card text-center">
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <p className="text-3xl font-bold gradient-text">{stats.averageRating?.toFixed(1) || '0.0'}</p>
                <p className="text-sm text-gray-300">Average Rating</p>
              </div>
              <div className="card text-center">
                <Award className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold gradient-text">{stats.totalReviews || 0}</p>
                <p className="text-sm text-gray-300">Total Reviews</p>
              </div>
              <div className="card text-center">
                <ThumbsUp className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-bold gradient-text">
                  {stats.excellent + stats.good || 0}
                </p>
                <p className="text-sm text-gray-300">Positive Reviews</p>
              </div>
              <div className="card text-center">
                <Clock className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                <p className="text-3xl font-bold gradient-text">
                  {((stats.excellent + stats.good) / stats.totalReviews * 100).toFixed(0) || 0}%
                </p>
                <p className="text-sm text-gray-300">Satisfaction Rate</p>
              </div>
            </div>
          )}

          {/* Filter */}
          <div className="flex justify-center space-x-2">
            {['all', '5', '4', '3'].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilter(rating)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filter === rating
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                {rating === 'all' ? 'All Reviews' : `${rating}+ Stars`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => {
              const experienceBadge = getExperienceBadge(review.experience);
              return (
                <div key={review._id} className="card animate-slide-up hover:scale-105" style={{animationDelay: `${index * 0.1}s`}}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDepartmentColor(review.department)}`}>
                          {getDepartmentName(review.department)}
                        </span>
                        {review.isVerified && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-100 line-clamp-1">
                        {review.reportTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    {renderStars(review.rating)}
                  </div>

                  {/* Experience Badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${experienceBadge.color}`}>
                      <span className="mr-1">{experienceBadge.icon}</span>
                      {review.experience.charAt(0).toUpperCase() + review.experience.slice(1)} Experience
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 italic">
                    "{review.comment}"
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-700/50">
                    <div className="flex items-center">
                      <span className="font-semibold text-purple-400">{review.userName}</span>
                    </div>
                    <div className="text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {review.resolutionTime && (
                    <div className="mt-2 text-xs text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Resolved in: {review.resolutionTime}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
