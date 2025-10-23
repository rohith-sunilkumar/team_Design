import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, FileText, Users, Home, MessageCircle, Lock, Menu, X } from 'lucide-react';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
                {isAdmin ? (
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

                  {/* Navigation Links */}
                  {isAdmin ? (
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
