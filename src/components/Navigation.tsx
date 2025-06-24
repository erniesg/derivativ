import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Users, GraduationCap, Target, FileText, BarChart3, FolderOpen } from 'lucide-react';

const Navigation: React.FC = () => {
  const { userRole, setUserRole } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSwitch = () => {
    const newRole = userRole === 'student' ? 'teacher' : 'student';
    setUserRole(newRole);
    navigate('/');
  };

  const isTeacherPage = location.pathname.startsWith('/teacher');

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className={`text-3xl font-bold text-black anta-regular transition-colors duration-300`}>
              ∂
            </div>
            <span className="text-xl font-semibold text-gray-900">Derivativ</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {isTeacherPage ? (
              // Teacher Navigation - Replace Practice/Learn with teacher-specific options
              <>
                <Link 
                  to="/teacher/generate" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                    location.pathname === '/teacher/generate' 
                      ? 'text-green-600 font-semibold' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText size={16} />
                  <span>Generate Materials</span>
                </Link>
                <Link 
                  to="/teacher" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                    location.pathname === '/teacher' 
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
                <Link 
                  to="/learn" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Learn
                </Link>
                {userRole === 'student' && (
                  <Link 
                    to="/assessment" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Target size={16} />
                    <span>Auto-Assessment</span>
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

          {/* Role Toggle */}
          <div className="flex items-center space-x-3">
            {isTeacherPage && (
              <div className="text-sm text-gray-500 bg-green-50 px-3 py-1 rounded-full">
                Teacher Dashboard
              </div>
            )}
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={handleRoleSwitch}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  userRole === 'student' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <GraduationCap size={16} />
                <span className="text-sm font-medium">Students</span>
              </button>
              <button
                onClick={handleRoleSwitch}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  userRole === 'teacher' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Users size={16} />
                <span className="text-sm font-medium">Teachers</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;