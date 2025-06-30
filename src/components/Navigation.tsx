import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { getFeatureFlag } from '../config/featureFlags';
import { Users, GraduationCap, Target, FileText, BarChart3, FolderOpen, LogOut, User, ChevronDown, Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const userContext = useUser();
  const { user: authUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Defensive destructuring to avoid initialization errors
  const userRole = userContext?.userRole || 'teacher';
  const setUserRole = userContext?.setUserRole || (() => { });

  const handleRoleSwitch = () => {
    const newRole = userRole === 'student' ? 'teacher' : 'student';
    setUserRole(newRole);
    navigate('/');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isTeacherPage = location?.pathname?.startsWith('/teacher') || false;

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="text-2xl sm:text-3xl font-bold text-black anta-regular transition-colors duration-300">
                ∂
              </div>
              <span className="text-lg sm:text-xl font-semibold text-gray-900">Derivativ</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex space-x-6">
              {userRole === 'teacher' && isTeacherPage ? (
                // Teacher Navigation
                <>
                  <Link
                    to="/teacher/generate"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/teacher/generate'
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <FileText size={16} />
                    <span className="hidden xl:inline">Generate Materials</span>
                    <span className="xl:hidden">Generate</span>
                  </Link>
                  <Link
                    to="/teacher"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/teacher'
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <FolderOpen size={16} />
                    <span>Library</span>
                  </Link>
                  <span className="text-gray-400 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 cursor-not-allowed">
                    <BarChart3 size={16} />
                    <span>Analytics</span>
                  </span>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    About
                  </Link>
                </>
              ) : (
                // Student/General Navigation
                <>
                  <Link
                    to="/practice"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Practice
                  </Link>
                  {getFeatureFlag('LEARN_PAGE') && (
                    <Link
                      to="/learn"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Learn
                    </Link>
                  )}
                  {userRole === 'student' && (
                    <Link
                      to="/assessment"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Target size={16} />
                      <span className="hidden xl:inline">Auto-Assessment</span>
                      <span className="xl:hidden">Assessment</span>
                    </Link>
                  )}
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    About
                  </Link>
                </>
              )}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              {/* Auth Status */}
              {authUser ? (
                <div className="relative z-50">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    {authUser.avatar_url ? (
                      <img
                        src={authUser.avatar_url}
                        alt={authUser.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden lg:inline">{authUser.name}</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[60]">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User size={16} />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Teacher Dashboard Badge */}
              {userRole === 'teacher' && isTeacherPage && (
                <div className="text-xs lg:text-sm text-gray-500 bg-green-50 px-2 lg:px-3 py-1 rounded-full">
                  <span className="hidden lg:inline">Teacher Dashboard</span>
                  <span className="lg:hidden">Teacher</span>
                </div>
              )}

              {/* Role Toggle - Only show when not authenticated */}
              {!authUser && (
                <div className="flex bg-gray-100 rounded-full p-1">
                  <button
                    onClick={handleRoleSwitch}
                    className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 rounded-full transition-all duration-300 ${userRole === 'student'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    <GraduationCap size={16} />
                    <span className="text-xs lg:text-sm font-medium">Students</span>
                  </button>
                  <button
                    onClick={handleRoleSwitch}
                    className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 rounded-full transition-all duration-300 ${userRole === 'teacher'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    <Users size={16} />
                    <span className="text-xs lg:text-sm font-medium">Teachers</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile User Avatar */}
              {authUser && (
                <div className="flex items-center">
                  {authUser.avatar_url ? (
                    <img
                      src={authUser.avatar_url}
                      alt={authUser.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-30">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {/* Role Toggle - Mobile - Only show when not authenticated */}
              {!authUser && (
                <div className="flex bg-gray-100 rounded-full p-1 mb-4">
                  <button
                    onClick={handleRoleSwitch}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-full transition-all duration-300 ${userRole === 'student'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600'
                      }`}
                  >
                    <GraduationCap size={16} />
                    <span className="text-sm font-medium">Students</span>
                  </button>
                  <button
                    onClick={handleRoleSwitch}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-full transition-all duration-300 ${userRole === 'teacher'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'text-gray-600'
                      }`}
                  >
                    <Users size={16} />
                    <span className="text-sm font-medium">Teachers</span>
                  </button>
                </div>
              )}

              {/* Navigation Links - Mobile */}
              {userRole === 'teacher' && isTeacherPage ? (
                // Teacher Navigation - Mobile
                <>
                  <Link
                    to="/teacher/generate"
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/teacher/generate'
                      ? 'text-green-600 bg-green-50 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <FileText size={20} />
                    <span>Generate Materials</span>
                  </Link>
                  <Link
                    to="/teacher"
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/teacher'
                      ? 'text-green-600 bg-green-50 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <FolderOpen size={20} />
                    <span>Library</span>
                  </Link>
                  <div className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-400 cursor-not-allowed">
                    <BarChart3 size={20} />
                    <span>Analytics</span>
                  </div>
                  <Link
                    to="/about"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>About</span>
                  </Link>
                </>
              ) : (
                // Student/General Navigation - Mobile
                <>
                  <Link
                    to="/practice"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>Practice</span>
                  </Link>
                  {getFeatureFlag('LEARN_PAGE') && (
                    <Link
                      to="/learn"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span>Learn</span>
                    </Link>
                  )}
                  {userRole === 'student' && (
                    <Link
                      to="/assessment"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Target size={20} />
                      <span>Auto-Assessment</span>
                    </Link>
                  )}
                  <Link
                    to="/about"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>About</span>
                  </Link>
                </>
              )}

              {/* User Actions - Mobile */}
              {authUser && (
                <>
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                      {authUser.avatar_url ? (
                        <img
                          src={authUser.avatar_url}
                          alt={authUser.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                      )}
                      <span className="text-base font-medium text-gray-900">{authUser.name}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <User size={20} />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <LogOut size={20} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-20"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default Navigation;