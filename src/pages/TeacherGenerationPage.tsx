import React, { useState } from 'react';
import { 
  DocumentGenerationRequest, 
  DocumentGenerationResult, 
  GenerationState 
} from '../types/api';
import { apiService } from '../services/api';
import GenerationForm from '../components/igcse/GenerationForm';
import MaterialPreview from '../components/igcse/MaterialPreview';
import DownloadManager from '../components/igcse/DownloadManager';
import RichMaterialGenerator from '../components/igcse/RichMaterialGenerator';
import { Sparkles } from 'lucide-react';

const TeacherGenerationPage: React.FC = () => {
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [generationResult, setGenerationResult] = useState<DocumentGenerationResult | null>(null);
  const [lastRequest, setLastRequest] = useState<DocumentGenerationRequest | null>(null);
  const [useRichGenerator, setUseRichGenerator] = useState(true); // Default to rich for better UX

  const handleGenerate = async (request: DocumentGenerationRequest) => {
    setGenerationState('loading');
    setGenerationResult(null);
    setLastRequest(request);

    try {
      const response = await apiService.generateDocument(request);
      
      if (response.success && response.data) {
        setGenerationResult(response.data);
        setGenerationState('success');
      } else {
        setGenerationResult({
          success: false,
          error_message: response.error || 'Generation failed',
          processing_time: 0,
          questions_processed: 0,
          sections_generated: 0
        });
        setGenerationState('error');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationResult({
        success: false,
        error_message: error instanceof Error ? error.message : 'An unexpected error occurred',
        processing_time: 0,
        questions_processed: 0,
        sections_generated: 0
      });
      setGenerationState('error');
    }
  };

  const resetGeneration = () => {
    setGenerationState('idle');
    setGenerationResult(null);
    setLastRequest(null);
  };

  // Handler for rich material generation
  const handleRichMaterialGenerated = (result: DocumentGenerationResult) => {
    setGenerationResult(result);
    setGenerationState(result.success ? 'success' : 'error');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generate IGCSE Math Materials</h1>
              <p className="text-lg text-gray-600 mt-2">
                Create worksheets, notes, and assessments tailored to Cambridge IGCSE Mathematics curriculum
              </p>
            </div>
            
            {/* Generator Mode Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600">Basic</span>
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
              <span className="text-sm font-medium text-gray-600 flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                Rich
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generation Form */}
          <div className="lg:col-span-2">
            {useRichGenerator ? (
              <RichMaterialGenerator
                onMaterialGenerated={handleRichMaterialGenerated}
                showValidation={true}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Generator</h3>
                <GenerationForm
                  onGenerate={handleGenerate}
                  generationState={generationState}
                />
              </div>
            )}
          </div>

          {/* Right Column - Preview & Download */}
          <div className="space-y-6">
            {/* Generation Status */}
            {generationState === 'loading' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-blue-900">Generating Material</h3>
                    <p className="text-blue-700 text-sm">AI agents are creating your content...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Status */}
            {generationState === 'success' && generationResult?.success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-green-900">Generation Complete!</h3>
                    <p className="text-green-700 text-sm">
                      Generated in {generationResult.processing_time ? 
                        generationResult.processing_time.toFixed(1) : 
                        (generationResult.generation_time || 'N/A')
                      }s
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Status */}
            {generationState === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-red-900">Generation Failed</h3>
                    <p className="text-red-700 text-sm">{generationResult?.error_message}</p>
                    <button
                      onClick={resetGeneration}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Download Manager - only show when NOT using rich generator */}
            {generationResult?.success && !useRichGenerator && (
              <DownloadManager
                documentId={generationResult.document?.document_id}
                documentTitle={lastRequest?.title || 'Generated Material'}
                generatedContent={generationResult.document}
              />
            )}

            {/* Quick Stats */}
            {generationState !== 'idle' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Generation Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      generationState === 'loading' ? 'text-blue-600' :
                      generationState === 'success' ? 'text-green-600' :
                      generationState === 'error' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {generationState === 'loading' ? 'Generating...' :
                       generationState === 'success' ? 'Complete' :
                       generationState === 'error' ? 'Failed' :
                       'Ready'}
                    </span>
                  </div>
                  {generationResult && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Processing Time:</span>
                        <span className="font-medium">
                          {generationResult.processing_time ? 
                            generationResult.processing_time.toFixed(1) : 
                            (generationResult.generation_time || 'N/A')
                          }s
                        </span>
                      </div>
                      {generationResult.questions_processed && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Questions:</span>
                          <span className="font-medium">{generationResult.questions_processed}</span>
                        </div>
                      )}
                      {generationResult.sections_generated && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Sections:</span>
                          <span className="font-medium">{generationResult.sections_generated}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Material Preview - only show when NOT using rich generator */}
        {(generationResult || generationState === 'loading') && !useRichGenerator && (
          <div className="mt-8">
            <MaterialPreview result={generationResult} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherGenerationPage;