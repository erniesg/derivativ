import React, { useState } from 'react';
import { AuthGuard } from '../components/auth/AuthGuard';
import { useUser } from '../contexts/UserContext';
import { TldrawWorkArea } from '../components/TldrawWorkArea';
import { Send, Check, X } from 'lucide-react';

interface Question {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer: string;
  hints: string[];
}

const Practice: React.FC = () => {
  const { userRole } = useUser();

  // Redirect teachers to generation page
  if (userRole !== 'student') {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
            <p className="text-gray-600">Practice sessions are only available to students.</p>
            <button
              onClick={() => window.location.href = '/teacher/generate'}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Teacher Dashboard
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
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

  const handleSaveWork = (data: any) => {
    console.log('Saving work:', data);
    // Here you could save the drawing data to your backend
  };

  const handleClearWork = () => {
    console.log('Clearing work area');
    // tldraw handles this internally
  };

  const checkAnswer = () => {
    const userAnswer = textAnswer.toLowerCase().trim();
    const correctAnswer = currentQ.answer.toLowerCase().trim();
    const correct = userAnswer === correctAnswer;

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
    }
  };

  const getNextHint = () => {
    if (!showHints) {
      setShowHints(true);
    } else if (hintIndex < currentQ.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

  return (
    <AuthGuard
      title="Sign in to Practice"
      description="Please sign in to access interactive practice sessions and track your progress."
    >
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
            {/* Question Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
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
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${textAnswer.trim()
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
                  <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
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

            {/* Enhanced Work Area with tldraw */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Work Area</h3>
                <div className="text-sm text-gray-500">
                  Use the drawing tools to work through the problem
                </div>
              </div>

              <TldrawWorkArea
                height="500px"
                mobileHeight="350px"
                onSave={handleSaveWork}
                onClear={handleClearWork}
                className="mb-4"
              />

              <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                <p><strong>💡 Pro tip:</strong> Use the drawing tools to visualize the problem, draw diagrams, or show your work step by step. Right-click for more options including save and clear.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Practice;