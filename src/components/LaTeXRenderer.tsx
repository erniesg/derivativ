import React from 'react';Add commentMore actions
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface LaTeXRendererProps {
  text: string;
  className?: string;
  block?: boolean;
}

const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ text, className = '', block = false }) => {
  // Function to parse and render text with LaTeX expressions
  const renderTextWithLatex = (inputText: string) => {
    // Handle both $...$ and $$...$$ patterns
    const parts = [];
    let currentIndex = 0;

    // Regex to match LaTeX expressions
    // Matches both $...$ (inline) and $$...$$ (block) patterns
    const latexRegex = /(\$\$.*?\$\$|\$.*?\$)/g;
    let match;

    while ((match = latexRegex.exec(inputText)) !== null) {
      // Add text before the LaTeX expression
      if (match.index > currentIndex) {
        const textBefore = inputText.slice(currentIndex, match.index);
        if (textBefore) {
          parts.push(
            <span key={`text-${currentIndex}`}>
              {textBefore}
            </span>
          );
        }
      }

      // Add the LaTeX expression
      const latexExpression = match[0];
      const isBlockMath = latexExpression.startsWith('$$');
      const mathContent = isBlockMath
        ? latexExpression.slice(2, -2) // Remove $$ from both ends
        : latexExpression.slice(1, -1); // Remove $ from both ends

      try {
        parts.push(
          isBlockMath ? (
            <BlockMath key={`math-${match.index}`} math={mathContent} />
          ) : (
            <InlineMath key={`math-${match.index}`} math={mathContent} />
          )
        );
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        // Fallback to showing the raw LaTeX if rendering fails
        parts.push(
          <span key={`error-${match.index}`} className="text-red-500 font-mono text-sm">
            {latexExpression}
          </span>
        );
      }

      currentIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last LaTeX expression
    if (currentIndex < inputText.length) {
      const remainingText = inputText.slice(currentIndex);
      if (remainingText) {
        parts.push(
          <span key={`text-${currentIndex}`}>
            {remainingText}
          </span>
        );
      }
    }

    return parts.length > 0 ? parts : [inputText];
  };

  // If block prop is true, render as block math regardless of content
  if (block) {
    // Extract math content if wrapped in $ or $$
    const mathContent = text.replace(/^\$+|\$+$/g, '');
    try {
      return (
        <div className={className}>
          <BlockMath math={mathContent} />
        </div>
      );
    } catch (error) {
      console.error('KaTeX block rendering error:', error);
      return (
        <div className={`${className} text-red-500 font-mono text-sm`}>
          {text}
        </div>
      );
    }
  }

  return (
    <span className={className}>
      {renderTextWithLatex(text)}
    </span>
  );
};

export default LaTeXRenderer; 