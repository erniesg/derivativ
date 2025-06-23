import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Users, GraduationCap, Target } from 'lucide-react';

const Navigation: React.FC = () => {
  const { userRole, setUserRole } = useUser();
  const navigate = useNavigate();

  const handleRoleSwitch = () => {
    const newRole = userRole === 'student' ? 'teacher' : 'student';
    setUserRole(newRole);
    navigate('/');
  };

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
          </div>

          {/* Role Toggle */}
          <div className="flex items-center space-x-3">
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