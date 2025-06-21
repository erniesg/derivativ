import React, { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Send, Eraser, Type, Pen, Check, X, MousePointer } from 'lucide-react';

interface Question {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer: string;
  hints: string[];
}

interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

const Practice: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [workAreaMode, setWorkAreaMode] = useState<'draw' | 'text' | 'select'>('draw');
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Text and drawing state
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [isAddingText, setIsAddingText] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
  const [currentTextInput, setCurrentTextInput] = useState('');
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [drawingPaths, setDrawingPaths] = useState<Array<{id: string, path: Array<{x: number, y: number}>, color: string, width: number}>>([]);
  const [currentPath, setCurrentPath] = useState<Array<{x: number, y: number}>>([]);

  const questions: Question[] = [
    {
      id: '1',
      topic: 'Algebra',
      difficulty: 'medium',
      question: 'Solve the quadratic equation: x² - 5x + 6 = 0',
      answer: 'x = 2 or x = 3',
      hints: [
        'Try factoring the quadratic expression',
        'Look for two numbers that multiply to 6 and add to -5',
        'The factors are (x - 2)(x - 3) = 0'
      ]
    },
    {
      id: '2',
      topic: 'Geometry',
      difficulty: 'easy',
      question: 'Find the area of a triangle with base 10 cm and height 8 cm',
      answer: '40 cm²',
      hints: [
        'Use the formula: Area = ½ × base × height',
        'Substitute the values: Area = ½ × 10 × 8'
      ]
    }
  ];

  const currentQ = questions[currentQuestion];

  useEffect(() => {
    redrawCanvas();
  }, [textElements, drawingPaths]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all paths
    drawingPaths.forEach(pathData => {
      if (pathData.path.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = pathData.color;
        ctx.lineWidth = pathData.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.moveTo(pathData.path[0].x, pathData.path[0].y);
        pathData.path.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    });

    // Draw all text elements
    textElements.forEach(textEl => {
      ctx.font = `${textEl.fontSize}px Arial`;
      ctx.fillStyle = textEl.color;
      ctx.fillText(textEl.text, textEl.x, textEl.y);
      
      // Draw selection border if selected
      if (selectedTextId === textEl.id) {
        const metrics = ctx.measureText(textEl.text);
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.strokeRect(textEl.x - 2, textEl.y - textEl.fontSize - 2, metrics.width + 4, textEl.fontSize + 4);
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (workAreaMode === 'text') {
      // Start adding text at clicked position
      setIsAddingText(true);
      setTextInputPosition({ x, y });
      setCurrentTextInput('');
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    } else if (workAreaMode === 'select') {
      // Check if clicking on existing text
      const clickedText = textElements.find(textEl => {
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        
        ctx.font = `${textEl.fontSize}px Arial`;
        const metrics = ctx.measureText(textEl.text);
        
        return x >= textEl.x && x <= textEl.x + metrics.width &&
               y >= textEl.y - textEl.fontSize && y <= textEl.y;
      });
      
      setSelectedTextId(clickedText ? clickedText.id : null);
    }
  };

  const handleTextInputSubmit = () => {
    if (currentTextInput.trim()) {
      const newTextElement: TextElement = {
        id: Date.now().toString(),
        x: textInputPosition.x,
        y: textInputPosition.y,
        text: currentTextInput,
        fontSize: 16,
        color: '#374151'
      };
      
      setTextElements(prev => [...prev, newTextElement]);
    }
    
    setIsAddingText(false);
    setCurrentTextInput('');
  };

  const handleTextInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextInputSubmit();
    } else if (e.key === 'Escape') {
      setIsAddingText(false);
      setCurrentTextInput('');
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (workAreaMode !== 'draw') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || workAreaMode !== 'draw') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPath(prev => [...prev, { x, y }]);

    // Draw current path in real-time
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    if (currentPath.length > 0) {
      const lastPoint = currentPath[currentPath.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && currentPath.length > 1) {
      const newPath = {
        id: Date.now().toString(),
        path: currentPath,
        color: '#374151',
        width: 2
      };
      setDrawingPaths(prev => [...prev, newPath]);
    }
    
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearWorkArea = () => {
    setTextElements([]);
    setDrawingPaths([]);
    setSelectedTextId(null);
    setIsAddingText(false);
    redrawCanvas();
  };

  const deleteSelected = () => {
    if (selectedTextId) {
      setTextElements(prev => prev.filter(el => el.id !== selectedTextId));
      setSelectedTextId(null);
    }
  };

  const checkAnswer = () => {
    const correct = textAnswer.toLowerCase().includes(currentQ.answer.toLowerCase()) ||
                   currentQ.answer.toLowerCase().includes(textAnswer.toLowerCase());
    setIsCorrect(correct);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTextAnswer('');
      setShowHints(false);
      setHintIndex(0);
      setShowAnswer(false);
      setIsCorrect(null);
      clearWorkArea();
    }
  };

  const getNextHint = () => {
    if (hintIndex < currentQ.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
    setShowHints(true);
  };

  const getCursorStyle = () => {
    switch (workAreaMode) {
      case 'text': return 'cursor-text';
      case 'draw': return 'cursor-crosshair';
      case 'select': return 'cursor-pointer';
      default: return 'cursor-default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Question Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentQ.difficulty.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">{currentQ.topic}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQ.question}
              </h2>

              {/* Text Answer Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer
                </label>
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={checkAnswer}
                  disabled={!textAnswer.trim()}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    textAnswer.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={16} className="inline mr-2" />
                  Submit Answer
                </button>
                
                <button
                  onClick={getNextHint}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Get Hint ({hintIndex + 1}/{currentQ.hints.length})
                </button>
              </div>

              {/* Hints */}
              {showHints && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Hint:</h4>
                  <p className="text-yellow-700">{currentQ.hints[hintIndex]}</p>
                </div>
              )}

              {/* Answer Feedback */}
              {showAnswer && (
                <div className={`mt-4 p-4 rounded-lg ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center mb-2">
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <h4 className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Correct!' : 'Not quite right'}
                    </h4>
                  </div>
                  <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'} mb-3`}>
                    The correct answer is: <strong>{currentQ.answer}</strong>
                  </p>
                  
                  {currentQuestion < questions.length - 1 && (
                    <button
                      onClick={nextQuestion}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Next Question →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Work Area Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Interactive Work Area</h3>
              <div className="flex items-center space-x-2">
                {/* Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setWorkAreaMode('draw')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      workAreaMode === 'draw'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title="Draw mode"
                  >
                    <Pen size={14} />
                    <span>Draw</span>
                  </button>
                  <button
                    onClick={() => setWorkAreaMode('text')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      workAreaMode === 'text'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title="Text mode - click anywhere to add text"
                  >
                    <Type size={14} />
                    <span>Text</span>
                  </button>
                  <button
                    onClick={() => setWorkAreaMode('select')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      workAreaMode === 'select'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title="Select mode"
                  >
                    <MousePointer size={14} />
                    <span>Select</span>
                  </button>
                </div>
                
                {selectedTextId && (
                  <button
                    onClick={deleteSelected}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete selected text"
                  >
                    <X size={18} />
                  </button>
                )}
                
                <button
                  onClick={clearWorkArea}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Clear all"
                >
                  <Eraser size={18} />
                </button>
              </div>
            </div>

            <div className="relative border-2 border-dashed border-gray-300 rounded-lg">
              <canvas
                ref={canvasRef}
                width={500}
                height={400}
                className={`w-full h-96 border border-gray-200 rounded-lg bg-white ${getCursorStyle()}`}
                onClick={handleCanvasClick}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              
              {/* Text Input Overlay */}
              {isAddingText && (
                <input
                  ref={textInputRef}
                  type="text"
                  value={currentTextInput}
                  onChange={(e) => setCurrentTextInput(e.target.value)}
                  onKeyDown={handleTextInputKeyDown}
                  onBlur={handleTextInputSubmit}
                  className="absolute bg-transparent border-none outline-none text-gray-700 font-sans"
                  style={{
                    left: `${textInputPosition.x}px`,
                    top: `${textInputPosition.y - 16}px`,
                    fontSize: '16px',
                    minWidth: '100px'
                  }}
                  placeholder="Type here..."
                />
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500 space-y-1">
              {workAreaMode === 'draw' && (
                <p className="flex items-center">
                  <Pen size={14} className="mr-2" />
                  Draw mode: Click and drag to draw
                </p>
              )}
              {workAreaMode === 'text' && (
                <p className="flex items-center">
                  <Type size={14} className="mr-2" />
                  Text mode: Click anywhere to add text, press Enter to confirm
                </p>
              )}
              {workAreaMode === 'select' && (
                <p className="flex items-center">
                  <MousePointer size={14} className="mr-2" />
                  Select mode: Click on text to select and edit
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Practice;