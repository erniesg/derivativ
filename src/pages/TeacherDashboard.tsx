import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { FileText, Download, Settings, Users, BarChart3, Plus, Filter } from 'lucide-react';

interface GeneratedMaterial {
  id: string;
  title: string;
  type: 'worksheet' | 'notes' | 'assessment';
  topics: string[];
  difficulty: string;
  createdAt: Date;
  downloads: number;
}

const TeacherDashboard: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [detailLevel, setDetailLevel] = useState(5);
  const [targetLevel, setTargetLevel] = useState('IGCSE');
  const [materialType, setMaterialType] = useState('worksheet');

  const topics = [
    'Algebra', 'Geometry', 'Trigonometry', 'Statistics', 
    'Number Theory', 'Calculus', 'Probability', 'Functions'
  ];

  const recentMaterials: GeneratedMaterial[] = [
    {
      id: '1',
      title: 'Quadratic Equations Worksheet',
      type: 'worksheet',
      topics: ['Algebra'],
      difficulty: 'Medium',
      createdAt: new Date(2024, 0, 15),
      downloads: 23
    },
    {
      id: '2',
      title: 'Triangle Properties Notes',
      type: 'notes',
      topics: ['Geometry'],
      difficulty: 'Easy',
      createdAt: new Date(2024, 0, 14),
      downloads: 15
    },
    {
      id: '3',
      title: 'Statistics Assessment',
      type: 'assessment',
      topics: ['Statistics', 'Probability'],
      difficulty: 'Hard',
      createdAt: new Date(2024, 0, 13),
      downloads: 8
    }
  ];

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const generateMaterial = () => {
    // This would typically make an API call to generate the material
    console.log('Generating material with:', {
      topics: selectedTopics,
      detailLevel,
      targetLevel,
      materialType
    });
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'worksheet': return <FileText className="w-5 h-5" />;
      case 'notes': return <FileText className="w-5 h-5" />;
      case 'assessment': return <BarChart3 className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">
            Generate customized teaching materials with AI precision
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Materials Generated</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Students Reached</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Material Generator */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate New Material</h2>
            
            <div className="space-y-6">
              {/* Material Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Material Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['worksheet', 'notes', 'assessment'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setMaterialType(type)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 capitalize ${
                        materialType === type
                          ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Topics ({selectedTopics.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicToggle(topic)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm ${
                        selectedTopics.includes(topic)
                          ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail Level Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Detail Level: {detailLevel}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Basic</span>
                  <span>Comprehensive</span>
                </div>
              </div>

              {/* Target Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Level</label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="IGCSE">IGCSE</option>
                  <option value="A-Level">A-Level</option>
                  <option value="IB">IB</option>
                  <option value="SAT">SAT</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateMaterial}
                disabled={selectedTopics.length === 0}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  selectedTopics.length > 0
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Generate Material
              </button>
            </div>
          </div>

          {/* Recent Materials */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Materials</h2>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                <Filter size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {recentMaterials.map((material) => (
                <div
                  key={material.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-green-600">
                        {getMaterialIcon(material.type)}
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">{material.title}</h3>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Download size={16} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {material.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{material.difficulty}</span>
                    <span>{material.downloads} downloads</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium">
              View All Materials →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;