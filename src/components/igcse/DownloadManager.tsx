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
      // First, check if downloads are already available from the new API response
      if (generatedContent?.downloads && generatedContent.downloads[format as keyof typeof generatedContent.downloads]) {
        const downloadInfo = generatedContent.downloads[format as keyof typeof generatedContent.downloads];
        if (downloadInfo?.available && downloadInfo.download_url) {
          console.log(`Using pre-generated download URL for ${format}:`, downloadInfo.download_url);
          await triggerDownload(downloadInfo.download_url, `${documentTitle}.${EXPORT_FORMATS.find(f => f.value === format)?.extension}`);
          updateDownloadState(format, 'success');
          setTimeout(() => updateDownloadState(format, 'idle'), 3000);
          return;
        }
      }

      // If we have a markdown_content from the new API, prioritize that for client-side generation
      if (generatedContent?.markdown_content && format === 'markdown') {
        const blob = new Blob([generatedContent.markdown_content], { 
          type: EXPORT_FORMATS.find(f => f.value === 'markdown')?.mimeType 
        });
        const url = URL.createObjectURL(blob);
        await triggerDownload(url, `${documentTitle}.md`);
        URL.revokeObjectURL(url);
        updateDownloadState(format, 'success');
        setTimeout(() => updateDownloadState(format, 'idle'), 3000);
        return;
      }

      // Fallback to API export or client-side generation
      if (documentId) {
        // Use API to export document
        const response = await apiService.exportDocument(documentId, format);
        
        console.log('Export response:', response);
        
        if (response.success && response.data) {
          // Check if there's a download URL or content to download
          if (response.data.r2_file_key || response.data.content) {
            if (response.data.content) {
              // Direct content download
              const blob = new Blob([response.data.content], { 
                type: EXPORT_FORMATS.find(f => f.value === format)?.mimeType 
              });
              const url = URL.createObjectURL(blob);
              await triggerDownload(url, `${documentTitle}.${EXPORT_FORMATS.find(f => f.value === format)?.extension}`);
              URL.revokeObjectURL(url);
            } else if (response.data.r2_file_key && response.data.download_url) {
              // R2 file download via presigned URL
              triggerDownload(response.data.download_url, `${documentTitle}.${EXPORT_FORMATS.find(f => f.value === format)?.extension}`);
            } else if (response.data.r2_file_key) {
              // R2 file created but no presigned URL - show success message
              console.log('R2 file created successfully, but download URL not available in response');
              console.log('File stored at:', response.data.r2_file_key);
              
              // For now, show error to user that backend needs to be updated
              throw new Error('File was created successfully but download URL is not available. Backend needs to be updated.');
            } else {
              // Fallback to client-side generation if no R2 file was created
              console.log('No R2 file created, using client-side generation');
              if (generatedContent) {
                const blob = await createBlob(generatedContent, format);
                const url = URL.createObjectURL(blob);
                await triggerDownload(url, `${documentTitle}.${EXPORT_FORMATS.find(f => f.value === format)?.extension}`);
                URL.revokeObjectURL(url);
              } else {
                throw new Error('No content available for download');
              }
            }
          } else {
            throw new Error('No downloadable content returned');
          }
        } else {
          throw new Error(response.error || 'Export failed');
        }
      } else if (generatedContent) {
        // Client-side export for immediate content - now supports all formats!
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

    let fileContent: string | Uint8Array;

    switch (format) {
      case 'html':
        fileContent = generateHTML(content);
        break;
      case 'markdown':
        fileContent = generateMarkdown(content);
        break;
      case 'pdf':
        fileContent = await generatePDF(content);
        break;
      case 'docx':
        fileContent = await generateDOCX(content);
        break;
      default:
        fileContent = JSON.stringify(content, null, 2);
    }

    return new Blob([fileContent], { type: formatInfo.mimeType });
  };

  const formatContentAsText = (content: any): string => {
    const title = documentTitle || content.title || 'Generated Material';
    let text = `${title}\n${'='.repeat(title.length)}\n\n`;

    if (typeof content === 'string') {
      text += content;
    } else if (content.sections && Array.isArray(content.sections)) {
      content.sections.forEach((section: any, index: number) => {
        text += `${index + 1}. ${section.title}\n${'-'.repeat(section.title.length + 3)}\n\n`;
        
        if (typeof section.content_data === 'object' && section.content_data !== null) {
          // Handle common structured content patterns
          if (section.content_data.objectives && Array.isArray(section.content_data.objectives)) {
            section.content_data.objectives.forEach((objective: string, index: number) => {
              text += `• ${objective}\n`;
            });
          } else if (section.content_data.steps && Array.isArray(section.content_data.steps)) {
            section.content_data.steps.forEach((step: string, index: number) => {
              text += `${index + 1}. ${step}\n`;
            });
          } else if (section.content_data.practice && Array.isArray(section.content_data.practice)) {
            section.content_data.practice.forEach((item: string, index: number) => {
              text += `Practice ${index + 1}: ${item}\n`;
            });
          } else if (section.content_data.solutions && Array.isArray(section.content_data.solutions)) {
            section.content_data.solutions.forEach((solution: string, index: number) => {
              text += `Solution ${index + 1}: ${solution}\n`;
            });
          } else if (section.content_data.examples && Array.isArray(section.content_data.examples)) {
            section.content_data.examples.forEach((example: string, index: number) => {
              text += `Example ${index + 1}: ${example}\n`;
            });
          } else if (section.content_type === 'worked_examples' && typeof Object.values(section.content_data)[0] === 'object') {
            // Handle worked examples with steps
            Object.entries(section.content_data).forEach(([key, value]: [string, any]) => {
              if (typeof value === 'object' && value.example && value.steps) {
                text += `${value.example}\n`;
                value.steps.forEach((step: string, stepIndex: number) => {
                  text += `  ${stepIndex + 1}. ${step}\n`;
                });
                text += '\n';
              } else {
                text += `${key}: ${JSON.stringify(value)}\n`;
              }
            });
          } else {
            // Handle numbered objects (questions, learning objectives, etc.)
            Object.entries(section.content_data).forEach(([key, value]) => {
              text += `${key}: ${value}\n`;
            });
          }
        } else {
          text += `${section.content_data || ''}\n`;
        }
        text += '\n';
      });
    } else if (typeof content === 'object') {
      // Handle flat object with numbered keys
      Object.entries(content).forEach(([key, value]) => {
        text += `${key}: ${value}\n`;
      });
    } else {
      text += JSON.stringify(content, null, 2);
    }

    return text;
  };

  const generatePDF = async (content: any): Promise<Uint8Array> => {
    // Create a formatted text version for PDF
    const textContent = formatContentAsText(content);
    
    // Simple PDF structure with proper text formatting
    const escapedText = textContent.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\\/g, '\\\\');
    const textLines = escapedText.split('\n').filter(line => line.trim());
    
    let pdfContent = '';
    let yPosition = 720;
    const lineHeight = 14;
    
    textLines.forEach((line, index) => {
      if (yPosition < 50) {
        // Start new page if needed (simplified)
        yPosition = 720;
      }
      pdfContent += `72 ${yPosition} Td (${line.substring(0, 80)}) Tj T* `;
      yPosition -= lineHeight;
    });

    const pdfHeader = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Times-Roman
