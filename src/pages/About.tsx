import React from 'react';
import { Users, Target, BookOpen, Globe, TrendingUp, CheckCircle, Clock, Star, Award, BarChart } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Ali',
      role: 'Co-Founder & AI Engineer',
      description: 'Passionate about leveraging AI to revolutionize education and make learning accessible to everyone.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    },
    {
      name: 'Ernie',
      role: 'Co-Founder & Education Specialist',
      description: 'Former IGCSE math teacher with 8+ years of experience helping students achieve their academic goals.',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    }
  ];

  const whyPoints = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Personalized Learning',
      description: 'Our AI adapts to each student\'s learning pace and style, providing targeted practice where it\'s needed most.'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Comprehensive Coverage',
      description: 'Complete IGCSE Math curriculum with interactive content, practice questions, and detailed explanations.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Real-time Progress Tracking',
      description: 'Advanced analytics help students and teachers monitor progress and identify areas for improvement.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Accessible Anywhere',
      description: 'Learn from anywhere with our web-based platform that works on all devices.'
    }
  ];

  const roadmapData = {
    'IGCSE Mathematics': {
      total: 4930,
      complete: 4930,
      inProgress: 0,
      planned: 0,
      topics: [
        { name: 'Algebra', questions: 1250, status: 'complete' },
        { name: 'Geometry', questions: 980, status: 'complete' },
        { name: 'Trigonometry', questions: 750, status: 'complete' },
        { name: 'Statistics', questions: 650, status: 'complete' },
        { name: 'Number Theory', questions: 850, status: 'complete' },
        { name: 'Functions', questions: 450, status: 'complete' }
      ]
    },
    'IB Mathematics': {
      total: 3700,
      complete: 0,
      inProgress: 0,
      planned: 3700,
      topics: [
        { name: 'Analysis & Approaches SL', questions: 800, status: 'planned' },
        { name: 'Analysis & Approaches HL', questions: 1200, status: 'planned' },
        { name: 'Applications & Interpretation SL', questions: 750, status: 'planned' },
        { name: 'Applications & Interpretation HL', questions: 950, status: 'planned' }
      ]
    },
    'International Primary': {
      total: 1450,
      complete: 0,
      inProgress: 0,
      planned: 1450,
      topics: [
        { name: 'Basic Arithmetic', questions: 500, status: 'planned' },
        { name: 'Fractions & Decimals', questions: 400, status: 'planned' },
        { name: 'Geometry Basics', questions: 300, status: 'planned' },
        { name: 'Measurement', questions: 250, status: 'planned' }
      ]
    },
    'East Asia Standardized': {
      total: 2400,
      complete: 0,
      inProgress: 0,
      planned: 2400,
      topics: [
        { name: 'Singapore O-Level', questions: 600, status: 'planned' },
        { name: 'Hong Kong DSE', questions: 550, status: 'planned' },
        { name: 'Chinese Gaokao Math', questions: 800, status: 'planned' },
        { name: 'Japanese University Entrance', questions: 450, status: 'planned' }
      ]
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-600';
      case 'in-progress': return 'text-yellow-600';
      case 'planned': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'planned': return <Star className="w-4 h-4" />;
      default: return null;
    }
  };

  const totalQuestions = Object.values(roadmapData).reduce((sum, category) => sum + category.total, 0);
  const completedQuestions = Object.values(roadmapData).reduce((sum, category) => sum + category.complete, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Derivativ</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing math education with AI-powered personalized learning that adapts to every student's unique needs.
          </p>
        </div>

        {/* Mission Statement */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To democratize quality math education by providing AI-powered, personalized learning experiences 
              that help every student reach their full potential, regardless of their starting point or learning style.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Two passionate educators and technologists working together to make quality math education accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow duration-300">
                <div className="mb-6">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                </div>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Derivativ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Derivativ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe every student deserves personalized, effective math education that adapts to their learning style and pace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyPoints.map((point, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{point.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compact Content Roadmap Dashboard */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Content Roadmap</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive database spanning multiple curricula and grade levels.
            </p>
          </div>

          {/* Overall Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">{totalQuestions.toLocaleString()}</div>
                <div className="text-blue-100">Total Questions</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{completedQuestions.toLocaleString()}</div>
                <div className="text-blue-100">Ready Now</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{Object.keys(roadmapData).length}</div>
                <div className="text-blue-100">Curricula</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">
                  {Math.round((completedQuestions / totalQuestions) * 100)}%
                </div>
                <div className="text-blue-100">Complete</div>
              </div>
            </div>
          </div>

          {/* Curriculum Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(roadmapData).map(([curriculum, data]) => (
              <div key={curriculum} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{curriculum}</h3>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(data.complete > 0 ? 'complete' : 'planned')}
                    <span className={`text-sm font-medium ${getStatusColor(data.complete > 0 ? 'complete' : 'planned')}`}>
                      {data.complete > 0 ? 'Ready' : 'Planned'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{data.complete.toLocaleString()} / {data.total.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${data.complete > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                      style={{ width: `${(data.complete / data.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Topic Summary */}
                <div className="space-y-2">
                  {data.topics.slice(0, 3).map((topic, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{topic.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 font-medium">{topic.questions.toLocaleString()}</span>
                        <div className={getStatusColor(topic.status)}>
                          {getStatusIcon(topic.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.topics.length > 3 && (
                    <div className="text-sm text-gray-500 text-center pt-2">
                      +{data.topics.length - 3} more topics
                    </div>
                  )}
                </div>

                {/* Stats Footer */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                  <span>
                    {data.topics.filter(t => t.status === 'complete').length} Complete
                  </span>
                  <span>
                    {data.topics.filter(t => t.status === 'planned').length} Planned
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default About;