import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useAssessment } from '../contexts/AssessmentContext';
import { useAuth } from '../contexts/AuthContext';
import { AuthGuard } from '../components/auth/AuthGuard';
import { AuthService } from '../services/auth';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Clock, Award, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const { assessmentData, setAssessmentData } = useAssessment();
  const { user: authUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);

  // Load profile data if authenticated but user data not set
  useEffect(() => {
    if (authUser && !user && !profileLoading) {
      loadUserProfileData();
    }
  }, [authUser, user, profileLoading]);

  const loadUserProfileData = async () => {
    if (!authUser) return;

    setProfileLoading(true);

    try {
      // Load user profile from your backend API
      const { user: profileUser, assessmentData: profileAssessmentData } = await AuthService.loadUserProfile();

      let finalUserData = profileUser;
      let finalAssessmentData = profileAssessmentData;

      // If no profile exists in your backend, create default data
      if (!profileUser) {
        console.log('No profile found, creating default data');
        const defaultData = AuthService.createDefaultUserData(authUser);
        finalUserData = defaultData.user;
        finalAssessmentData = defaultData.assessmentData;
      }

      // Set the user and assessment data
      setUser(finalUserData);
      setAssessmentData(finalAssessmentData);

    } catch (error) {
      console.error('Error loading user profile:', error);

      // Fallback to default data if API fails
      const defaultData = AuthService.createDefaultUserData(authUser);
      setUser(defaultData.user);
      setAssessmentData(defaultData.assessmentData);
    } finally {
      setProfileLoading(false);
    }
  };

  if (!user || !assessmentData || profileLoading) {
    return (
      <AuthGuard
        title="Sign in to Ace Your Exam"
        description="Please sign in to access your personalized dashboard and track your exam preparation progress."
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const topicScores = assessmentData.topicScores;
  const averageScore = topicScores.reduce((sum, topic) => sum + topic.score, 0) / topicScores.length;
  const weakestTopics = topicScores.filter(topic => topic.score < 6).sort((a, b) => a.score - b.score);
  const strongestTopics = topicScores.filter(topic => topic.score >= 7).sort((a, b) => b.score - a.score);

  return (
    <AuthGuard
      title="Sign in to Ace Your Exam"
      description="Please sign in to access your personalized dashboard and track your exam preparation progress."
    >
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8 text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Ready to ace your {user.examSession} exam? Let's continue your journey.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">Overall Score</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}/10</p>
                </div>
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">Topics Mastered</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{strongestTopics.length}/{topicScores.length}</p>
                </div>
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">Study Streak</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">7 days</p>
                </div>
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
            </div>

            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">Time to Exam</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">85 days</p>
                </div>
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </div> */}
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Topic Performance */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Topic Performance</h2>

              <div className="space-y-4">
                {topicScores.map((topic) => (
                  <div key={topic.topic} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{topic.topic}</h3>
                        <span className={`text-sm font-semibold ${topic.score >= 7 ? 'text-green-600' :
                          topic.score >= 5 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                          {topic.score}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${topic.score >= 7 ? 'bg-green-500' :
                            topic.score >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${(topic.score / 10) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {topic.attempts} attempts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* Auto-Assessment */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Auto-Assessment</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Take a personalized quiz adapted to your current level
                </p>
                <Link
                  to="/assessment"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors inline-flex items-center"
                >
                  Start Assessment <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>

              {/* Practice */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Practice</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Jump into practice mode with your weakest topics
                </p>
                <Link
                  to="/practice"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  Start Practice <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>

              {/* Learning */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Learning</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Review notes and primers for your focus areas
                </p>
                <Link
                  to="/learn"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors inline-flex items-center"
                >
                  Start Learning <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>

              {/* Focus Areas */}
              {weakestTopics.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Focus Areas</h3>
                  <div className="space-y-2">
                    {weakestTopics.slice(0, 3).map(topic => (
                      <div key={topic.topic} className="text-sm text-red-700">
                        {topic.topic}: {topic.score}/10
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;