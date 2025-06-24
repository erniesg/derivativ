import React, { useState } from 'react';
import { apiService } from '../../services/api';

interface ExportFormat {
  value: string;
  label: string;
  description: string;
  icon: string;
  mimeType: string;
  extension: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    value: 'pdf',
    label: 'PDF',
    description: 'Portable Document Format - ideal for printing',
    icon: '📄',
    mimeType: 'application/pdf',
    extension: 'pdf'
  },
  {
    value: 'docx',
    label: 'Word Document',
    description: 'Microsoft Word format - editable document',
    icon: '📝',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: 'docx'
  },
  {
    value: 'html',
    label: 'HTML',
    description: 'Web page format - viewable in browsers',
    icon: '🌐',
    mimeType: 'text/html',
    extension: 'html'
  },
  {
    value: 'markdown',
    label: 'Markdown',
    description: 'Plain text format with formatting',
    icon: '📋',
    mimeType: 'text/markdown',
    extension: 'md'
  }
];

interface DownloadManagerProps {
  documentId?: string;
  documentTitle?: string;
  generatedContent?: any;
  className?: string;
}

interface DownloadState {
  [format: string]: 'idle' | 'loading' | 'success' | 'error';
}

const DownloadManager: React.FC<DownloadManagerProps> = ({
  documentId,
  documentTitle = 'Generated Material',
  generatedContent,
  className = ''
}) => {
  const [downloadStates, setDownloadStates] = useState<DownloadState>({});
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');

  const updateDownloadState = (format: string, state: DownloadState[string]) => {
    setDownloadStates(prev => ({ ...prev, [format]: state }));
  };

  const downloadFile = async (format: string) => {
    if (!documentId && !generatedContent) {
      console.error('No document ID or content available for download');
      return;
    }

    updateDownloadState(format, 'loading');

    try {
      if (documentId) {
        // Use API to export document
        const response = await apiService.exportDocument(documentId, format);
        
        if (response.success && response.data?.file_path) {
          // Trigger download from server
          const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/download/${response.data.file_path}`;
          triggerDownload(downloadUrl, `${documentTitle}.${EXPORT_FORMATS.find(f => f.value === format)?.extension}`);
        } else {
          throw new Error(response.error || 'Export failed');
        }
      } else if (generatedContent) {
        // Client-side export for immediate content
        const blob = await createBlob(generatedContent, format);
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `${documentTitle}.${EXPORT_FORMATS.find(f => f.value === format)?.extension}`);
        URL.revokeObjectURL(url);
      }

      updateDownloadState(format, 'success');
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        updateDownloadState(format, 'idle');
      }, 3000);

    } catch (error) {
      console.error(`Export failed for ${format}:`, error);
      updateDownloadState(format, 'error');
      
      // Reset error state after 5 seconds
      setTimeout(() => {
        updateDownloadState(format, 'idle');
      }, 5000);
    }
  };

  const createBlob = async (content: any, format: string): Promise<Blob> => {
    const formatInfo = EXPORT_FORMATS.find(f => f.value === format);
    
    if (!formatInfo) {
      throw new Error(`Unsupported format: ${format}`);
    }

    let fileContent: string;

    switch (format) {
      case 'html':
        fileContent = generateHTML(content);
        break;
      case 'markdown':
        fileContent = generateMarkdown(content);
        break;
      case 'pdf':
        // For PDF, we'd typically need a library like jsPDF or send to server
        throw new Error('PDF generation requires server-side processing');
      case 'docx':
        // For DOCX, we'd typically need a library like docx or send to server  
        throw new Error('DOCX generation requires server-side processing');
      default:
        fileContent = JSON.stringify(content, null, 2);
    }

    return new Blob([fileContent], { type: formatInfo.mimeType });
  };

  const generateHTML = (content: any): string => {
    const title = documentTitle;
    let body = '';

    if (typeof content === 'string') {
      body = `<pre>${content}</pre>`;
    } else if (content.sections && Array.isArray(content.sections)) {
      body = content.sections.map((section: any) => 
        `<section>
          <h2>${section.title}</h2>
          <div>${section.content_data || ''}</div>
        </section>`
      ).join('\n');
    } else {
      body = `<pre>${JSON.stringify(content, null, 2)}</pre>`;
    }

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2 { color: #333; }
        section { margin: 20px 0; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    ${body}
</body>
</html>`;
  };

  const generateMarkdown = (content: any): string => {
    let markdown = `# ${documentTitle}\n\n`;

    if (typeof content === 'string') {
      markdown += content;
    } else if (content.sections && Array.isArray(content.sections)) {
      markdown += content.sections.map((section: any) => 
        `## ${section.title}\n\n${section.content_data || ''}\n\n`
      ).join('');
    } else {
      markdown += '```json\n' + JSON.stringify(content, null, 2) + '\n```';
    }

    return markdown;
  };

  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasContent = Boolean(documentId || generatedContent);

  if (!hasContent) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 text-center ${className}`}>
        <svg className="w-8 h-8 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 text-sm">Generate content to enable downloads</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Download Material</h3>
        <p className="text-sm text-gray-500 mt-1">Export your generated content in different formats</p>
      </div>

      <div className="p-6">
        {/* Format Selection */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Choose Export Format</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXPORT_FORMATS.map((format) => {
              const isSelected = selectedFormat === format.value;
              const state = downloadStates[format.value] || 'idle';
              
              return (
                <button
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all duration-200
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 text-blue-900' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{format.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{format.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{format.description}</div>
                      {state !== 'idle' && (
                        <div className={`text-xs mt-2 flex items-center ${
                          state === 'loading' ? 'text-blue-600' :
                          state === 'success' ? 'text-green-600' :
                          'text-red-600'
                        }`}>
                          {state === 'loading' && (
                            <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          )}
                          {state === 'success' && (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {state === 'error' && (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                          {state === 'loading' && 'Generating...'}
                          {state === 'success' && 'Downloaded!'}
                          {state === 'error' && 'Failed'}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            File will be saved as: <span className="font-mono">{documentTitle}.{EXPORT_FORMATS.find(f => f.value === selectedFormat)?.extension}</span>
          </div>
          <button
            onClick={() => downloadFile(selectedFormat)}
            disabled={downloadStates[selectedFormat] === 'loading'}
            className={`
              px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200
              ${downloadStates[selectedFormat] === 'loading'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }
            `}
          >
            {downloadStates[selectedFormat] === 'loading' ? (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download {EXPORT_FORMATS.find(f => f.value === selectedFormat)?.label}</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadManager;