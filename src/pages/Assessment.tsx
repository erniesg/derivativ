import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useAssessment } from '../contexts/AssessmentContext';
import { Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface Question {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const Assessment: React.FC = () => {
  const { assessmentData, updateTopicScore, getAdaptiveQuestions } = useAssessment();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isCompleted, setIsCompleted] = useState(false);

  // Mock questions - in real app, these would come from API
  const questions: Question[] = [
    {
      id: '1',
      topic: 'Algebra',
      difficulty: 'medium',
      question: 'Solve for x: 2x + 5 = 13',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correctAnswer: 1,
      explanation: '2x + 5 = 13, so 2x = 8, therefore x = 4'
    },
    {
      id: '2',
      topic: 'Geometry',
      difficulty: 'easy',
      question: 'What is the area of a rectangle with length 8 and width 6?',
      options: ['42', '48', '36', '54'],
      correctAnswer: 1,
      explanation: 'Area = length × width = 8 × 6 = 48'
    },
    {
      id: '3',
      topic: 'Trigonometry',
      difficulty: 'hard',
      question: 'If sin(θ) = 3/5, what is cos(θ)?',
      options: ['4/5', '3/4', '5/4', '5/3'],
      correctAnswer: 0,
      explanation: 'Using Pythagorean identity: sin²θ + cos²θ = 1, so cos²θ = 1 - (3/5)² = 16/25, therefore cos(θ) = 4/5'
    },
    {
      id: '4',
      topic: 'Algebra',
      difficulty: 'easy',
      question: 'Simplify: 3x + 2x',
      options: ['5x', '6x', '5x²', '6x²'],
      correctAnswer: 0,
      explanation: 'Like terms can be added: 3x + 2x = 5x'
    },
    {
      id: '5',
      topic: 'Statistics',
      difficulty: 'medium',
      question: 'What is the median of: 2, 5, 8, 3, 9, 1, 7?',
      options: ['5', '6', '7', '8'],
      correctAnswer: 0,
      explanation: 'First arrange in order: 1, 2, 3, 5, 7, 8, 9. The median is the middle value: 5'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setShowResults(true);

    // Calculate scores and update assessment data
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      const score = isCorrect ? 10 : 0;
      
      updateTopicScore(question.topic, score, question.difficulty);
    });
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="mb-6">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                percentage >= 70 ? 'bg-green-100' : percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {percentage >= 70 ? 
                  <CheckCircle className="w-8 h-8 text-green-600" /> :
                  <XCircle className="w-8 h-8 text-red-600" />
                }
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
            <p className="text-gray-600 mb-6">
              You scored {correctAnswers} out of {totalQuestions} questions ({percentage}%)
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Updated Topic Scores</h2>
              {assessmentData?.topicScores.map(topic => (
                <div key={topic.topic} className="flex justify-between items-center py-2">
                  <span className="text-gray-700">{topic.topic}</span>
                  <span className={`font-semibold ${
                    topic.score >= 7 ? 'text-green-600' : 
                    topic.score >= 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {topic.score}/10
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Auto-Assessment</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-1" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQ.difficulty.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">{currentQ.topic}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3 mb-8">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedAnswer !== null
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
              <ArrowRight size={16} className="ml-2 inline" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Assessment;