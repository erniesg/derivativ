import React, { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Send, Eraser, Type, Pen, Check, X, MousePointer, Edit3 } from 'lucide-react';

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
  isEditing?: boolean;
}

interface DrawingPath {
  id: string;
  path: Array<{x: number, y: number}>;
  color: string;
  width: number;
}

const Practice: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [workAreaMode, setWorkAreaMode] = useState<'text' | 'draw' | 'select'>('text'); // Text as default
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Enhanced state management
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [drawingPaths, setDrawingPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<Array<{x: number, y: number}>>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementType, setSelectedElementType] = useState<'text' | 'drawing' | null>(null);
  const [isAddingText, setIsAddingText] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
  const [currentTextInput, setCurrentTextInput] = useState('');
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

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
  }, [textElements, drawingPaths, selectedElementId, selectedElementType]);

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
        ctx.strokeStyle = selectedElementId === pathData.id && selectedElementType === 'drawing' 
          ? '#3B82F6' : pathData.color;
        ctx.lineWidth = selectedElementId === pathData.id && selectedElementType === 'drawing' 
          ? pathData.width + 2 : pathData.width;
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
      if (editingTextId !== textEl.id) {
        ctx.font = `${textEl.fontSize}px Arial`;
        ctx.fillStyle = textEl.color;
        ctx.fillText(textEl.text, textEl.x, textEl.y);
        
        // Draw selection border if selected
        if (selectedElementId === textEl.id && selectedElementType === 'text') {
          const metrics = ctx.measureText(textEl.text);
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(textEl.x - 4, textEl.y - textEl.fontSize - 2, metrics.width + 8, textEl.fontSize + 6);
          ctx.setLineDash([]);
        }
      }
    });
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);

    if (workAreaMode === 'text') {
      startTextInput(x, y);
    } else if (workAreaMode === 'select') {
      selectElementAt(x, y);
    }
  };

  const startTextInput = (x: number, y: number) => {
    setIsAddingText(true);
    setTextInputPosition({ x, y });
    setCurrentTextInput('');
    setEditingTextId(null);
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 0);
  };

  const selectElementAt = (x: number, y: number) => {
    // Check text elements first
    const clickedText = textElements.find(textEl => {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      
      ctx.font = `${textEl.fontSize}px Arial`;
      const metrics = ctx.measureText(textEl.text);
      
      return x >= textEl.x - 4 && x <= textEl.x + metrics.width + 4 &&
             y >= textEl.y - textEl.fontSize - 2 && y <= textEl.y + 4;
    });

    if (clickedText) {
      setSelectedElementId(clickedText.id);
      setSelectedElementType('text');
      return;
    }

    // Check drawing paths
    const clickedPath = drawingPaths.find(pathData => {
      return pathData.path.some(point => {
        const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
        return distance <= pathData.width + 5; // 5px tolerance
      });
    });

    if (clickedPath) {
      setSelectedElementId(clickedPath.id);
      setSelectedElementType('drawing');
    } else {
      setSelectedElementId(null);
      setSelectedElementType(null);
    }
  };

  const handleTextInputSubmit = () => {
    if (currentTextInput.trim()) {
      if (editingTextId) {
        // Update existing text
        setTextElements(prev => prev.map(el => 
          el.id === editingTextId 
            ? { ...el, text: currentTextInput }
            : el
        ));
        setEditingTextId(null);
      } else {
        // Add new text
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
      setEditingTextId(null);
    }
  };

  const editSelectedText = () => {
    if (selectedElementId && selectedElementType === 'text') {
      const textElement = textElements.find(el => el.id === selectedElementId);
      if (textElement) {
        setEditingTextId(textElement.id);
        setCurrentTextInput(textElement.text);
        setTextInputPosition({ x: textElement.x, y: textElement.y });
        setIsAddingText(true);
        setTimeout(() => {
          textInputRef.current?.focus();
        }, 0);
      }
    }
  };

  const deleteSelected = () => {
    if (selectedElementId) {
      if (selectedElementType === 'text') {
        setTextElements(prev => prev.filter(el => el.id !== selectedElementId));
      } else if (selectedElementType === 'drawing') {
        setDrawingPaths(prev => prev.filter(path => path.id !== selectedElementId));
      }
      setSelectedElementId(null);
      setSelectedElementType(null);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (workAreaMode !== 'draw') return;
    
    const { x, y } = getCanvasCoordinates(e);
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || workAreaMode !== 'draw') return;

    const { x, y } = getCanvasCoordinates(e);
    setCurrentPath(prev => [...prev, { x, y }]);

    // Draw current path in real-time
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      const newPath: DrawingPath = {
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
    setSelectedElementId(null);
    setSelectedElementType(null);
    setIsAddingText(false);
    setEditingTextId(null);
    redrawCanvas();
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
              <h3 className="text-lg font-semibold text-gray-900">Work Area</h3>
              <div className="flex items-center space-x-2">
                {/* Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
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
                
                {/* Action Buttons */}
                {selectedElementId && selectedElementType === 'text' && (
                  <button
                    onClick={editSelectedText}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit selected text"
                  >
                    <Edit3 size={18} />
                  </button>
                )}
                
                {selectedElementId && (
                  <button
                    onClick={deleteSelected}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete selected element"
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
                  className="absolute bg-white border-2 border-blue-500 rounded px-2 py-1 text-gray-700 font-sans shadow-lg"
                  style={{
                    left: `${(textInputPosition.x / 500) * 100}%`,
                    top: `${((textInputPosition.y - 20) / 400) * 100}%`,
                    fontSize: '16px',
                    minWidth: '120px',
                    zIndex: 10
                  }}
                  placeholder="Type here..."
                />
              )}
            </div>

            {/* Status and Instructions */}
            <div className="mt-4 space-y-2">
              <div className="text-sm text-gray-500">
                {workAreaMode === 'text' && (
                  <p className="flex items-center">
                    <Type size={14} className="mr-2 text-blue-500" />
                    <strong>Text mode:</strong> Click anywhere to add text, press Enter to confirm
                  </p>
                )}
                {workAreaMode === 'draw' && (
                  <p className="flex items-center">
                    <Pen size={14} className="mr-2 text-green-500" />
                    <strong>Draw mode:</strong> Click and drag to draw
                  </p>
                )}
                {workAreaMode === 'select' && (
                  <p className="flex items-center">
                    <MousePointer size={14} className="mr-2 text-purple-500" />
                    <strong>Select mode:</strong> Click on text or drawings to select them
                  </p>
                )}
              </div>
              
              {selectedElementId && (
                <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                  {selectedElementType === 'text' ? 'Text selected' : 'Drawing selected'} - 
                  Use the edit or delete buttons above
                </div>
              )}
              
              <div className="text-xs text-gray-400">
                Elements: {textElements.length} text, {drawingPaths.length} drawings
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Practice;