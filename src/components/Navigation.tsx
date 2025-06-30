import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../contexts/RoleContext';
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
  const { selectedRole, setSelectedRole } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Get role loading state from UserContext for authenticated users
  const roleLoading = userContext?.roleLoading || false;

  // For authenticated users, sync with their backend profile role
  // For unauthenticated users, use the globally selected role
  const currentRole = authUser?.role || selectedRole;

  // Sync global role selection with authenticated user's backend profile role
  useEffect(() => {
    if (authUser?.role && authUser.role !== selectedRole) {
      setSelectedRole(authUser.role);
    }
  }, [authUser?.role, selectedRole, setSelectedRole]);

  const handleRoleSwitch = () => {
    const newRole = currentRole === 'student' ? 'student' : 'teacher';
    setSelectedRole(newRole);
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
    if (!currentRole) {
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

    if (currentRole === 'teacher') {
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
    if (!currentRole) {
      return null;
    }

    if (!authUser) {
      // Unauthenticated users - mobile
      return (
        <>
          <Link
            to="/"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${location.pathname === '/'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${location.pathname === '/about'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Info size={20} />
            <span>About</span>
          </Link>
        </>
      );
    }

    if (currentRole === 'teacher') {
      // Teacher navigation - mobile
      return (
        <>
          <Link
            to="/teacher/generate"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${location.pathname === '/teacher/generate'
              ? 'text-green-600 bg-green-50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <PenTool size={20} />
            <span>Generate Content</span>
          </Link>
          <div className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-400 cursor-not-allowed">
            <BookOpen size={20} />
            <span>Library</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-400 cursor-not-allowed">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </div>
          <Link
            to="/about"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${location.pathname === '/about'
              ? 'text-green-600 bg-green-50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
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
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${location.pathname === '/dashboard'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/assessment"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${location.pathname === '/assessment'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Target size={20} />
            <span>Assessment</span>
          </Link>
          <Link
            to="/practice"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${location.pathname === '/practice'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Play size={20} />
            <span>Practice</span>
          </Link>
          {getFeatureFlag('LEARN_PAGE') && (
            <Link
              to="/learn"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${location.pathname === '/learn'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <Brain size={20} />
              <span>Learn</span>
            </Link>
          )}
          <Link
            to="/about"
            onClick={() => setShowMobileMenu(false)}
            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${location.pathname === '/about'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Info size={20} />
            <span>About</span>
          </Link>
        </>
      );
    }
  };

  // Don't render anything while auth is loading
  if (roleLoading && authUser) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900">Derivativ</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900">Derivativ</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {renderNavigationLinks()}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* User Menu for authenticated users */}
            {authUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 ${currentRole === 'teacher' ? 'bg-green-50' : currentRole === 'student' ? 'bg-blue-50' : 'bg-gray-50'
                    }`}
                >
                  {authUser.avatar_url ? (
                    <img
                      src={authUser.avatar_url}
                      alt={authUser.name || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentRole === 'teacher' ? 'bg-green-500' : currentRole === 'student' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                      <User size={12} className="text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{authUser.name}</span>
                  {currentRole && (
                    <div className={`text-xs px-2 py-1 rounded-full ${currentRole === 'teacher'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                      }`}>
                      {currentRole}
                    </div>
                  )}
                  <ChevronDown size={14} className="text-gray-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to={currentRole === 'teacher' ? '/teacher' : '/dashboard'}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Role Toggle for unauthenticated users - only show if currentRole is set */}
                {currentRole && (
                  <div className="flex bg-gray-100 rounded-full p-1">
                    <button
                      onClick={() => setSelectedRole('student')}
                      className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 rounded-full transition-all duration-300 ${currentRole === 'student'
                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      <GraduationCap size={16} />
                      <span className="text-sm">Student</span>
                    </button>
                    <button
                      onClick={() => setSelectedRole('teacher')}
                      className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 rounded-full transition-all duration-300 ${currentRole === 'teacher'
                        ? 'bg-white text-green-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      <Users size={16} />
                      <span className="text-sm">Teacher</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {renderMobileNavigationLinks()}

            {/* Mobile User Section */}
            {authUser ? (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                  {authUser.avatar_url ? (
                    <img
                      src={authUser.avatar_url}
                      alt={authUser.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentRole === 'teacher' ? 'bg-green-500' : currentRole === 'student' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{authUser.name}</div>
                    <div className="text-sm text-gray-500">{authUser.email}</div>
                  </div>
                  {currentRole && (
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ml-2 ${currentRole === 'teacher'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                      }`}>
                      {currentRole}
                    </div>
                  )}
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <LogOut size={20} className="mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              /* Mobile Role Toggle for unauthenticated users */
              currentRole && (
                <div className="border-t border-gray-200 pt-4 pb-3 px-4">
                  <div className="flex rounded-full bg-gray-100 p-1">
                    <button
                      onClick={() => setSelectedRole('student')}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-full transition-all duration-300 ${currentRole === 'student'
                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                        : 'text-gray-600'
                        }`}
                    >
                      <GraduationCap size={18} />
                      <span>Student</span>
                    </button>
                    <button
                      onClick={() => setSelectedRole('teacher')}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-full transition-all duration-300 ${currentRole === 'teacher'
                        ? 'bg-white text-green-600 shadow-sm font-medium'
                        : 'text-gray-600'
                        }`}
                    >
                      <Users size={18} />
                      <span>Teacher</span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;