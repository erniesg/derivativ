import React from 'react';
import { ContentSection } from '../../types/api';

interface DocumentRendererProps {
  document: any;
  className?: string;
  renderMode?: 'preview' | 'full' | 'compact';
  showMetadata?: boolean;
}

/**
 * Rich document renderer that separates rendering logic from business logic
 * Handles different document types and content structures
 */
const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  document,
  className = '',
  renderMode = 'preview',
  showMetadata = true
}) => {
  if (!document) {
    return (
      <div className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
        <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
          📄
        </div>
        <p className="text-gray-500">No document to display</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Document Header */}
      {showMetadata && (
        <DocumentHeader document={document} renderMode={renderMode} />
      )}

      {/* Document Content */}
      <div className="p-6">
        <DocumentContent document={document} renderMode={renderMode} />
      </div>

      {/* Document Footer - Generation Info */}
      {showMetadata && renderMode === 'full' && (
        <DocumentFooter document={document} />
      )}
    </div>
  );
};

/**
 * Document header with metadata and structure info
 */
const DocumentHeader: React.FC<{ document: any; renderMode: string }> = ({ document, renderMode }) => {
  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {document.title || document.enhanced_title || 'Generated Document'}
          </h3>
          {document.document_type && (
            <div className="flex items-center mt-1 space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {document.document_type}
              </span>
              {document.detail_level && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {document.detail_level} detail
                </span>
              )}
            </div>
          )}
          {document.introduction && renderMode === 'full' && (
            <p className="text-sm text-gray-600 mt-2">{document.introduction}</p>
          )}
        </div>
        
        {/* Document Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {document.sections && (
            <div className="flex items-center">
              <span className="w-4 h-4 mr-1">📑</span>
              {Array.isArray(document.sections) ? document.sections.length : Object.keys(document.sections).length} sections
            </div>
          )}
          {document.total_questions && (
            <div className="flex items-center">
              <span className="w-4 h-4 mr-1">❓</span>
              {document.total_questions} questions
            </div>
          )}
          {document.estimated_duration && (
            <div className="flex items-center">
              <span className="w-4 h-4 mr-1">⏱️</span>
              {document.estimated_duration}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Main document content renderer with smart content detection
 */
const DocumentContent: React.FC<{ document: any; renderMode: string }> = ({ document, renderMode }) => {
  // Handle different document formats with validation
  if (document.content_html) {
    return <HTMLContentRenderer content={document.content_html} renderMode={renderMode} />;
  }

  if (document.content_markdown) {
    return <MarkdownContentRenderer content={document.content_markdown} renderMode={renderMode} />;
  }

  if (document.sections) {
    return <SectionsRenderer sections={document.sections} renderMode={renderMode} />;
  }

  if (document.blocks) {
    return <BlocksRenderer blocks={document.blocks} renderMode={renderMode} />;
  }

  // Fallback: render as structured data
  return <StructuredContentRenderer data={document} renderMode={renderMode} />;
};

/**
 * HTML content renderer with safety validation
 */
const HTMLContentRenderer: React.FC<{ content: string; renderMode: string }> = ({ content, renderMode }) => {
  // Basic HTML validation to prevent XSS
  const isValidHTML = (html: string): boolean => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return doc.body.children.length > 0;
    } catch {
      return false;
    }
  };

  if (!isValidHTML(content)) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">⚠️ Invalid HTML content detected</p>
        <pre className="text-sm text-gray-600 mt-2 overflow-auto">{content}</pre>
      </div>
    );
  }

  return (
    <div 
      className={`prose max-w-none ${renderMode === 'compact' ? 'prose-sm' : ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

/**
 * Markdown content renderer
 */
const MarkdownContentRenderer: React.FC<{ content: string; renderMode: string }> = ({ content, renderMode }) => {
  return (
    <div className={`prose max-w-none ${renderMode === 'compact' ? 'prose-sm' : ''}`}>
      <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
        {content}
      </pre>
    </div>
  );
};

/**
 * Sections-based content renderer with structure validation
 */
const SectionsRenderer: React.FC<{ sections: any; renderMode: string }> = ({ sections, renderMode }) => {
  // Validate sections structure
  const validateSections = (sections: any): ContentSection[] => {
    if (!sections) return [];
    
    if (Array.isArray(sections)) {
      return sections.filter(section => section && typeof section === 'object');
    }
    
    if (typeof sections === 'object') {
      return Object.values(sections).filter(section => section && typeof section === 'object');
    }
    
    return [];
  };

  const validSections = validateSections(sections);

  if (validSections.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-500">No valid sections found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {validSections.map((section, index) => (
        <SectionRenderer 
          key={section.section_id || index} 
          section={section} 
          renderMode={renderMode}
          index={index}
        />
      ))}
    </div>
  );
};

/**
 * Individual section renderer with content type detection
 */
const SectionRenderer: React.FC<{ 
  section: any; 
  renderMode: string; 
  index: number;
}> = ({ section, renderMode, index }) => {
  const getSectionIcon = (contentType: string): string => {
    const iconMap: Record<string, string> = {
      'learning_objectives': '🎯',
      'practice_questions': '❓',
      'worked_examples': '📝',
      'solutions': '✅',
      'detailed_solutions': '🔍',
      'answers': '💡',
      'topic_introduction': '📚',
      'summary': '📋',
      'exercises': '💪',
      'review': '🔄'
    };
    return iconMap[contentType] || '📄';
  };

  const renderContentData = (contentData: any): React.ReactNode => {
    if (!contentData) return null;

    if (typeof contentData === 'string') {
      return <p className="whitespace-pre-wrap text-gray-700">{contentData}</p>;
    }

    if (contentData.questions && Array.isArray(contentData.questions)) {
      return <QuestionsRenderer questions={contentData.questions} renderMode={renderMode} />;
    }

    if (contentData.objectives_text) {
      return (
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Learning Objectives</h5>
          <p className="text-blue-800 whitespace-pre-wrap">{contentData.objectives_text}</p>
        </div>
      );
    }

    if (contentData.examples && Array.isArray(contentData.examples)) {
      return <ExamplesRenderer examples={contentData.examples} renderMode={renderMode} />;
    }

    // Handle common structured content patterns
    if (typeof contentData === 'object') {
      // Handle objectives array
      if (contentData.objectives && Array.isArray(contentData.objectives)) {
        return (
          <div className="space-y-2">
            {contentData.objectives.map((objective: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold text-sm">•</span>
                <span className="text-gray-700">{objective}</span>
              </div>
            ))}
          </div>
        );
      }

      // Handle steps array
      if (contentData.steps && Array.isArray(contentData.steps)) {
        return (
          <div className="space-y-2">
            {contentData.steps.map((step: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-green-600 font-bold text-sm">{index + 1}.</span>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        );
      }

      // Handle practice array
      if (contentData.practice && Array.isArray(contentData.practice)) {
        return (
          <div className="space-y-2">
            {contentData.practice.map((item: string, index: number) => (
              <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        );
      }

      // Handle solutions array
      if (contentData.solutions && Array.isArray(contentData.solutions)) {
        return (
          <div className="space-y-2">
            {contentData.solutions.map((solution: string, index: number) => (
              <div key={index} className="bg-green-50 border-l-4 border-green-400 p-3">
                <span className="text-gray-700">{solution}</span>
              </div>
            ))}
          </div>
        );
      }

      // Handle examples array
      if (contentData.examples && Array.isArray(contentData.examples)) {
        return (
          <div className="space-y-3">
            {contentData.examples.map((example: string, index: number) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <span className="text-gray-700">{example}</span>
              </div>
            ))}
          </div>
        );
      }

      // Handle numbered object (e.g., {"1": "...", "2": "...", ...})
      const entries = Object.entries(contentData);
      if (entries.length > 0 && entries.every(([key, value]) => typeof value === 'string')) {
        return (
          <div className="space-y-2">
            {entries.map(([key, value]) => (
              <div key={key} className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold text-sm">{key}.</span>
                <span className="text-gray-700">{value as string}</span>
              </div>
            ))}
          </div>
        );
      }
    }

    // Fallback: render as structured JSON (only for unhandled cases)
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <pre className="text-sm text-gray-600 overflow-auto">
          {JSON.stringify(contentData, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="border-l-4 border-blue-200 pl-6">
      <div className="flex items-start space-x-2 mb-3">
        <span className="text-lg">{getSectionIcon(section.content_type)}</span>
        <div>
          <h4 className="font-semibold text-gray-900">
            {section.title || `Section ${index + 1}`}
          </h4>
          {section.content_type && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {section.content_type.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>
      
      <div className="ml-6">
        {renderContentData(section.content_data)}
      </div>
      
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-4 ml-6 space-y-4">
          {section.subsections.map((subsection: any, subIndex: number) => (
            <SectionRenderer 
              key={subsection.section_id || subIndex} 
              section={subsection} 
              renderMode={renderMode}
              index={subIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Questions renderer with formatting
 */
const QuestionsRenderer: React.FC<{ questions: any[]; renderMode: string }> = ({ questions, renderMode }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </span>
            <div className="flex-1">
              <p className="text-gray-900 font-medium">
                {question.question_text || question.question || question.text}
              </p>
              {question.marks && (
                <span className="inline-block mt-1 text-xs text-gray-500">
                  [{question.marks} mark{question.marks !== 1 ? 's' : ''}]
                </span>
              )}
              {(question.answer || question.solution) && renderMode === 'full' && (
                <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                  <span className="font-medium text-green-800">Answer: </span>
                  <span className="text-green-700">{question.answer || question.solution}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Examples renderer
 */
const ExamplesRenderer: React.FC<{ examples: any[]; renderMode: string }> = ({ examples, renderMode }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="space-y-3">
      {examples.map((example, index) => (
        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h6 className="font-medium text-yellow-900 mb-2">Example {index + 1}</h6>
          <div className="text-yellow-800">
            {typeof example === 'string' ? (
              <p className="whitespace-pre-wrap">{example}</p>
            ) : (
              <pre className="text-sm overflow-auto">{JSON.stringify(example, null, 2)}</pre>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Blocks renderer for new block-based structure
 */
const BlocksRenderer: React.FC<{ blocks: any[]; renderMode: string }> = ({ blocks, renderMode }) => {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <div key={index} className="border-l-4 border-green-200 pl-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            {block.title || `Block ${index + 1}`}
          </h4>
          <div className="space-y-3">
            {Object.entries(block).map(([key, value]) => {
              if (key === 'title') return null;
              return (
                <div key={key} className="text-gray-700">
                  <span className="font-medium text-gray-900 capitalize">{key.replace('_', ' ')}: </span>
                  {typeof value === 'string' ? (
                    <span className="whitespace-pre-wrap">{value}</span>
                  ) : (
                    <pre className="text-sm bg-gray-50 rounded p-2 mt-1 overflow-auto">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Structured content renderer for unknown formats
 */
const StructuredContentRenderer: React.FC<{ data: any; renderMode: string }> = ({ data, renderMode }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-2">Document Structure</h4>
      <pre className={`text-sm text-gray-600 overflow-auto ${renderMode === 'compact' ? 'max-h-32' : 'max-h-96'}`}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

/**
 * Document footer with generation metadata
 */
const DocumentFooter: React.FC<{ document: any }> = ({ document }) => {
  if (!document.generation_reasoning && !document.coverage_notes && !document.personalization_applied) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 px-6 py-4">
      <details className="group">
        <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          <span className="w-4 h-4 mr-2 transform group-open:rotate-90 transition-transform">▶</span>
          Generation Details
        </summary>
        <div className="mt-3 space-y-3 text-sm">
          {document.generation_reasoning && (
            <div>
              <span className="font-medium text-gray-900">Reasoning: </span>
              <span className="text-gray-600">{document.generation_reasoning}</span>
            </div>
          )}
          {document.coverage_notes && (
            <div>
              <span className="font-medium text-gray-900">Coverage: </span>
              <span className="text-gray-600">{document.coverage_notes}</span>
            </div>
          )}
          {document.personalization_applied && (
            <div>
              <span className="font-medium text-gray-900">Personalization: </span>
              <span className="text-gray-600">{document.personalization_applied}</span>
            </div>
          )}
        </div>
      </details>
    </div>
  );
};

export default DocumentRenderer;