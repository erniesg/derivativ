import React from 'react';
import { DocumentGenerationResult } from '../../types/api';

interface MaterialPreviewProps {
  result: DocumentGenerationResult | null;
  className?: string;
}

const MaterialPreview: React.FC<MaterialPreviewProps> = ({
  result,
  className = ''
}) => {
  if (!result) {
    return (
      <div className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500">Generated material will appear here</p>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-start">
          <svg className="w-6 h-6 text-red-400 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Generation Failed</h3>
            <p className="text-red-700 mt-1">{result.error_message || 'An error occurred during generation'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Generated Material</h3>
            <p className="text-sm text-gray-500 mt-1">
              Processing time: {result.processing_time.toFixed(1)}s
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {result.questions_processed && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {result.questions_processed} questions
              </div>
            )}
            {result.sections_generated && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {result.sections_generated} sections
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {result.document ? (
          <DocumentContent document={result.document} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No document content available</p>
          </div>
        )}
      </div>

      {/* Generation Info */}
      {(result.agent_results && result.agent_results.length > 0) && (
        <div className="border-t border-gray-200 px-6 py-4">
          <details className="group">
            <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              <svg className="w-4 h-4 mr-2 transform group-open:rotate-90 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Generation Details ({result.agent_results.length} steps)
            </summary>
            <div className="mt-3 space-y-2">
              {result.agent_results.map((step, index) => (
                <div key={index} className="bg-gray-50 rounded p-3 text-sm">
                  <div className="font-medium text-gray-900">{step.agent || `Step ${index + 1}`}</div>
                  <div className="text-gray-600 mt-1">{step.action || step.description || 'Processing...'}</div>
                  {step.duration && (
                    <div className="text-gray-400 text-xs mt-1">{step.duration}ms</div>
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

// Component to render document content
const DocumentContent: React.FC<{ document: any }> = ({ document }) => {
  // Handle different document formats
  if (typeof document === 'string') {
    return (
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
          {document}
        </pre>
      </div>
    );
  }

  if (document.content_html) {
    return (
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: document.content_html }}
      />
    );
  }

  if (document.content_markdown) {
    return (
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
          {document.content_markdown}
        </pre>
      </div>
    );
  }

  if (document.sections && Array.isArray(document.sections)) {
    return (
      <div className="space-y-6">
        {document.sections.map((section: any, index: number) => (
          <DocumentSection key={section.section_id || index} section={section} />
        ))}
      </div>
    );
  }

  // Fallback: render as JSON
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-2">Document Structure</h4>
      <pre className="text-sm text-gray-600 overflow-auto">
        {JSON.stringify(document, null, 2)}
      </pre>
    </div>
  );
};

// Component to render individual document sections
const DocumentSection: React.FC<{ section: any }> = ({ section }) => {
  return (
    <div className="border-l-4 border-blue-200 pl-4">
      <h4 className="font-semibold text-gray-900 mb-2">{section.title}</h4>
      
      {section.content_data && (
        <div className="text-gray-700 space-y-2">
          {typeof section.content_data === 'string' ? (
            <p className="whitespace-pre-wrap">{section.content_data}</p>
          ) : (
            <div className="bg-gray-50 rounded p-3 text-sm">
              <pre>{JSON.stringify(section.content_data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-4 ml-4 space-y-4">
          {section.subsections.map((subsection: any, index: number) => (
            <DocumentSection key={subsection.section_id || index} section={subsection} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialPreview;