import React, { useState, useEffect, useCallback } from 'react';
import { useAssessment } from '../contexts/AssessmentContext';
import { AuthGuard } from '../components/auth/AuthGuard';
import { AuthService } from '../services/auth';
import LaTeXRenderer from '../components/LaTeXRenderer';
import { Clock, CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';

interface QuizOption {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface ApiQuestion {
  id: string;
  topic_id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  stem: string;
  options: QuizOption;
}

interface QuizSession {
  id: string;
  user_id: string;
  status: 'active' | 'completed';
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  questions_selected: string[];
  total_questions: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

interface QuizInitResponse {
  message: string;
  data: {
    session: QuizSession;
    questions: ApiQuestion[];
  };
}

interface TransformedQuestion {
  id: string;
  topic: string;
  topic_id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  stem: string;
}

interface SubmissionResult {
  questionId: string;
  isCorrect: boolean;
  correctAnswer: string;
  topicId: number;
  userAnswer: string | null;
}

interface CompleteResponse {
  data: {
    id: string;
    quiz_session_id: string;
    user_id: string;
    topic_scores: Record<string, number>;
    overall_score: number;
    total_questions: number;
    correct_answers: number;
    completion_time_seconds: number;
    created_at: string;
  };
}

// Topic mapping - you can update this based on your actual topic structure
const getTopicName = (topicId: number): string => {
  const topicMap: Record<number, string> = {
    1: 'Number',
    2: 'Algebra',
    3: 'Geometry',
    4: 'Coordinate Geometry',
    5: 'Trigonometry',
    6: 'Statistics',
    7: 'Probability',
    8: 'Functions',
    9: 'Sequences and Series',
    10: 'Mensuration',
    11: 'Graphs',
    12: 'Transformations'
  };

  return topicMap[topicId] || `Topic ${topicId}`;
};

const Assessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [questions, setQuestions] = useState<TransformedQuestion[]>([]);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResults, setSubmissionResults] = useState<SubmissionResult[]>([]);
  const [completeResults, setCompleteResults] = useState<CompleteResponse['data'] | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<SubmissionResult | null>(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Initialize quiz session and load questions
  const initializeQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current session from Supabase (consistent with auth service)
      const session = await AuthService.getSession();
      if (!session?.access_token) {
        throw new Error('Authentication session not found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/quiz/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize quiz: ${response.statusText}`);
      }

      const data: QuizInitResponse = await response.json();
      console.log('Quiz initialized:', data);

      // Transform questions to match component structure
      const transformedQuestions = data.data.questions.map((q, index) => ({
        id: q.id,
        topic: getTopicName(q.topic_id), // Use proper topic names
        topic_id: q.topic_id,
        difficulty: q.difficulty,
        question: q.stem,
        stem: q.stem,
        options: [q.options.A, q.options.B, q.options.C, q.options.D]
      }));

      setQuestions(transformedQuestions);
      setSession(data.data.session);
      setAnswers(new Array(transformedQuestions.length).fill(null));
    } catch (err) {
      console.error('Error initializing quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize quiz on component mount
  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  const handleComplete = useCallback(async () => {
    if (!session) return;

    try {
      setSubmitting(true);

      // Get authentication session
      const authSession = await AuthService.getSession();
      if (!authSession?.access_token) {
        throw new Error('Authentication session expired');
      }

      // Call complete endpoint to finalize the quiz (answers already submitted)
      try {
        const completeResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/quiz/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authSession.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sessionId: session.id
          })
        });

        if (completeResponse.ok) {
          const completeData: CompleteResponse = await completeResponse.json();
          setCompleteResults(completeData.data);
          console.log('Quiz completed successfully:', completeData.data);
        } else {
          console.error('Failed to complete quiz:', completeResponse.statusText);
        }
      } catch (completeError) {
        console.error('Error completing quiz:', completeError);
      }

      setShowResults(true);

    } catch (err) {
      console.error('Error completing assessment:', err);
      // Show results even if completion fails
      setShowResults(true);
    } finally {
      setSubmitting(false);
    }
  }, [session]);

  useEffect(() => {
    if (questions.length === 0 || currentFeedback) return;

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
  }, [handleComplete, questions.length, currentFeedback]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = async () => {
    if (selectedAnswer === null || !session) return;

    setSubmittingAnswer(true);

    try {
      // Get authentication session
      const authSession = await AuthService.getSession();
      if (!authSession?.access_token) {
        throw new Error('Authentication session expired');
      }

      const question = questions[currentQuestion];
      const userAnswer = ['A', 'B', 'C', 'D'][selectedAnswer];

      // Submit the current answer
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/quiz/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authSession.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: session.id,
          questionId: question.id,
          answer: userAnswer
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit answer: ${response.statusText}`);
      }

      const result = await response.json();

      // Create feedback object
      const feedback: SubmissionResult = {
        questionId: question.id,
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
        topicId: result.topicId,
        userAnswer: userAnswer
      };

      // Update answers and submission results
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);

      const newResults = [...submissionResults, feedback];
      setSubmissionResults(newResults);

      // Show feedback inline
      setCurrentFeedback(feedback);

      // Auto-proceed to next question after showing feedback for 2 seconds
      setTimeout(() => {
        proceedToNext();
      }, 2000);

    } catch (error) {
      console.error('Error submitting answer:', error);
      // Still allow progression even if submission fails
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);

      // Move to next question without feedback
      proceedToNext();
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const proceedToNext = () => {
    setCurrentFeedback(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleComplete();
    }
  };

  // Loading state
  if (loading) {
    return (
      <AuthGuard
        title="Sign in to Ace Your Exam"
        description="Please sign in to start your personalized assessment quiz and track your progress."
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Preparing Your Assessment</h2>
            <p className="text-gray-600">Loading personalized questions...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Error state
  if (error) {
    return (
      <AuthGuard
        title="Sign in to Ace Your Exam"
        description="Please sign in to start your personalized assessment quiz and track your progress."
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Assessment</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={initializeQuiz}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Submitting state
  if (submitting) {
    return (
      <AuthGuard
        title="Sign in to Ace Your Exam"
        description="Please sign in to start your personalized assessment quiz and track your progress."
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Submitting Your Answers</h2>
            <p className="text-gray-600">Processing your assessment results...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (showResults) {
    const totalQuestions = questions.length;
    const hasSubmissionResults = submissionResults.length > 0;

    // Use complete results if available, otherwise fall back to submission results
    const correctAnswers = completeResults ? completeResults.correct_answers :
      (hasSubmissionResults ? submissionResults.filter(result => result.isCorrect).length : 0);
    const percentage = completeResults ? Math.round((completeResults.correct_answers / completeResults.total_questions) * 100) :
      (hasSubmissionResults ? Math.round((correctAnswers / totalQuestions) * 100) : 0);
    const overallScore = completeResults ? completeResults.overall_score : null;

    // Group results by topic - use complete results if available
    const topicResults = completeResults ?
      Object.entries(completeResults.topic_scores).reduce((acc, [topicId, score]) => {
        const topicName = getTopicName(parseInt(topicId));
        acc[topicName] = {
          score: score,
          total: 1, // We'll use this differently for complete results
          correct: score >= 5 ? 1 : 0 // Assuming 5+ is passing
        };
        return acc;
      }, {} as Record<string, { score?: number; correct: number; total: number }>) :
      (hasSubmissionResults ? submissionResults.reduce((acc, result) => {
        const topicName = getTopicName(result.topicId);
        if (!acc[topicName]) {
          acc[topicName] = { correct: 0, total: 0 };
        }
        acc[topicName].total++;
        if (result.isCorrect) {
          acc[topicName].correct++;
        }
        return acc;
      }, {} as Record<string, { correct: number; total: number }>) : {});

    return (
      <AuthGuard
        title="Sign in to Ace Your Exam"
        description="Please sign in to start your personalized assessment quiz and track your progress."
      >
        <div className="min-h-screen bg-gray-50">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mb-4">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${percentage >= 70 ? 'bg-green-100' :
                    percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                    {percentage >= 70 ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600" />
                    )}
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
                <p className="text-gray-600 mb-4">
                  {completeResults ?
                    `You scored ${correctAnswers} out of ${completeResults.total_questions} questions (${percentage}%)` :
                    (hasSubmissionResults ?
                      `You scored ${correctAnswers} out of ${totalQuestions} questions (${percentage}%)` :
                      `Assessment completed with ${totalQuestions} questions answered`
                    )
                  }
                </p>

                {/* Overall Score from Complete Results */}
                {completeResults && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Overall Score</p>
                    <div className="text-2xl font-bold text-blue-600">
                      {completeResults.overall_score}/100
                    </div>
                  </div>
                )}

                {(completeResults || hasSubmissionResults) && (
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${percentage >= 70 ? 'bg-green-100 text-green-800' :
                    percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {percentage >= 70 ? 'Excellent!' : percentage >= 50 ? 'Good work!' : 'Keep practicing!'}
                  </div>
                )}
              </div>

              {/* Topic Performance */}
              {(completeResults || hasSubmissionResults) && Object.keys(topicResults).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance by Topic</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(topicResults).map(([topic, stats]) => {
                      // Handle both complete results (with scores) and submission results (with correct/total)
                      let displayValue: string;
                      let percentage: number;

                      if (completeResults && 'score' in stats && typeof stats.score === 'number') {
                        // Complete results show topic scores out of 9 (typical max score)
                        displayValue = `${stats.score.toFixed(1)}/9`;
                        percentage = Math.round((stats.score / 9) * 100);
                      } else {
                        // Submission results show correct/total
                        const topicPercentage = Math.round((stats.correct / stats.total) * 100);
                        displayValue = `${stats.correct}/${stats.total} (${topicPercentage}%)`;
                        percentage = topicPercentage;
                      }

                      return (
                        <div key={topic} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-900">{topic}</h3>
                            <span className={`text-sm font-semibold ${percentage >= 70 ? 'text-green-600' :
                              percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                              {displayValue}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${percentage >= 70 ? 'bg-green-500' :
                                percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question by Question Review */}
              {hasSubmissionResults && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Review</h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {submissionResults.map((result, index) => (
                      <div key={result.questionId} className={`p-4 rounded-lg border-2 ${result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                        }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-600">
                                Question {index + 1}
                              </span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                                {getTopicName(result.topicId)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-800 mb-2">
                              <LaTeXRenderer text={questions[index]?.question || ''} />
                            </div>
                            <div className="text-xs space-y-1">
                              <p>
                                <span className="text-gray-600">Your answer:</span>
                                <span className={result.isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                                  {result.userAnswer || 'No answer'}
                                </span>
                              </p>
                              {!result.isCorrect && (
                                <p>
                                  <span className="text-gray-600">Correct answer:</span>
                                  <span className="text-green-700 font-medium">{result.correctAnswer}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className={`ml-4 p-1 rounded-full ${result.isCorrect ? 'bg-green-200' : 'bg-red-200'
                            }`}>
                            {result.isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback message when no results available */}
              {!completeResults && !hasSubmissionResults && (
                <div className="mb-8 text-center py-8">
                  <p className="text-gray-600 mb-4">
                    There was an issue processing your results, but your assessment has been completed.
                  </p>
                  <p className="text-sm text-gray-500">
                    Please check your dashboard for updated analytics.
                  </p>
                </div>
              )}

              {/* Session Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Session Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-900">Total Questions</p>
                    <p>{completeResults ? completeResults.total_questions : totalQuestions}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Correct Answers</p>
                    <p className="text-green-600 font-semibold">
                      {(completeResults || hasSubmissionResults) ? correctAnswers : '--'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Time Taken</p>
                    <p>
                      {completeResults ?
                        `${Math.floor(completeResults.completion_time_seconds / 60)}:${(completeResults.completion_time_seconds % 60).toString().padStart(2, '0')}` :
                        formatTime(1800 - timeLeft)
                      }
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Session ID</p>
                    <p className="text-xs font-mono">{session?.id?.substring(0, 8)}...</p>
                  </div>
                </div>
                {completeResults && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium text-gray-900">Result ID</p>
                        <p className="text-xs font-mono">{completeResults.id.substring(0, 8)}...</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Completed At</p>
                        <p>{new Date(completeResults.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  {completeResults ?
                    'Great job completing the assessment! Your detailed analytics and scores have been recorded.' :
                    (hasSubmissionResults ?
                      'Assessment completed! Your answers have been recorded and analytics updated.' :
                      'Assessment completed! Check your dashboard for updated analytics.'
                    )
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Dashboard
                  </button>
                  <button
                    onClick={() => window.location.href = '/assessment'}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Take Another Assessment
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard
      title="Sign in to Ace Your Exam"
      description="Please sign in to start your personalized assessment quiz and track your progress."
    >
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {currentQ.difficulty.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">{currentQ.topic}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <LaTeXRenderer text={currentQ.question} />
              </h2>
            </div>

            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                let optionStyle = '';

                if (currentFeedback) {
                  // Show feedback styling
                  const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(currentFeedback.correctAnswer);
                  const isCorrectOption = index === correctAnswerIndex;
                  const isUserAnswer = isSelected;

                  if (isCorrectOption) {
                    // Always highlight correct answer in green
                    optionStyle = 'border-green-500 bg-green-50 text-green-900';
                  } else if (isUserAnswer && !currentFeedback.isCorrect) {
                    // Highlight incorrect user answer in red
                    optionStyle = 'border-red-500 bg-red-50 text-red-900';
                  } else {
                    // Other options remain neutral
                    optionStyle = 'border-gray-200 bg-gray-50 text-gray-500';
                  }
                } else {
                  // Normal styling when no feedback
                  optionStyle = isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700';
                }

                return (
                  <button
                    key={index}
                    onClick={() => !currentFeedback && handleAnswerSelect(index)}
                    disabled={!!currentFeedback || submittingAnswer}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${optionStyle} ${currentFeedback ? 'cursor-default' : 'cursor-pointer'
                      }`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <LaTeXRenderer text={option} />
                      {currentFeedback && (
                        <div className="ml-auto">
                          {index === ['A', 'B', 'C', 'D'].indexOf(currentFeedback.correctAnswer) && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {isSelected && !currentFeedback.isCorrect && index !== ['A', 'B', 'C', 'D'].indexOf(currentFeedback.correctAnswer) && (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {!currentFeedback && (
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={selectedAnswer === null || submittingAnswer}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${selectedAnswer !== null && !submittingAnswer
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {submittingAnswer ? (
                    <>
                      <Loader2 size={16} className="mr-2 inline animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                      <ArrowRight size={16} className="ml-2 inline" />
                    </>
                  )}
                </button>
              </div>
            )}

            {currentFeedback && (
              <div className="text-center py-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${currentFeedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {currentFeedback.isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Correct!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Incorrect
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {currentQuestion === questions.length - 1
                    ? 'Proceeding to results...'
                    : 'Moving to next question...'
                  }
                </p>
              </div>
            )}
          </div>


        </main>
      </div>
    </AuthGuard>
  );
};

export default Assessment;