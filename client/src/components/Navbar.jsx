import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, FileText, Users, Home, MessageCircle, Lock, Menu, X, Bell, UserCheck, AlertCircle, Star, ThumbsDown } from 'lucide-react';
import logo from '../assets/logo.svg';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, token } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState({
    pendingAdmins: 0,
    openReports: 0,
    recentFeedback: 0,
    negativeFeedback: 0,
    negativeReviews: []
  });

  // Fetch notifications for mayor
  React.useEffect(() => {
    if (user?.role === 'mayor' && token) {
      fetchMayorNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchMayorNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, token]);

  const fetchMayorNotifications = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, reportsRes, feedbackRes] = await Promise.all([
        axios.get(`${API_URL}/api/mayor/stats`, { headers }),
        axios.get(`${API_URL}/api/mayor/reports-stats`, { headers }),
        axios.get(`${API_URL}/api/mayor/recent-feedback`, { headers })
      ]);
      
      setNotifications({
        pendingAdmins: statsRes.data.data.pendingAdmins || 0,
        openReports: reportsRes.data.data.overall.open || 0,
        recentFeedback: feedbackRes.data.data.positiveCount || 0,
        negativeFeedback: feedbackRes.data.data.negativeCount || 0,
        negativeReviews: feedbackRes.data.data.negativeReviews || []
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900/95 via-violet-900/95 to-slate-900/95 backdrop-blur-lg shadow-2xl border-b border-violet-500/20 sticky top-0 z-50 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <img src={logo} alt="Smart City Portal Logo" className="h-8 w-8 sm:h-10 sm:w-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="text-lg sm:text-xl font-bold gradient-text">Smart City Portal</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-violet-400 transition-colors p-2"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'mayor' ? (
                  <>
                    <Link
                      to="/mayor/dashboard"
                      className="flex items-center space-x-1 text-gray-300 hover:text-violet-400 transition-all duration-300 hover:scale-110 transform"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/admin/reports"
                      className="flex items-center space-x-1 text-gray-300 hover:text-violet-400 transition-all duration-300 hover:scale-110 transform"
                    >
                      <FileText className="h-5 w-5" />
                      <span>All Reports</span>
                    </Link>
                  </>
                ) : isAdmin ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center space-x-1 text-gray-300 hover:text-violet-400 transition-all duration-300 hover:scale-110 transform"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Analytics</span>
                    </Link>
                    <Link
                      to="/admin/reports"
                      className="flex items-center space-x-1 text-gray-300 hover:text-violet-400 transition-all duration-300 hover:scale-110 transform"
                    >
                      <Users className="h-5 w-5" />
                      <span>All Reports</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-1 text-gray-300 hover:text-violet-400 transition-all duration-300 hover:scale-110 transform"
                    >
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/report"
                      className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                      Report Issue
                    </Link>
                    <Link
                      to="/my-reports"
                      className="flex items-center space-x-1 text-gray-300 hover:text-violet-400 transition-all duration-300 hover:scale-110 transform"
                    >
                      <FileText className="h-5 w-5" />
                      <span>My Reports</span>
                    </Link>
                  </>
                )}
                
                <Link
                  to="/chat"
                  className="flex items-center space-x-1 text-gray-300 hover:text-violet-400 transition-all duration-300 hover:scale-110 transform"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat</span>
                </Link>

                {/* Notification Bell for Mayor */}
                {user?.role === 'mayor' && (
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative text-gray-300 hover:text-violet-400 transition-all duration-300 hover:scale-110 transform p-2"
                    >
                      <Bell className="h-6 w-6" />
                      {(notifications.pendingAdmins + notifications.openReports + notifications.recentFeedback + notifications.negativeFeedback) > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          {notifications.pendingAdmins + notifications.openReports + notifications.recentFeedback + notifications.negativeFeedback}
                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-violet-500/30 overflow-hidden animate-slide-down z-50">
                        <div className="p-4 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-violet-500/30">
                          <h3 className="font-semibold text-gray-100 flex items-center space-x-2">
                            <Bell className="h-5 w-5 text-violet-400" />
                            <span>Notifications</span>
                          </h3>
                        </div>

                        <div className="p-2 max-h-96 overflow-y-auto">
                          {/* Negative Feedback - Priority Alert */}
                          {notifications.negativeFeedback > 0 && (
                            <div className="mb-2">
                              <div className="bg-gradient-to-r from-orange-600/30 to-red-600/30 border-2 border-orange-500/50 rounded-lg p-3 mb-2">
                                <div className="flex items-center space-x-2 mb-2">
                                  <ThumbsDown className="h-5 w-5 text-orange-400 animate-pulse" />
                                  <span className="text-sm font-bold text-orange-300">⚠️ Negative Feedback Alert</span>
                                  <span className="bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                                    {notifications.negativeFeedback}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-300 mb-2">
                                  {notifications.negativeFeedback} review{notifications.negativeFeedback > 1 ? 's' : ''} with 3 stars or below need{notifications.negativeFeedback === 1 ? 's' : ''} attention
                                </p>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {notifications.negativeReviews.slice(0, 3).map((review, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        setShowNotifications(false);
                                        // Navigate to the specific report
                                        navigate(`/reports/${review.reportId}`);
                                      }}
                                      className="w-full text-left p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded transition-all"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <p className="text-xs font-medium text-gray-200 truncate">
                                            {review.reportTitle}
                                          </p>
                                          <div className="flex items-center space-x-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                              <Star
                                                key={i}
                                                className={`h-3 w-3 ${i < review.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-600'}`}
                                              />
                                            ))}
                                            <span className="text-xs text-gray-400 ml-1">by {review.userName}</span>
                                          </div>
                                        </div>
                                        <span className="text-orange-400 text-xs ml-2">→</span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {notifications.pendingAdmins > 0 && (
                            <Link
                              to="/mayor/dashboard?tab=pending"
                              onClick={() => setShowNotifications(false)}
                              className="flex items-start space-x-3 p-3 hover:bg-violet-600/20 rounded-lg transition-all group"
                            >
                              <div className="bg-yellow-500/20 p-2 rounded-lg">
                                <UserCheck className="h-5 w-5 text-yellow-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-200 group-hover:text-violet-300">
                                  Pending Admin Approvals
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notifications.pendingAdmins} admin{notifications.pendingAdmins > 1 ? 's' : ''} waiting for approval
                                </p>
                              </div>
                              <span className="bg-yellow-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                {notifications.pendingAdmins}
                              </span>
                            </Link>
                          )}

                          {notifications.openReports > 0 && (
                            <Link
                              to="/mayor/dashboard?tab=reports"
                              onClick={() => setShowNotifications(false)}
                              className="flex items-start space-x-3 p-3 hover:bg-violet-600/20 rounded-lg transition-all group"
                            >
                              <div className="bg-red-500/20 p-2 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-200 group-hover:text-violet-300">
                                  Open Reports
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notifications.openReports} report{notifications.openReports > 1 ? 's' : ''} need attention
                                </p>
                              </div>
                              <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                {notifications.openReports}
                              </span>
                            </Link>
                          )}

                          {notifications.recentFeedback > 0 && (
                            <Link
                              to="/mayor/dashboard?tab=feedback"
                              onClick={() => setShowNotifications(false)}
                              className="flex items-start space-x-3 p-3 hover:bg-violet-600/20 rounded-lg transition-all group"
                            >
                              <div className="bg-blue-500/20 p-2 rounded-lg">
                                <Star className="h-5 w-5 text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-200 group-hover:text-violet-300">
                                  New Feedback
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notifications.recentFeedback} new review{notifications.recentFeedback > 1 ? 's' : ''} in last 24 hours
                                </p>
                              </div>
                              <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                {notifications.recentFeedback}
                              </span>
                            </Link>
                          )}

                          {notifications.pendingAdmins === 0 && notifications.openReports === 0 && notifications.recentFeedback === 0 && notifications.negativeFeedback === 0 && (
                            <div className="p-8 text-center">
                              <Bell className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                              <p className="text-gray-400 text-sm">No new notifications</p>
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-slate-800/50 border-t border-violet-500/30">
                          <Link
                            to="/mayor/dashboard"
                            onClick={() => setShowNotifications(false)}
                            className="text-xs text-violet-400 hover:text-violet-300 font-medium block text-center"
                          >
                            View Dashboard →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="relative pl-4 border-l border-violet-500/30">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-violet-400 transition-all duration-300 group"
                  >
                    <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-full p-2">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                    <svg className={`h-4 w-4 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-violet-500/30 overflow-hidden animate-slide-down">
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-violet-500/30">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-full p-3">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-100">{user?.name}</p>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center space-x-2">
                          <span className="px-3 py-1 bg-violet-600/30 text-violet-300 text-xs font-semibold rounded-full border border-violet-500/30">
                            {user?.role === 'admin' ? '👑 Admin' : user?.role === 'mayor' ? '🏛️ Mayor' : '👤 Citizen'}
                          </span>
                          {user?.department && (
                            <span className="px-3 py-1 bg-blue-600/30 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">
                              {user.department.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all duration-300 group"
                        >
                          <Home className="h-5 w-5 text-violet-400 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        
                        {!isAdmin && user?.role !== 'mayor' && (
                          <Link
                            to="/my-reports"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all duration-300 group"
                          >
                            <FileText className="h-5 w-5 text-violet-400 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">My Reports</span>
                          </Link>
                        )}

                        {user?.role === 'mayor' && (
                          <>
                            <Link
                              to="/mayor/dashboard?tab=reports"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all duration-300 group"
                            >
                              <FileText className="h-5 w-5 text-violet-400 group-hover:scale-110 transition-transform" />
                              <span className="font-medium">User Reports</span>
                            </Link>
                            <Link
                              to="/admin/reports"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all duration-300 group"
                            >
                              <FileText className="h-5 w-5 text-violet-400 group-hover:scale-110 transition-transform" />
                              <span className="font-medium">View All Reports</span>
                            </Link>
                          </>
                        )}

                        <Link
                          to="/chat"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all duration-300 group"
                        >
                          <MessageCircle className="h-5 w-5 text-violet-400 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Messages</span>
                        </Link>

                        <Link
                          to="/change-password"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all duration-300 group"
                        >
                          <Lock className="h-5 w-5 text-violet-400 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Change Password</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-600/20 rounded-lg transition-all duration-300 group"
                        >
                          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-violet-400 transition-all duration-300 hover:scale-110 transform font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-violet-500/20 animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="px-3 py-3 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-lg mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-full p-2">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-100 text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-violet-600/30 text-violet-300 text-xs font-semibold rounded-full border border-violet-500/30">
                        {user?.role === 'admin' ? '👑 Admin' : user?.role === 'mayor' ? '🏛️ Mayor' : '👤 Citizen'}
                      </span>
                    </div>
                  </div>

                  {/* Mayor Notifications in Mobile */}
                  {user?.role === 'mayor' && (notifications.pendingAdmins > 0 || notifications.openReports > 0 || notifications.recentFeedback > 0 || notifications.negativeFeedback > 0) && (
                    <div className="px-3 py-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg mb-2 border border-red-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bell className="h-5 w-5 text-red-400" />
                        <span className="text-sm font-semibold text-gray-200">Notifications</span>
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                          {notifications.pendingAdmins + notifications.openReports + notifications.recentFeedback + notifications.negativeFeedback}
                        </span>
                      </div>
                      
                      {/* Negative Feedback Alert - Priority */}
                      {notifications.negativeFeedback > 0 && (
                        <div className="mb-2 p-2 bg-orange-600/30 border border-orange-500/50 rounded">
                          <div className="flex items-center space-x-1 mb-1">
                            <ThumbsDown className="h-4 w-4 text-orange-400" />
                            <span className="text-xs font-bold text-orange-300">⚠️ Negative Feedback</span>
                          </div>
                          {notifications.negativeReviews.slice(0, 2).map((review, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                navigate(`/reports/${review.reportId}`);
                              }}
                              className="w-full text-left flex items-center justify-between text-xs text-gray-300 hover:text-orange-300 py-1"
                            >
                              <span className="truncate">• {review.reportTitle}</span>
                              <span className="text-orange-400 ml-2">→</span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {notifications.pendingAdmins > 0 && (
                        <Link
                          to="/mayor/dashboard?tab=pending"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between text-xs text-gray-300 hover:text-violet-300 py-1"
                        >
                          <span>• {notifications.pendingAdmins} Pending Admin{notifications.pendingAdmins > 1 ? 's' : ''}</span>
                          <span className="text-yellow-400">→</span>
                        </Link>
                      )}
                      
                      {notifications.openReports > 0 && (
                        <Link
                          to="/mayor/dashboard?tab=reports"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between text-xs text-gray-300 hover:text-violet-300 py-1"
                        >
                          <span>• {notifications.openReports} Open Report{notifications.openReports > 1 ? 's' : ''}</span>
                          <span className="text-red-400">→</span>
                        </Link>
                      )}
                      
                      {notifications.recentFeedback > 0 && (
                        <Link
                          to="/mayor/dashboard?tab=feedback"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between text-xs text-gray-300 hover:text-violet-300 py-1"
                        >
                          <span>• {notifications.recentFeedback} New Review{notifications.recentFeedback > 1 ? 's' : ''}</span>
                          <span className="text-blue-400">→</span>
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Navigation Links */}
                  {user?.role === 'mayor' ? (
                    <>
                      <Link
                        to="/mayor/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/admin/reports"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all"
                      >
                        <FileText className="h-5 w-5" />
                        <span>All Reports</span>
                      </Link>
                    </>
                  ) : isAdmin ? (
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Analytics</span>
                      </Link>
                      <Link
                        to="/admin/reports"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all"
                      >
                        <Users className="h-5 w-5" />
                        <span>All Reports</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all"
                      >
                        <Home className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/report"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold"
                      >
                        <FileText className="h-5 w-5" />
                        <span>Report Issue</span>
                      </Link>
                      <Link
                        to="/my-reports"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all"
                      >
                        <FileText className="h-5 w-5" />
                        <span>My Reports</span>
                      </Link>
                    </>
                  )}
                  
                  <Link
                    to="/chat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Chat</span>
                  </Link>

                  <Link
                    to="/change-password"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all"
                  >
                    <Lock className="h-5 w-5" />
                    <span>Change Password</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-600/20 rounded-lg transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-gray-300 hover:bg-violet-600/20 rounded-lg transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
