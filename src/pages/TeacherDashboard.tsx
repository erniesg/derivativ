import React, { useState, useEffect } from 'react';
import { FileText, Download, Users, BarChart3, Plus, Filter, ExternalLink, Sparkles } from 'lucide-react';
import RichMaterialGenerator from '../components/igcse/RichMaterialGenerator';
import { DocumentGenerationResult } from '../types/api';

interface GeneratedMaterial {
  id: string;
  title: string;
  type: 'worksheet' | 'notes' | 'assessment';
  topics: string[];
  difficulty: string;
  createdAt: Date;
  downloads: number;
  document_id?: string;
  available_formats?: string[];
  r2_files?: Array<{
    format: string;
    version: string;
    download_url?: string;
  }>;
}

const TeacherDashboard: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [detailLevel, setDetailLevel] = useState(5); // Default to medium level (5)
  const [targetLevel, setTargetLevel] = useState('IGCSE');
  const [materialType, setMaterialType] = useState('worksheet');
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedMaterial[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [useRichGenerator, setUseRichGenerator] = useState(true);

  const topics = [
    'Algebra', 'Geometry', 'Trigonometry', 'Statistics', 
    'Number Theory', 'Calculus', 'Probability', 'Functions'
  ];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Load available documents from R2 on component mount
  useEffect(() => {
    loadAvailableDocuments();
  }, []);

  const loadAvailableDocuments = async () => {
    setIsLoadingDocuments(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/available`);
      if (response.ok) {
        const data = await response.json();
        const documents: GeneratedMaterial[] = data.documents.map((doc: any) => ({
          id: doc.document_id,
          document_id: doc.document_id,
          title: doc.document_id.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          type: doc.document_type as 'worksheet' | 'notes' | 'assessment',
          topics: [doc.document_type.replace('_', ' ')],
          difficulty: 'Medium',
          createdAt: new Date(doc.last_modified),
          downloads: 0,
          available_formats: doc.available_formats,
          r2_files: []
        }));
        setGeneratedDocuments(documents);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
    setIsLoadingDocuments(false);
  };

  // Handler for rich material generation
  const handleRichMaterialGenerated = (result: DocumentGenerationResult) => {
    if (result.success && result.document) {
      const newDocument: GeneratedMaterial = {
        id: result.document.document_id,
        document_id: result.document.document_id,
        title: result.document.title || result.document.enhanced_title || 'Generated Material',
        type: result.document.document_type as 'worksheet' | 'notes' | 'assessment',
        topics: [result.document.document_type.replace('_', ' ')],
        difficulty: result.document.detail_level === 'minimal' ? 'Easy' : 
                   result.document.detail_level === 'comprehensive' ? 'Hard' : 'Medium',
        createdAt: new Date(),
        downloads: 0,
        available_formats: ['html'],
        r2_files: []
      };

      setGeneratedDocuments(prev => [newDocument, ...prev]);
      
      // Show success notification
      alert(`✅ ${newDocument.title} generated successfully!\n` +
            `Processing time: ${result.processing_time?.toFixed(2)}s\n` +
            `Document is now available in your materials list.`);
    }
  };

  const handleDownload = async (documentId: string, format: string = 'html', version: string = 'student') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/download?format=${format}&version=${version}`);
      if (response.ok) {
        const data = await response.json();
        // Open the presigned URL in a new tab
        window.open(data.download_url, '_blank');
      } else {
        throw new Error('Failed to get download URL');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };


  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const generateMaterial = async () => {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic');
      return;
    }

    setIsGenerating(true);

    try {
      // Map frontend values to backend API format
      const requestData = {
        document_type: materialType === 'assessment' ? 'worksheet' : materialType as 'worksheet' | 'notes',
        detail_level: detailLevel, // Now using integer values directly
        title: `${selectedTopics.join(' & ')} ${materialType.charAt(0).toUpperCase() + materialType.slice(1)}`,
        topic: selectedTopics.join(', ').toLowerCase().replace(/\s+/g, '_'),
        tier: 'Core' as const,
        grade_level: targetLevel === 'IGCSE' ? 7 : targetLevel === 'A-Level' ? 12 : 10,
        auto_include_questions: true,
        max_questions: materialType === 'notes' ? 3 : 5,
        custom_instructions: `Generate content suitable for ${targetLevel} level students with detail level ${detailLevel}`,
        include_answers: true,
        include_working: detailLevel >= 9 // Comprehensive (9) or Guided (10) levels
      };

      console.log('Generating document:', requestData);

      // Call the correct document generation API endpoint
      const response = await fetch(`${API_BASE_URL}/api/generation/documents/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Document generated successfully:', result);

      if (result.success) {
        // Export to HTML format for quick viewing
        const exportRequest = {
          document_id: result.document.document_id,
          format: 'html',
          version: 'student'
        };

        console.log('Exporting document to R2:', exportRequest);
        const exportResponse = await fetch(`${API_BASE_URL}/api/generation/documents/export`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(exportRequest),
        });

        if (exportResponse.ok) {
          const exportResult = await exportResponse.json();
          console.log('Document exported to R2:', exportResult);
        }

        // Add to generated documents
        const newDocument: GeneratedMaterial = {
          id: result.document.document_id,
          document_id: result.document.document_id,
          title: result.document.title,
          type: materialType as 'worksheet' | 'notes' | 'assessment',
          topics: selectedTopics,
          difficulty: detailLevel <= 3 ? 'Easy' : detailLevel >= 9 ? 'Hard' : 'Medium',
          createdAt: new Date(),
          downloads: 0,
          available_formats: ['html'],
          r2_files: []
        };

        setGeneratedDocuments(prev => [newDocument, ...prev]);

        alert(`✅ ${result.document.title} generated and exported successfully!\n` +
              `Processing time: ${result.processing_time.toFixed(2)}s\n` +
              `Document is now available for download.`);
      } else {
        throw new Error(result.error_message || 'Document generation failed');
      }

    } catch (error) {
      console.error('Error generating material:', error);
      alert(`❌ Failed to generate material: ${error instanceof Error ? error.message : 'Unknown error'}\n\nMake sure the API server is running at ${API_BASE_URL}`);
    } finally {
      setIsGenerating(false);
    }
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
          <div className="lg:col-span-2">
            {/* Generator Mode Toggle */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Generate New Material</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Basic</span>
                  <button
                    onClick={() => setUseRichGenerator(!useRichGenerator)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      useRichGenerator ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        useRichGenerator ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-600 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Rich
                  </span>
                </div>
              </div>
            </div>

            {/* Conditional Generator */}
            {useRichGenerator ? (
              <RichMaterialGenerator
                onMaterialGenerated={handleRichMaterialGenerated}
                showValidation={true}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Generator</h3>
            
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
                disabled={selectedTopics.length === 0 || isGenerating}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  selectedTopics.length > 0 && !isGenerating
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="inline-block w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="inline-block w-5 h-5 mr-2" />
                    Generate Material
                  </>
                )}
              </button>
            </div>
          </div>
            )}
          </div>

          {/* Recent Materials */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Generated Materials ({generatedDocuments.length})
              </h2>
              <button 
                onClick={loadAvailableDocuments}
                className="text-sm text-gray-600 hover:text-gray-800"
                disabled={isLoadingDocuments}
              >
                {isLoadingDocuments ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent"></div>
                ) : (
                  <Filter size={16} />
                )}
              </button>
            </div>

            <div className="space-y-4">
              {generatedDocuments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No materials generated yet.</p>
                  <p className="text-xs">Generate your first material to see it here!</p>
                </div>
              ) : (
                generatedDocuments.slice(0, 5).map((material) => (
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
                      <div className="flex space-x-1">
                        {material.available_formats?.includes('html') && (
                          <button 
                            onClick={() => handleDownload(material.document_id!, 'html', 'student')}
                            className="text-blue-600 hover:text-blue-700 p-1 rounded"
                            title="Download HTML (Student)"
                          >
                            <ExternalLink size={14} />
                          </button>
                        )}
                        {material.available_formats?.includes('html') && (
                          <button 
                            onClick={() => handleDownload(material.document_id!, 'html', 'teacher')}
                            className="text-green-600 hover:text-green-700 p-1 rounded"
                            title="Download HTML (Teacher)"
                          >
                            <Download size={14} />
                          </button>
                        )}
                      </div>
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
                      <span>
                        {material.available_formats?.length || 0} format{(material.available_formats?.length || 0) !== 1 ? 's' : ''} available
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {generatedDocuments.length > 5 && (
              <button className="w-full mt-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium">
                View All Materials ({generatedDocuments.length}) →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;