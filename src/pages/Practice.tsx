import React, { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Send, Eraser, Type, Pen, Check, X } from 'lucide-react';

interface Question {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer: string;
  hints: string[];
}

const Practice: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [workAreaMode, setWorkAreaMode] = useState<'draw' | 'type'>('draw');
  const [workAreaText, setWorkAreaText] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (workAreaMode !== 'draw') return;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || workAreaMode !== 'draw') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const clearWorkArea = () => {
    if (workAreaMode === 'draw') {
      clearCanvas();
    } else {
      setWorkAreaText('');
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
      setWorkAreaText('');
      setShowHints(false);
      setHintIndex(0);
      setShowAnswer(false);
      setIsCorrect(null);
      clearCanvas();
    }
  };

  const getNextHint = () => {
    if (hintIndex < currentQ.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
    setShowHints(true);
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

          {/* Work Area Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Work Area</h3>
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
                  >
                    <Pen size={14} />
                    <span>Draw</span>
                  </button>
                  <button
                    onClick={() => setWorkAreaMode('type')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      workAreaMode === 'type'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Type size={14} />
                    <span>Type</span>
                  </button>
                </div>
                
                <button
                  onClick={clearWorkArea}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Clear work area"
                >
                  <Eraser size={18} />
                </button>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {workAreaMode === 'draw' ? (
                <>
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={400}
                    className="w-full h-96 border border-gray-200 rounded-lg cursor-crosshair bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Draw your working steps, diagrams, or calculations here
                  </p>
                </>
              ) : (
                <>
                  <textarea
                    ref={textAreaRef}
                    value={workAreaText}
                    onChange={(e) => setWorkAreaText(e.target.value)}
                    placeholder="Type your working steps, calculations, or notes here..."
                    className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Type your working steps, calculations, or notes here
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Practice;