>>
>>
>>
>>
endobj

4 0 obj
<<
/Length ${pdfContent.length + 50}
>>
stream
BT
/F1 12 Tf
${pdfContent}
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000348 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${400 + pdfContent.length}
%%EOF`;

    return new TextEncoder().encode(pdfHeader);
  };

  const generateDOCX = async (content: any): Promise<Uint8Array> => {
    // Create RTF format which can be opened by Word
    const textContent = formatContentAsText(content);
    
    // Convert newlines to RTF paragraph breaks and escape special characters
    const rtfText = textContent
      .replace(/\\/g, '\\\\')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\n/g, '\\par\n');
    
    const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}} 
\\f0\\fs24 ${rtfText} }`;
    
    return new TextEncoder().encode(rtfContent);
  };

  const stripHtml = (html: string): string => {
    // Remove HTML tags and decode entities
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  };

  const generateHTML = (content: any): string => {
    const title = documentTitle || content.title || 'Generated Material';
    let body = '';

    console.log('Generating HTML for content:', content);

    if (typeof content === 'string') {
      body = `<pre>${content}</pre>`;
    } else if (content.sections && Array.isArray(content.sections)) {
      body = content.sections.map((section: any) => {
        let sectionContent = '';
        
        if (typeof section.content_data === 'object' && section.content_data !== null) {
          // Handle different types of structured content
          if (section.content_type === 'worked_examples' && typeof Object.values(section.content_data)[0] === 'object') {
            // Special handling for worked examples with steps
            sectionContent = Object.entries(section.content_data).map(([key, value]: [string, any]) => {
              if (typeof value === 'object' && value.example && value.steps) {
                return `<div class="example">
                  <h4>${value.example}</h4>
                  <ol>
                    ${value.steps.map((step: string) => `<li>${step}</li>`).join('')}
                  </ol>
                </div>`;
              } else {
                return `<p><strong>${key}:</strong> ${JSON.stringify(value)}</p>`;
              }
            }).join('');
          } else {
            // Handle numbered objects (like learning objectives, questions, etc.)
            sectionContent = Object.entries(section.content_data)
              .map(([key, value]) => {
                const className = section.content_type === 'practice_questions' ? 'question' :
                                 section.content_type === 'solutions' ? 'solution' : '';
                return `<div class="${className}"><strong>${key}:</strong> ${value}</div>`;
              })
              .join('');
          }
        } else {
          sectionContent = section.content_data || '';
        }
        
        return `<section>
          <h2>${section.title}</h2>
          <div>${sectionContent}</div>
        </section>`;
      }).join('\n');
    } else if (typeof content === 'object') {
      // Handle the case where content is a flat object with numbered keys
      body = Object.entries(content)
        .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
        .join('\n');
    } else {
      body = `<pre>${JSON.stringify(content, null, 2)}</pre>`;
    }

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          max-width: 900px; 
          margin: 0 auto; 
          padding: 40px 20px; 
          line-height: 1.6; 
          color: #333;
        }
        h1 { 
          color: #2c3e50; 
          border-bottom: 3px solid #3498db; 
          padding-bottom: 15px; 
          font-size: 2.5em;
          margin-bottom: 30px;
        }
        h2 { 
          color: #34495e; 
          border-bottom: 2px solid #ecf0f1; 
          padding-bottom: 10px; 
          margin-top: 40px;
          margin-bottom: 20px;
        }
        h4 {
          color: #7f8c8d;
          margin: 15px 0 10px 0;
        }
        section { 
          margin: 40px 0; 
          background: #fdfdfd;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        div { margin: 12px 0; }
        p { margin: 10px 0; }
        strong { color: #2c3e50; font-weight: 600; }
        pre { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          overflow-x: auto;
          border: 1px solid #e9ecef;
        }
        .question { 
          background: #e3f2fd; 
          padding: 15px; 
          margin: 15px 0; 
          border-left: 5px solid #2196f3;
          border-radius: 5px;
        }
        .solution { 
          background: #e8f5e8; 
          padding: 15px; 
          margin: 15px 0; 
          border-left: 5px solid #4caf50;
          border-radius: 5px;
        }
        .example {
          background: #fff3e0;
          padding: 15px;
          margin: 15px 0;
          border-left: 5px solid #ff9800;
          border-radius: 5px;
        }
        ol, ul {
          padding-left: 25px;
        }
        li {
          margin: 5px 0;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    ${body}
</body>
</html>`;
  };

  const generateMarkdown = (content: any): string => {
    const title = documentTitle || content.title || 'Generated Material';
    let markdown = `# ${title}\n\n`;

    // Check if we already have markdown content from the new API
    if (content.markdown_content) {
      return content.markdown_content;
    }

    if (typeof content === 'string') {
      markdown += content;
    } else if (content.sections && Array.isArray(content.sections)) {
      content.sections.forEach((section: any) => {
        markdown += `## ${section.title}\n\n`;
        
        if (typeof section.content_data === 'object' && section.content_data !== null) {
          if (section.content_type === 'worked_examples' && typeof Object.values(section.content_data)[0] === 'object') {
            // Handle worked examples with steps
            Object.entries(section.content_data).forEach(([key, value]: [string, any]) => {
              if (typeof value === 'object' && value.example && value.steps) {
                markdown += `### ${value.example}\n\n`;
                value.steps.forEach((step: string, stepIndex: number) => {
                  markdown += `${stepIndex + 1}. ${step}\n`;
                });
                markdown += '\n';
              } else {
                markdown += `**${key}:** ${JSON.stringify(value)}\n\n`;
              }
            });
          } else {
            // Handle numbered objects
            Object.entries(section.content_data).forEach(([key, value]) => {
              markdown += `**${key}:** ${value}\n\n`;
            });
          }
        } else {
          markdown += `${section.content_data || ''}\n\n`;
        }
      });
    } else if (typeof content === 'object') {
      // Handle flat object with numbered keys
      Object.entries(content).forEach(([key, value]) => {
        markdown += `**${key}:** ${value}\n\n`;
      });
    } else {
      markdown += '```json\n' + JSON.stringify(content, null, 2) + '\n```';
    }

    return markdown;
  };

  const triggerDownload = async (url: string, filename: string) => {
    try {
      // For URLs that are from Cloudflare R2, fetch the content and create a blob
      if (url.includes('r2.cloudflarestorage.com') || url.includes('cloudflare')) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        URL.revokeObjectURL(objectUrl);
      } else {
        // For blob URLs or other local URLs, use direct download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab if direct download fails
      window.open(url, '_blank');
    }
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