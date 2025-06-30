import React, { useState } from 'react';
import { FileText, Download, Users, BarChart3, Plus, Filter, ExternalLink, Sparkles } from 'lucide-react';
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
  download_urls?: Record<string, string>; // Format to download URL mapping
}

const TeacherGenerationPage: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [detailLevel, setDetailLevel] = useState(5);
  const [targetLevel, setTargetLevel] = useState('IGCSE');
  const [materialType, setMaterialType] = useState('worksheet');
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedMaterial[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const topics = [
    'Number', 'Algebra and graphs', 'Coordinate geometry', 'Geometry', 
    'Mensuration', 'Trigonometry', 'Transformations and vectors', 'Probability', 'Statistics'
  ];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const handleDownload = async (material: GeneratedMaterial, format: string = 'pdf') => {
    console.log('📥 DOWNLOAD REQUESTED:', { material: material.id, format });
    
    try {
      if (material.download_urls?.[format]) {
        console.log('✅ Using pre-generated download URL:', material.download_urls[format]);
        window.open(material.download_urls[format], '_blank');
      } else {
        console.warn('⚠️ No download URL found, attempting fallback API call');
        const response = await fetch(`${API_BASE_URL}/api/documents/${material.document_id}/download?format=${format}&version=student`);
        if (response.ok) {
          const data = await response.json();
          window.open(data.download_url, '_blank');
        } else {
          throw new Error('Failed to get download URL');
        }
      }
    } catch (error) {
      console.error('❌ Download failed:', error);
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

    console.log('🚀 STARTING GENERATION with new generate-markdown endpoint');
    setIsGenerating(true);

    try {
      const requestData = {
        document_type: materialType === 'assessment' ? 'worksheet' : materialType as 'worksheet' | 'notes',
        detail_level: detailLevel,
        title: `${selectedTopics.join(' & ')} ${materialType.charAt(0).toUpperCase() + materialType.slice(1)}`,
        topic: selectedTopics[0], // Use the first selected topic directly
        tier: 'Core' as const,
        grade_level: targetLevel === 'IGCSE' ? 7 : targetLevel === 'A-Level' ? 12 : 10,
        auto_include_questions: true,
        max_questions: materialType === 'notes' ? 3 : 5,
        custom_instructions: `Generate content suitable for ${targetLevel} level students with detail level ${detailLevel}`,
        include_answers: true,
        include_working: detailLevel >= 9
      };

      console.log('📤 Sending request to /generate-markdown:', requestData);

      const response = await fetch(`${API_BASE_URL}/api/generation/documents/generate-markdown`, {
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
      console.log('✅ Generation successful:', result);

      if (result.success) {
        const availableFormats = Object.keys(result.downloads || {}).filter(
          format => result.downloads?.[format as keyof typeof result.downloads]?.available
        );

        // Extract download URLs from the response
        const downloadUrls: Record<string, string> = {};
        if (result.downloads) {
          Object.entries(result.downloads).forEach(([format, downloadInfo]) => {
            if (downloadInfo.available && downloadInfo.download_url) {
              downloadUrls[format] = downloadInfo.download_url;
            }
          });
        }

        const newDocument: GeneratedMaterial = {
          id: result.document_id || `doc_${Date.now()}`,
          document_id: result.document_id || `doc_${Date.now()}`,
          title: result.metadata?.title || `${selectedTopics.join(' & ')} ${materialType}`,
          type: materialType as 'worksheet' | 'notes' | 'assessment',
          topics: selectedTopics,
          difficulty: detailLevel <= 3 ? 'Easy' : detailLevel >= 9 ? 'Hard' : 'Medium',
          createdAt: new Date(),
          downloads: 0,
          available_formats: availableFormats.length > 0 ? availableFormats : ['markdown'],
          download_urls: downloadUrls,
        };

        console.log('📋 New document created:', newDocument);
        setGeneratedDocuments(prev => [newDocument, ...prev]);

        const generationTime = result.generation_time 
          ? (typeof result.generation_time === 'string' ? parseFloat(result.generation_time) : result.generation_time)
          : 0;

        alert(`✅ ${newDocument.title} generated successfully!\n` +
              `Processing time: ${generationTime.toFixed(2)}s\n` +
              `Available formats: ${availableFormats.join(', ') || 'markdown'}\n` +
              `Document is now ready for download.`);
      } else {
        throw new Error(result.error_message || 'Document generation failed');
      }

    } catch (error) {
      console.error('❌ Generation failed:', error);
      alert(`❌ Failed to generate material: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generate IGCSE Math Materials</h1>
          <p className="text-lg text-gray-600 mt-2">
            Create AI-powered worksheets, notes, and assessments with real content and LaTeX math expressions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Material Generator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Generate Educational Materials</h3>
            
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
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Topics ({selectedTopics.length} selected)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleTopicToggle(topic)}
                        className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                          selectedTopics.includes(topic)
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detail Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detail Level: {detailLevel}
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
          </div>

          {/* Generated Materials */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generated Materials</h3>
              </div>
              
              <div className="space-y-4">
                {generatedDocuments.map((material) => (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm">{material.title}</h3>
                      </div>
                      <div className="flex space-x-1">
                        {material.available_formats?.includes('pdf') && (
                          <button 
                            onClick={() => handleDownload(material, 'pdf')}
                            className="text-red-600 hover:text-red-700 p-1 rounded"
                            title="Download PDF"
                          >
                            <Download size={14} />
                          </button>
                        )}
                        {material.available_formats?.includes('html') && (
                          <button 
                            onClick={() => handleDownload(material, 'html')}
                            className="text-blue-600 hover:text-blue-700 p-1 rounded"
                            title="Download HTML"
                          >
                            <ExternalLink size={14} />
                          </button>
                        )}
                        {material.available_formats?.includes('docx') && (
                          <button 
                            onClick={() => handleDownload(material, 'docx')}
                            className="text-green-600 hover:text-green-700 p-1 rounded"
                            title="Download DOCX"
                          >
                            <FileText size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {material.topics.map((topic) => (
                        <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{material.type} • {material.difficulty}</span>
                      <span>{material.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                
                {generatedDocuments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No materials generated yet</p>
                    <p className="text-sm">Select topics and click Generate to start</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherGenerationPage;