import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../contexts/RoleContext';
import BoltBadge from '../components/BoltBadge';
import { Sparkles, FileText, Calculator, Target, Triangle, Square, Palette, Brain, BookOpen, Users } from 'lucide-react';
import { SocialLoginButtons } from '../components/auth/LoginButton';

const LandingPage: React.FC = () => {
  const { selectedRole, setSelectedRole } = useRole();
  const { userRole, setUserRole, roleLoading } = useUser();
  const { user: authUser, loading } = useAuth();
  const navigate = useNavigate();

  // Sync user role with authenticated user's backend profile role
  useEffect(() => {
    if (authUser?.role && authUser.role !== userRole) {
      setUserRole(authUser.role);
    }
  }, [authUser?.role, userRole, setUserRole]);

  // If user is authenticated and still loading (auth or role), show loading state
  if ((authUser && loading) || (authUser && roleLoading) || (authUser && !userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render role-specific content until userRole is determined
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  let isStudent = selectedRole === 'student';

  const themeColors = isStudent
    ? { primary: 'blue', secondary: 'purple', gradient: 'from-blue-600 to-purple-600' }
    : { primary: 'green', secondary: 'emerald', gradient: 'from-green-600 to-emerald-600' };

  const handleNavigateToApp = () => {
    if (userRole === 'student') {
      navigate('/dashboard');
    } else {
      navigate('/teacher/generate');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Bolt.new Badge */}
      <BoltBadge variant="black" position="bottom-right" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center space-y-8 lg:space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeColors.gradient}`}>
                AI-Powered
              </span>
              <br />
              <span className="text-gray-900">
                IGCSE Mathematics Platform
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              {isStudent
                ? 'Personalized learning and assessment tools to help you excel in your IGCSE Math exams'
                : 'Generate comprehensive teaching materials and assessments with AI precision'
              }
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {isStudent ? (
              <>
                <div className="text-center space-y-4 p-6">
                  <div className={`mx-auto w-16 h-16 bg-${themeColors.primary}-100 rounded-2xl flex items-center justify-center`}>
                    <Brain className={`w-8 h-8 text-${themeColors.primary}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Smart Assessment</h3>
                  <p className="text-gray-600">AI-powered assessments that adapt to your learning level and identify areas for improvement</p>
                </div>
                <div className="text-center space-y-4 p-6">
                  <div className={`mx-auto w-16 h-16 bg-${themeColors.secondary}-100 rounded-2xl flex items-center justify-center`}>
                    <Target className={`w-8 h-8 text-${themeColors.secondary}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Targeted Practice</h3>
                  <p className="text-gray-600">Personalized practice problems focused on your weakest topics and exam requirements</p>
                </div>
                <div className="text-center space-y-4 p-6">
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Interactive Learning</h3>
                  <p className="text-gray-600">Engaging materials and step-by-step solutions to master complex mathematical concepts</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center space-y-4 p-6">
                  <div className={`mx-auto w-16 h-16 bg-${themeColors.primary}-100 rounded-2xl flex items-center justify-center`}>
                    <Triangle className={`w-8 h-8 text-${themeColors.primary}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Curriculum Aligned</h3>
                  <p className="text-gray-600">All materials are perfectly aligned with Cambridge IGCSE Mathematics syllabus requirements</p>
                </div>
                <div className="text-center space-y-4 p-6">
                  <div className={`mx-auto w-16 h-16 bg-${themeColors.secondary}-100 rounded-2xl flex items-center justify-center`}>
                    <Square className={`w-8 h-8 text-${themeColors.secondary}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Instant Generation</h3>
                  <p className="text-gray-600">Create worksheets, assessments, and teaching materials in seconds with our AI engine</p>
                </div>
                <div className="text-center space-y-4 p-6">
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Flexible Formats</h3>
                  <p className="text-gray-600">Multiple output formats including PDFs, interactive content, and printable materials</p>
                </div>
              </>
            )}
          </div>

          {/* Call to Action */}
          <div className="max-w-2xl mx-auto space-y-6">
            <div className={`bg-gradient-to-r ${themeColors.gradient} rounded-2xl p-8 text-white`}>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                {authUser
                  ? `Welcome ${authUser.name}!`
                  : `Welcome ${isStudent ? 'Students' : 'Teachers'}!`
                }
              </h2>
              <p className="text-lg mb-6 opacity-90">
                {authUser ? (
                  isStudent
                    ? 'Ready to boost your IGCSE Math performance? Access your personalized dashboard to start learning.'
                    : 'Ready to create amazing teaching materials? Access your generation tools to get started.'
                ) : (
                  isStudent
                    ? 'Sign in to access personalized learning tools, adaptive assessments, and track your IGCSE Math progress.'
                    : 'Sign in to generate comprehensive teaching materials and assessments with AI precision.'
                )}
              </p>

              {authUser ? (
                <button
                  onClick={handleNavigateToApp}
                  className="bg-white text-gray-900 py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center mx-auto"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isStudent ? 'Go to Dashboard' : 'Start Creating Materials'}
                </button>
              ) : (
                <div className="max-w-sm mx-auto">
                  <SocialLoginButtons className="space-y-3" />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500">
              {authUser ? (
                isStudent
                  ? 'Access your personalized learning dashboard, take assessments, and track your progress.'
                  : 'Create worksheets, assessments, and teaching materials tailored to your classroom needs.'
              ) : (
                isStudent
                  ? 'Get started with AI-powered learning tools designed specifically for IGCSE Mathematics students.'
                  : 'Join thousands of educators using AI to create engaging mathematics materials.'
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;