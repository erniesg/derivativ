import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useAssessment } from '../contexts/AssessmentContext';
import { Link } from 'react-router-dom';
import { Target, BookOpen, TrendingUp, Clock, Award, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const { assessmentData } = useAssessment();

  if (!user || !assessmentData) {
    return <div>Loading...</div>;
  }

  const topicScores = assessmentData.topicScores;
  const averageScore = topicScores.reduce((sum, topic) => sum + topic.score, 0) / topicScores.length;
  const weakestTopics = topicScores.filter(topic => topic.score < 6).sort((a, b) => a.score - b.score);
  const strongestTopics = topicScores.filter(topic => topic.score >= 7).sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Ready to ace your {user.examSession} exam? Let's continue your journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                <p className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}/10</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Topics Mastered</p>
                <p className="text-2xl font-bold text-gray-900">{strongestTopics.length}/{topicScores.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Time to Exam</p>
                <p className="text-2xl font-bold text-gray-900">85 days</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Topic Performance */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Topic Performance</h2>
            
            <div className="space-y-4">
              {topicScores.map((topic) => (
                <div key={topic.topic} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{topic.topic}</h3>
                      <span className={`text-sm font-semibold ${
                        topic.score >= 7 ? 'text-green-600' : 
                        topic.score >= 5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {topic.score}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          topic.score >= 7 ? 'bg-green-500' : 
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
  );
};

export default Dashboard;