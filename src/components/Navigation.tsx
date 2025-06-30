import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { getFeatureFlag } from '../config/featureFlags';
import {
  Users,
  GraduationCap,
  Target,
  FileText,
  BarChart3,
  FolderOpen,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  PenTool,
  Home,
  Info,
  Play,
  Brain
} from 'lucide-react';

const Navigation: React.FC = () => {
  const userContext = useUser();
  const { user: authUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Defensive destructuring to avoid initialization errors
  const userRole = userContext?.userRole;
  const setUserRole = userContext?.setUserRole || (() => { });
  const roleLoading = userContext?.roleLoading || false;

  // Sync user role with authenticated user's backend profile role
  useEffect(() => {
    if (authUser?.role && authUser.role !== userRole) {
      setUserRole(authUser.role);
    }
  }, [authUser?.role, userRole, setUserRole]);

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

  const renderNavigationLinks = () => {
    // Show nothing while role is being determined
    if (!userRole) {
      return null;
    }

    if (!authUser) {
      // Unauthenticated users - minimal navigation with exploration focus
      return (
        <>
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link
            to="/about"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/about'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Info size={16} />
            <span>About</span>
          </Link>
        </>
      );
    }

    if (userRole === 'teacher') {
      // Teacher navigation - focused on content creation and management
      return (
        <>
          <Link
            to="/teacher/generate"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/teacher/generate'
              ? 'text-green-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <PenTool size={16} />
            <span className="hidden xl:inline">Generate</span>
            <span className="xl:hidden">Create</span>
          </Link>
          <span className="text-gray-400 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 cursor-not-allowed">
            <BookOpen size={16} />
            <span>Library</span>
          </span>
          <span className="text-gray-400 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 cursor-not-allowed">
            <BarChart3 size={16} />
            <span>Analytics</span>
          </span>
          <Link
            to="/about"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/about'
              ? 'text-green-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Info size={16} />
            <span>About</span>
          </Link>
        </>
      );
    } else {
      // Student navigation - focused on learning and assessment
      return (
        <>
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/dashboard'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Home size={16} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/assessment"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/assessment'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Target size={16} />
            <span className="hidden xl:inline">Assessment</span>
            <span className="xl:hidden">Test</span>
          </Link>
          <Link
            to="/practice"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/practice'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Play size={16} />
            <span>Practice</span>
          </Link>
          {getFeatureFlag('LEARN_PAGE') && (
            <Link
              to="/learn"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/learn'
                ? 'text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Brain size={16} />
              <span>Learn</span>
            </Link>
          )}
          <Link
            to="/about"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${location.pathname === '/about'
              ? 'text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Info size={16} />
            <span>About</span>
          </Link>
        </>
      );
    }
  };

  const renderMobileNavigationLinks = () => {
    // Show nothing while role is being determined
    if (!userRole) {
      return null;
    }

    if (!authUser) {
      // Unauthenticated users - mobile
      return (
        <>
          <Link
            to="/"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/'
              ? 'text-blue-600 bg-blue-50 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/about'
              ? 'text-blue-600 bg-blue-50 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Info size={20} />
            <span>About</span>
          </Link>
        </>
      );
    }

    if (userRole === 'teacher') {
      // Teacher navigation - mobile
      return (
        <>
          <Link
            to="/teacher/generate"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/teacher/generate'
              ? 'text-green-600 bg-green-50 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <PenTool size={20} />
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
            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/about'
              ? 'text-green-600 bg-green-50 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Info size={20} />
            <span>About</span>
          </Link>
        </>
      );
    } else {
      // Student navigation - mobile
      return (
        <>
          <Link
            to="/dashboard"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/dashboard'
              ? 'text-blue-600 bg-blue-50 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/assessment"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/assessment'
              ? 'text-blue-600 bg-blue-50 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Target size={20} />
            <span>Assessment</span>
          </Link>
          <Link
            to="/practice"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/practice'
              ? 'text-blue-600 bg-blue-50 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Play size={20} />
            <span>Practice</span>
          </Link>
          {getFeatureFlag('LEARN_PAGE') && (
            <Link
              to="/learn"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/learn'
                ? 'text-blue-600 bg-blue-50 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <Brain size={20} />
              <span>Learn</span>
            </Link>
          )}
          <Link
            to="/about"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${location.pathname === '/about'
              ? 'text-blue-600 bg-blue-50 font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Info size={20} />
            <span>About</span>
          </Link>
        </>
      );
    }
  };

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
              {renderNavigationLinks()}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              {/* Auth Status */}
              {authUser ? (
                <div className="relative z-50">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 ${userRole === 'teacher' ? 'bg-green-50' : userRole === 'student' ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                  >
                    {authUser.avatar_url ? (
                      <img
                        src={authUser.avatar_url}
                        alt={authUser.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userRole === 'teacher' ? 'bg-green-500' : userRole === 'student' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}>
                        <User size={14} className="text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden lg:inline">{authUser.name}</span>
                    {userRole && (
                      <div className={`text-xs px-2 py-1 rounded-full ${userRole === 'teacher'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                        }`}>
                        {userRole}
                      </div>
                    )}
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[60]">
                      <Link
                        to={userRole === 'teacher' ? '/teacher' : '/dashboard'}
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
              ) : (
                // Role Toggle for unauthenticated users - only show if userRole is set
                userRole && (
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
                )
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${userRole === 'teacher' ? 'bg-green-500' : userRole === 'student' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
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
              {/* Role Toggle - Mobile - Only show when not authenticated and role is set */}
              {!authUser && userRole && (
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
              {renderMobileNavigationLinks()}

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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${userRole === 'teacher' ? 'bg-green-500' : userRole === 'student' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}>
                          <User size={18} className="text-white" />
                        </div>
                      )}
                      <div>
                        <span className="text-base font-medium text-gray-900">{authUser.name}</span>
                        {userRole && (
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ml-2 ${userRole === 'teacher'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                            }`}>
                            {userRole}
                          </div>
                        )}
                      </div>
                    </div>
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