import React from 'react';
import { Target, BookOpen, Globe, TrendingUp } from 'lucide-react';

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

        {/* What's Next Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🌍 What's Next</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <div className="max-w-4xl mx-auto">
              <ul className="space-y-6 text-lg text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Automated diagram generation and video explainers.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>More levels and subjects — filling gaps beyond math, across global curricula.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Continuing our mission: making math accessible to all.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default About;