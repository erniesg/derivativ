import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAssessment } from '../contexts/AssessmentContext';
import { useAuth } from '../contexts/AuthContext';
import { SocialLoginButtons } from '../components/auth/LoginButton';
import { Sparkles, FileText, Calculator, Target, Triangle, Square, Palette, Brain } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { userRole, setUser } = useUser();
  const { setAssessmentData } = useAssessment();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    examSession: '',
    school: '',
    subjects: [] as string[],
    gradeLevels: [] as string[],
    schoolType: ''
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'assessment' | 'dashboard'>('dashboard');

  const handleAuthRequired = (mode: 'assessment' | 'dashboard') => {
    if (user) {
      // User is already authenticated, proceed directly
      if (mode === 'assessment') {
        handleTakeAssessment();
      } else {
        handleSubmit();
      }
    } else {
      // Store form data and show auth modal
      sessionStorage.setItem('pendingFormData', JSON.stringify(formData));
      sessionStorage.setItem('authRedirectTo', mode === 'assessment' ? '/assessment' : '/dashboard');
      setAuthMode(mode);
      setShowAuthModal(true);
    }
  };

  const handleSubmit = () => {
    const userData = {
      id: user?.id || Math.random().toString(36).substr(2, 9),
      name: user?.name || 'User',
      email: user?.email || '',
      role: userRole,
      ...formData
    };

    setUser(userData);

    if (userRole === 'student') {
      // Initialize assessment data for students
      const initialAssessment = {
        userId: userData.id,
        topicScores: [
          { topic: 'Algebra', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
          { topic: 'Geometry', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
          { topic: 'Trigonometry', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
          { topic: 'Statistics', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
          { topic: 'Number Theory', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const }
        ],
        overallLevel: 5,
        recommendedTopics: ['Algebra', 'Geometry'],
        lastAssessment: new Date()
      };
      setAssessmentData(initialAssessment);
      navigate('/dashboard');
    } else {
      navigate('/teacher/generate');
    }
  };

  const handleTakeAssessment = () => {
    const userData = {
      id: user?.id || Math.random().toString(36).substr(2, 9),
      name: user?.name || 'User',
      email: user?.email || '',
      role: userRole,
      ...formData
    };

    setUser(userData);

    // Initialize assessment data for students
    const initialAssessment = {
      userId: userData.id,
      topicScores: [
        { topic: 'Algebra', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Geometry', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Trigonometry', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Statistics', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Number Theory', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const }
      ],
      overallLevel: 5,
      recommendedTopics: ['Algebra', 'Geometry'],
      lastAssessment: new Date()
    };
    setAssessmentData(initialAssessment);
    navigate('/assessment');
  };

  const gradeLevels = ['Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13', 'Mixed'];

  const isStudent = userRole === 'student';
  const themeColors = isStudent
    ? { primary: 'blue', secondary: 'purple', gradient: 'from-blue-600 to-purple-600' }
    : { primary: 'green', secondary: 'emerald', gradient: 'from-green-600 to-emerald-600' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-4 lg:space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeColors.gradient}`}>
                  AI that {isStudent ? 'helps you ace' : 'creates perfect lesson materials'}
                </span>
                <br />
                <span className="text-gray-900">
                  {isStudent ? 'your IGCSE math exam' : 'instantly for your classroom'}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                {isStudent
                  ? 'Learn the way you want to'
                  : 'Generate comprehensive teaching materials with AI precision'}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              {isStudent ? (
                <>
                  <div className="text-center space-y-2 lg:space-y-3 p-4 sm:p-0">
                    <div className={`mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-${themeColors.primary}-100 rounded-xl flex items-center justify-center`}>
                      <FileText className={`w-5 h-5 sm:w-6 sm:h-6 text-${themeColors.primary}-600`} />
                    </div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Smart Materials</p>
                  </div>
                  <div className="text-center space-y-2 lg:space-y-3 p-4 sm:p-0">
                    <div className={`mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-${themeColors.secondary}-100 rounded-xl flex items-center justify-center`}>
                      <Target className={`w-5 h-5 sm:w-6 sm:h-6 text-${themeColors.secondary}-600`} />
                    </div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Targeted Practice</p>
                  </div>
                  <div className="text-center space-y-2 lg:space-y-3 p-4 sm:p-0">
                    <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Any Format</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center space-y-2 lg:space-y-3 p-4 sm:p-0">
                    <div className={`mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-${themeColors.primary}-100 rounded-xl flex items-center justify-center`}>
                      <Triangle className={`w-5 h-5 sm:w-6 sm:h-6 text-${themeColors.primary}-600`} />
                    </div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Accurate Diagrams</p>
                  </div>
                  <div className="text-center space-y-2 lg:space-y-3 p-4 sm:p-0">
                    <div className={`mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-${themeColors.secondary}-100 rounded-xl flex items-center justify-center`}>
                      <Square className={`w-5 h-5 sm:w-6 sm:h-6 text-${themeColors.secondary}-600`} />
                    </div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Complete Worksheets</p>
                  </div>
                  <div className="text-center space-y-2 lg:space-y-3 p-4 sm:p-0">
                    <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Teaching Materials</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className={`bg-white rounded-2xl shadow-xl border-2 border-${themeColors.primary}-100 p-6 lg:p-8 order-first lg:order-last`}>
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 text-center lg:text-left">
                {isStudent ? 'Tell us about yourself' : 'Tell us about your teaching needs'}
              </h2>

              {isStudent ? (
                <>
                  {/* Student Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your IGCSE Exam Session
                    </label>
                    <select
                      value={formData.examSession}
                      onChange={(e) => setFormData({ ...formData, examSession: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select your exam session</option>
                      <option value="May/June 2025">May/June 2025</option>
                      <option value="October/November 2025">October/November 2025</option>
                      <option value="May/June 2026">May/June 2026</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Assess Your Current Level
                    </label>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Take Auto-Assessment</h4>
                          <p className="text-sm text-gray-600">Let AI determine your strengths and weaknesses</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAuthRequired('assessment')}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                      >
                        <Target className="inline-block w-4 h-4 mr-2" />
                        Start Assessment Quiz
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Teacher Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Subject Focus
                    </label>
                    <select
                      value={formData.subjects[0] || ''}
                      onChange={(e) => setFormData({ ...formData, subjects: [e.target.value] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="">Select your main subject</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Additional Mathematics">Additional Mathematics</option>
                      <option value="Statistics">Statistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Grade Levels You Teach
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {gradeLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => {
                            const currentLevels = formData.gradeLevels;
                            const newLevels = currentLevels.includes(level)
                              ? currentLevels.filter(l => l !== level)
                              : [...currentLevels, level];
                            setFormData({ ...formData, gradeLevels: newLevels });
                          }}
                          className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${formData.gradeLevels.includes(level)
                            ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Type
                    </label>
                    <select
                      value={formData.schoolType}
                      onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="">Select school type</option>
                      <option value="International School">International School</option>
                      <option value="Local School">Local School</option>
                      <option value="Private Tuition">Private Tuition</option>
                      <option value="Online Teaching">Online Teaching</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School (optional)
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  placeholder={isStudent ? "e.g., Singapore International School" : "e.g., Cambridge International School"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {isStudent && (
                <button
                  type="button"
                  onClick={() => handleAuthRequired('dashboard')}
                  className={`w-full bg-gradient-to-r ${themeColors.gradient} text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200`}
                >
                  <Sparkles className="inline-block w-5 h-5 mr-2" />
                  Ace My Exam →
                </button>
              )}

              {!isStudent && (
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r ${themeColors.gradient} text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200`}
                >
                  <Sparkles className="inline-block w-5 h-5 mr-2" />
                  Start Creating Materials →
                </button>
              )}

              <p className="text-sm text-gray-500 text-center">
                {isStudent
                  ? 'Used to generate UI & personalize your learning experience'
                  : 'This will generate your teaching materials dashboard'
                }
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sign in to {authMode === 'assessment' ? 'Start Your Assessment' : 'Ace Your Exam'}
              </h2>
              <p className="text-gray-600">
                {authMode === 'assessment'
                  ? 'Sign in to take your personalized assessment quiz and track your progress.'
                  : 'Sign in to access your personalized dashboard and start your exam preparation journey.'
                }
              </p>
            </div>

            <SocialLoginButtons />

            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full mt-4 py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;