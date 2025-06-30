import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AuthGuard } from '../components/auth/AuthGuard';
import { useUser } from '../contexts/UserContext';
import { TldrawWorkArea } from '../components/TldrawWorkArea';
import { Play, BookOpen, FileText, Video, ChevronRight, Clock, Star, Send, Volume2, Pause, SkipForward } from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'video' | 'interactive' | 'notes';
  duration: string;
  description: string;
  progress: number;
  rating: number;
  videoUrl?: string;
  hasQuiz?: boolean;
  hasCanvas?: boolean;
}

interface PersonalizedVideo {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  tailoredFor: string;
}

const Learn: React.FC = () => {
  const { userRole } = useUser();

  // Redirect teachers to generation page
  if (userRole !== 'student') {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
            <p className="text-gray-600">Learning modules are only available to students.</p>
            <button
              onClick={() => window.location.href = '/teacher/generate'}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Teacher Dashboard
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [showPersonalizedVideos, setShowPersonalizedVideos] = useState(false);

  const topics = ['Algebra', 'Geometry', 'Trigonometry', 'Statistics', 'Number Theory'];

  const learningModules: LearningModule[] = [
    {
      id: '1',
      title: 'Quadratic Equations Interactive Primer',
      topic: 'Algebra',
      difficulty: 'medium',
      type: 'interactive',
      duration: '25 min',
      description: 'Learn quadratic equations through video lessons and interactive practice',
      progress: 75,
      rating: 4.8,
      videoUrl: 'https://example.com/quadratic-video',
      hasQuiz: true,
      hasCanvas: true
    },
    {
      id: '2',
      title: 'Triangle Properties Video Series',
      topic: 'Geometry',
      difficulty: 'easy',
      type: 'interactive',
      duration: '15 min',
      description: 'Interactive video primer with canvas exercises on triangle properties',
      progress: 0,
      rating: 4.9,
      videoUrl: 'https://example.com/triangle-video',
      hasQuiz: true,
      hasCanvas: true
    },
    {
      id: '3',
      title: 'Sine and Cosine Rules Notes',
      topic: 'Trigonometry',
      difficulty: 'hard',
      type: 'notes',
      duration: '30 min',
      description: 'Comprehensive study notes with worked examples',
      progress: 100,
      rating: 4.7
    },
    {
      id: '4',
      title: 'Statistical Measures Primer',
      topic: 'Statistics',
      difficulty: 'medium',
      type: 'interactive',
      duration: '20 min',
      description: 'Video-based learning with interactive quizzes and practice',
      progress: 40,
      rating: 4.6,
      videoUrl: 'https://example.com/stats-video',
      hasQuiz: true,
      hasCanvas: false
    }
  ];

  const personalizedVideos: PersonalizedVideo[] = [
    {
      id: 'p1',
      title: 'Advanced Quadratic Applications',
      description: 'Challenging problems tailored to your current algebra level',
      difficulty: 'hard',
      duration: '12 min',
      tailoredFor: 'Based on your algebra progress'
    },
    {
      id: 'p2',
      title: 'Real-world Triangle Problems',
      description: 'Engineering applications of triangle properties',
      difficulty: 'medium',
      duration: '8 min',
      tailoredFor: 'Matches your interests in practical applications'
    }
  ];

  const handleSaveWork = (data: any) => {
    console.log('Saving learning work:', data);
    // Here you could save the learning work to your backend
  };

  const handleClearWork = () => {
    console.log('Clearing learning work area');
    // tldraw handles this internally
  };

  const startModule = (moduleId: string) => {
    setActiveModule(moduleId);
    setVideoProgress(0);
    setQuizAnswer('');
    setShowPersonalizedVideos(false);
  };

  const closeModule = () => {
    setActiveModule(null);
    setIsVideoPlaying(false);
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);

    if (!isVideoPlaying) {
      // Simulate video progress
      const interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsVideoPlaying(false);
            setShowPersonalizedVideos(true);
            return 100;
          }
          return prev + 2;
        });
      }, 200);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredModules = learningModules.filter(module => {
    const topicMatch = selectedTopic === 'all' || module.topic === selectedTopic;
    const typeMatch = selectedType === 'all' || module.type === selectedType;
    return topicMatch && typeMatch;
  });

  const activeModuleData = activeModule ? learningModules.find(m => m.id === activeModule) : null;

  if (activeModule && activeModuleData) {
    return (
      <AuthGuard
        title="Sign in to Learn"
        description="Please sign in to access interactive learning modules and track your progress."
      >
        <div className="min-h-screen bg-gray-50">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{activeModuleData.title}</h1>
                <p className="text-gray-600">{activeModuleData.description}</p>
              </div>
              <button
                onClick={closeModule}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Back to Learning
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="aspect-video bg-gray-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={toggleVideo}
                        className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      >
                        {isVideoPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-white text-sm">{Math.round(videoProgress)}%</span>
                        <div className="flex-1 bg-white/20 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-200"
                            style={{ width: `${videoProgress}%` }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-4 h-4 text-white" />
                          <SkipForward className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {activeModuleData.hasQuiz && videoProgress > 50 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Check</h3>
                    <p className="text-gray-700 mb-4">
                      What is the discriminant of the quadratic equation x² - 4x + 3 = 0?
                    </p>
                    <div className="space-y-2 mb-4">
                      {['4', '16', '1', '-8'].map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setQuizAnswer(option)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${quizAnswer === option
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={!quizAnswer}
                      className={`px-4 py-2 rounded-lg font-medium ${quizAnswer
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      Submit Answer
                    </button>
                  </div>
                )}

                {showPersonalizedVideos && (
                  <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Personalized for You</h3>
                    <p className="text-purple-100 mb-4">Based on your progress, here are some tailored challenges:</p>

                    <div className="space-y-3">
                      {personalizedVideos.map((video) => (
                        <div key={video.id} className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{video.title}</h4>
                            <span className="text-sm">{video.duration}</span>
                          </div>
                          <p className="text-sm text-purple-100 mb-2">{video.description}</p>
                          <p className="text-xs text-purple-200">{video.tailoredFor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {activeModuleData.hasCanvas && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Practice Area</h3>
                    <div className="text-sm text-gray-500">
                      Take notes and practice as you learn
                    </div>
                  </div>

                  <TldrawWorkArea
                    height="400px"
                    onSave={handleSaveWork}
                    onClear={handleClearWork}
                    className="mb-4"
                    persistenceKey="tldraw-work-area-learn"
                  />

                  <div className="text-sm text-gray-500 bg-green-50 p-3 rounded-lg">
                    <p><strong>📝 Learning tip:</strong> Use the drawing tools to take notes, create diagrams, or practice problems. Your work is automatically saved.</p>
                  </div>

                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    <Send size={16} className="inline mr-2" />
                    Submit Work
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard
      title="Sign in to Learn"
      description="Please sign in to access interactive learning modules and track your progress."
    >
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Learning</h1>
            <p className="text-gray-600">
              Choose from personalized video content, interactive primers, and comprehensive notes
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Topics</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="video">Video Lessons</option>
                  <option value="interactive">Interactive Primers</option>
                  <option value="notes">Study Notes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden group cursor-pointer"
              >
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${module.type === 'video' ? 'bg-red-100 text-red-600' :
                        module.type === 'interactive' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'}`}>
                        {module.type === 'video' ? <Video size={16} /> :
                          module.type === 'interactive' ? <Play size={16} /> : <FileText size={16} />}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{module.topic}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{module.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-500" />
                        <span>{module.rating}</span>
                      </div>
                    </div>
                  </div>

                  {module.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {module.type === 'interactive' && (
                    <div className="flex items-center space-x-2 mb-4">
                      {module.hasQuiz && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          Interactive Quiz
                        </span>
                      )}
                      {module.hasCanvas && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Canvas Practice
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => startModule(module.id)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <span>{module.progress === 100 ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Personalized for You</h2>
            <p className="text-blue-100 mb-6">
              Based on your assessment results, we recommend focusing on these areas to improve your weakest topics.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-1">Focus Area: Algebra</h3>
                <p className="text-sm text-blue-100">Your current score: 4/10</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-1">Recommended: Interactive Primers</h3>
                <p className="text-sm text-blue-100">Video + practice combination works best for you</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-1">Study Time: 30 min/day</h3>
                <p className="text-sm text-blue-100">Optimal for your schedule</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Learn;