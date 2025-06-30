import React from 'react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Ali',
      role: 'Ex-IGCSE Student & Chief Engineer',
      description: 'Passionate about leveraging AI to revolutionize education and make learning accessible to everyone.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    },
    {
      name: 'Ernie',
      role: 'Ex-IB Tutor & Founder',
      description: 'Former IGCSE math teacher with 8+ years of experience helping students achieve their academic goals.',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
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


        {/* Compact Content Roadmap Dashboard */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Roadmap</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our vision for the future of AI-powered education.
            </p>
          </div>

          {/* Roadmap Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Automated diagram generation and video explainers.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    More levels and subjects — filling gaps beyond math, across global curricula.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Continuing our mission: making math accessible to all.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

      </main>
    </div>
  );
};

export default About;