import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAssessment } from '../contexts/AssessmentContext';
import { Sparkles, FileText, Calculator, Target, Triangle, Square, Palette, Brain } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { userRole, setUser } = useUser();
  const { setAssessmentData } = useAssessment();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    examSession: '',
    school: '',
    subjects: [] as string[],
    gradeLevels: [] as string[],
    schoolType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'User',
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
      id: Math.random().toString(36).substr(2, 9),
      name: 'User',
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeColors.gradient}`}>
                  AI that {isStudent ? 'helps you ace' : 'creates perfect lesson materials'}
                </span>
                <br />
                <span className="text-gray-900">
                  {isStudent ? 'your IGCSE math exam' : 'instantly for your classroom'}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg">
                {isStudent 
                  ? 'Learn the way you want to' 
                  : 'Generate comprehensive teaching materials with AI precision'}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6">
              {isStudent ? (
                <>
                  <div className="text-center space-y-3">
                    <div className={`mx-auto w-12 h-12 bg-${themeColors.primary}-100 rounded-xl flex items-center justify-center`}>
                      <FileText className={`w-6 h-6 text-${themeColors.primary}-600`} />
                    </div>
                    <p className="font-medium text-gray-900">Smart Materials</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className={`mx-auto w-12 h-12 bg-${themeColors.secondary}-100 rounded-xl flex items-center justify-center`}>
                      <Target className={`w-6 h-6 text-${themeColors.secondary}-600`} />
                    </div>
                    <p className="font-medium text-gray-900">Targeted Practice</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="font-medium text-gray-900">Any Format</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center space-y-3">
                    <div className={`mx-auto w-12 h-12 bg-${themeColors.primary}-100 rounded-xl flex items-center justify-center`}>
                      <Triangle className={`w-6 h-6 text-${themeColors.primary}-600`} />
                    </div>
                    <p className="font-medium text-gray-900">Accurate Diagrams</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className={`mx-auto w-12 h-12 bg-${themeColors.secondary}-100 rounded-xl flex items-center justify-center`}>
                      <Square className={`w-6 h-6 text-${themeColors.secondary}-600`} />
                    </div>
                    <p className="font-medium text-gray-900">Complete Worksheets</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Palette className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="font-medium text-gray-900">Teaching Materials</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className={`bg-white rounded-2xl shadow-xl border-2 border-${themeColors.primary}-100 p-8`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
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
                      onChange={(e) => setFormData({...formData, examSession: e.target.value})}
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
                        onClick={handleTakeAssessment}
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
                      onChange={(e) => setFormData({...formData, subjects: [e.target.value]})}
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
                            setFormData({...formData, gradeLevels: newLevels});
                          }}
                          className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                            formData.gradeLevels.includes(level)
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
                      onChange={(e) => setFormData({...formData, schoolType: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  placeholder={isStudent ? "e.g., Singapore International School" : "e.g., Cambridge International School"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {isStudent && (
                <button
                  type="submit"
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
    </div>
  );
};

export default LandingPage;