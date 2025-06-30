import React, { useState, useCallback } from 'react';
import { 
  DocumentGenerationRequest, 
  DocumentGenerationResult,
  DocumentType, 
  DetailLevel,
  GenerationState 
} from '../../types/api';
import { useApiService } from '../../services/api';
import GenerationForm from './GenerationForm';
import DocumentRenderer from './DocumentRenderer';
import DownloadManager from './DownloadManager';

interface RichMaterialGeneratorProps {
  className?: string;
  onMaterialGenerated?: (result: DocumentGenerationResult) => void;
  showValidation?: boolean;
}

interface GenerationProgress {
  stage: string;
  message: string;
  timestamp: Date;
}

/**
 * Enhanced material generator with rich content integration
 * Combines form, validation, rendering, and progress tracking
 */
const RichMaterialGenerator: React.FC<RichMaterialGeneratorProps> = ({
  className = '',
  onMaterialGenerated,
  showValidation = true
}) => {
  const apiService = useApiService();
  
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [generationResult, setGenerationResult] = useState<DocumentGenerationResult | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress[]>([]);
  const [lastRequest, setLastRequest] = useState<DocumentGenerationRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Enhanced generation with progress tracking
  const handleGenerate = useCallback(async (request: DocumentGenerationRequest) => {
    setGenerationState('loading');
    setError(null);
    setGenerationResult(null);
    setGenerationProgress([]);
    setLastRequest(request);

    // Add initial progress
    addProgress('Starting', 'Initializing document generation...');

    try {
      // Simulate progress stages for better UX
      addProgress('Analyzing', 'Processing requirements and topics...');
      
      // Make the API call
      const response = await apiService.generateDocument(request);
      
      if (response.success && response.data) {
        addProgress('Generating', 'Creating content with AI agents...');
        
        // Simulate brief delay for progress visualization
        await new Promise(resolve => setTimeout(resolve, 500));
        
        addProgress('Validating', 'Checking content structure and quality...');
        
        setGenerationResult(response.data);
        setGenerationState('success');
        
        addProgress('Complete', 'Document generated successfully!');
        
        // Notify parent component
        if (onMaterialGenerated) {
          onMaterialGenerated(response.data);
        }
        
        // Check if downloads are already available from the new API
        if (response.data.downloads && Object.values(response.data.downloads).some(download => download?.available)) {
          addProgress('Downloads Ready', 'Multiple formats available for download');
        } else if (response.data.document_id || response.data.document?.document_id) {
          // Fallback to old export method if needed
          addProgress('Exporting', 'Preparing document for download...');
          await triggerExport(response.data.document_id || response.data.document.document_id);
        }
        
      } else {
        throw new Error(response.error || 'Generation failed');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setGenerationState('error');
      addProgress('Error', errorMessage);
    }
  }, [apiService, onMaterialGenerated]);

  // Helper to add progress updates
  const addProgress = (stage: string, message: string) => {
    setGenerationProgress(prev => [...prev, {
      stage,
      message,
      timestamp: new Date()
    }]);
  };

  // Auto-export generated document
  const triggerExport = async (documentId: string) => {
    try {
      await apiService.exportDocument(documentId, 'html');
      addProgress('Export Complete', 'Document ready for download');
    } catch (err) {
      console.warn('Auto-export failed:', err);
      // Don't treat export failure as generation failure
    }
  };

  // Validation result handler
  const handleValidationResult = useCallback((isValid: boolean, issues: any[]) => {
    if (!isValid && issues.some(issue => issue.type === 'error')) {
      console.warn('Document structure validation failed:', issues);
    }
  }, []);

  // Retry generation
  const handleRetry = () => {
    if (lastRequest) {
      handleGenerate(lastRequest);
    }
  };

  // Clear results
  const handleClear = () => {
    setGenerationState('idle');
    setGenerationResult(null);
    setGenerationProgress([]);
    setLastRequest(null);
    setError(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Generation Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Rich Educational Material</h2>
        
        <GenerationForm
          onGenerate={handleGenerate}
          generationState={generationState}
        />
      </div>

      {/* Generation Progress */}
      {generationProgress.length > 0 && (
        <GenerationProgressTracker 
          progress={generationProgress}
          state={generationState}
        />
      )}

      {/* Error Display */}
      {error && (
        <ErrorDisplay 
          error={error}
          onRetry={lastRequest ? handleRetry : undefined}
          onClear={handleClear}
        />
      )}

      {/* Generated Content */}
      {generationResult && generationState === 'success' && (
        <div className="space-y-6">
          {/* Document Quality Summary */}
          {showValidation && lastRequest && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="font-medium text-green-800">Content Generated Successfully</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {lastRequest.document_type} created with {lastRequest.detail_level} detail level
              </p>
            </div>
          )}

          {/* Rich Document Display */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Generated Material</h3>
                <div className="flex items-center space-x-4">
                  {/* Generation Metrics */}
                  <div className="text-sm text-gray-500">
                    Generated in {
                      generationResult.generation_time 
                        ? (typeof generationResult.generation_time === 'string' 
                           ? parseFloat(generationResult.generation_time) 
                           : generationResult.generation_time).toFixed(1)
                        : generationResult.processing_time?.toFixed(1) || '0'
                    }s
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleClear}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleRetry}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Truncated Markdown Content */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Generated Content Preview</h4>
              {generationResult.markdown_content ? (
                <div className="bg-gray-50 rounded-lg p-4 border max-h-96 overflow-hidden relative">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                    {generationResult.markdown_content.slice(0, 1000)}
                    {generationResult.markdown_content.length > 1000 && '...'}
                  </pre>
                  {generationResult.markdown_content.length > 1000 && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent flex items-end justify-center pb-2">
                      <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        Showing first 1000 characters. Use downloads for full content.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">No markdown content available in preview.</p>
                </div>
              )}
            </div>
          </div>

          {/* Download Manager */}
          {(generationResult.document_id || generationResult.document) && (
            <DownloadManager
              documentId={generationResult.document_id || generationResult.document?.document_id || 'unknown'}
              generatedContent={{
                ...generationResult.document,
                markdown_content: generationResult.markdown_content,
                downloads: generationResult.downloads,
                ...generationResult.metadata
              }}
              documentTitle={generationResult.metadata?.title || generationResult.document?.title || 'Generated Material'}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            />
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Generation progress tracker component with progress bar
 */
const GenerationProgressTracker: React.FC<{
  progress: GenerationProgress[];
  state: GenerationState;
}> = ({ progress, state }) => {
  const isComplete = state === 'success';
  const hasError = state === 'error';
  const isLoading = state === 'loading';
  
  // Calculate progress percentage based on expected stages
  const expectedStages = ['Starting', 'Analyzing', 'Generating', 'Validating', 'Complete'];
  const currentStageIndex = Math.max(0, progress.length - 1);
  const progressPercentage = isComplete ? 100 : hasError ? 0 : Math.min(95, (currentStageIndex / expectedStages.length) * 100);

  // Get current stage for display
  const currentStage = progress[progress.length - 1];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Generation Progress</h3>
        <div className="flex items-center space-x-2 text-sm">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          )}
          <span className={`font-medium ${
            isComplete ? 'text-green-600' : hasError ? 'text-red-600' : 'text-blue-600'
          }`}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${
              hasError ? 'bg-red-500' : isComplete ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {currentStage && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className={`font-medium ${
              hasError ? 'text-red-700' : isComplete ? 'text-green-700' : 'text-blue-700'
            }`}>
              {currentStage.stage}
            </span>
            <span className="text-gray-500">
              {currentStage.timestamp.toLocaleTimeString()}
            </span>
          </div>
        )}
        {currentStage && (
          <p className={`text-sm mt-1 ${
            hasError ? 'text-red-600' : 'text-gray-600'
          }`}>
            {currentStage.message}
          </p>
        )}
      </div>

      {/* Detailed Steps (Collapsible) */}
      {progress.length > 1 && (
        <details className="group">
          <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            <span className="w-4 h-4 mr-2 transform group-open:rotate-90 transition-transform">▶</span>
            View Detailed Steps ({progress.length})
          </summary>
          <div className="mt-3 space-y-2 pl-6">
            {progress.map((item, index) => {
              const isLast = index === progress.length - 1;
              const isError = hasError && isLast;
              const isSuccess = isComplete && isLast;
              
              return (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    isError 
                      ? 'bg-red-100 text-red-700' 
                      : isSuccess
                        ? 'bg-green-100 text-green-700'
                        : isLast && isLoading
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isError ? '✗' : isSuccess ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{item.stage}</span>
                    <span className="text-gray-500 ml-2 text-xs">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
};

/**
 * Error display component
 */
const ErrorDisplay: React.FC<{
  error: string;
  onRetry?: () => void;
  onClear: () => void;
}> = ({ error, onRetry, onClear }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="text-red-400 text-xl">⚠️</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Generation Failed
          </h3>
          <p className="text-red-700 mb-4">
            {error}
          </p>
          
          <div className="flex space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            )}
            <button
              onClick={onClear}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichMaterialGenerator;