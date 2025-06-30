import React, { useState } from 'react';
import {
  DocumentGenerationRequest,
  DocumentGenerationResult,
  GenerationState
} from '../types/api';
import { apiService } from '../services/api';
import { AuthGuard } from '../components/auth/AuthGuard';
import { useUser } from '../contexts/UserContext';
import GenerationForm from '../components/igcse/GenerationForm';
import MaterialPreview from '../components/igcse/MaterialPreview';
import DownloadManager from '../components/igcse/DownloadManager';
import RichMaterialGenerator from '../components/igcse/RichMaterialGenerator';

const TeacherGenerationPage: React.FC = () => {
  const { userRole } = useUser();
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [generationResult, setGenerationResult] = useState<DocumentGenerationResult | null>(null);
  const [lastRequest, setLastRequest] = useState<DocumentGenerationRequest | null>(null);

  // Redirect students to dashboard
  if (userRole !== 'teacher') {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
            <p className="text-gray-600">This page is only available to teachers.</p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

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
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generate IGCSE Math Materials</h1>
              <p className="text-lg text-gray-600 mt-2">
                Create worksheets, notes, and assessments tailored to Cambridge IGCSE Mathematics curriculum
              </p>
            </div>
          </div>

          <div className="w-full">
            <RichMaterialGenerator
              onMaterialGenerated={handleRichMaterialGenerated}
              showValidation={true}
            />
          </div>

        </div>
      </div>
    </AuthGuard>
  );
};

export default TeacherGenerationPage;