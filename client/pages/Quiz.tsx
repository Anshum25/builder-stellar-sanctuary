import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle, XCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { MCQuestion, QuizSubmission } from '@shared/types';

interface QuizState {
  standard: string;
  subject: string;
  difficulty: string;
}

const Quiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quizState] = useState<QuizState>(location.state as QuizState);
  const [questions, setQuestions] = useState<MCQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [error, setError] = useState<string>('');

  // Redirect if no quiz state
  useEffect(() => {
    if (!quizState?.standard || !quizState?.subject || !quizState?.difficulty) {
      navigate('/select-quiz');
      return;
    }
  }, [quizState, navigate]);

  // Load questions on mount
  useEffect(() => {
    if (quizState?.standard && quizState?.subject && quizState?.difficulty) {
      loadQuestions();
    }
  }, [quizState]);

  const loadQuestions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          standard: quizState.standard,
          subject: quizState.subject,
          difficulty: quizState.difficulty,
          questionCount: 5
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to load questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
      console.error('Error loading questions:', err);
      
      // Fallback to mock questions for development
      setQuestions([
        {
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          answer: 1,
        },
        {
          question: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          answer: 2,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;

    setIsAnswered(true);
    setLoadingFeedback(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    const submission: QuizSubmission = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      isCorrect
    };

    setSubmissions(prev => [...prev, submission]);

    // Get AI feedback
    try {
      const response = await fetch('/api/quiz/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          userAnswer: currentQuestion.options[selectedAnswer],
          correctAnswer: currentQuestion.options[currentQuestion.answer],
          standard: quizState.standard,
          subject: quizState.subject
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback);
      } else {
        // Fallback feedback
        setFeedback(isCorrect 
          ? "Great job! You got it right! 🎉" 
          : `That's not quite right. The correct answer is: ${currentQuestion.options[currentQuestion.answer]}`
        );
      }
    } catch (err) {
      // Fallback feedback
      setFeedback(isCorrect 
        ? "Great job! You got it right! 🎉" 
        : `That's not quite right. The correct answer is: ${currentQuestion.options[currentQuestion.answer]}`
      );
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFeedback('');
    } else {
      // Quiz finished, navigate to results
      const score = submissions.reduce((acc, sub) => acc + (sub.isCorrect ? 1 : 0), 0);
      const resultId = `result_${Date.now()}`;
      
      // In a real app, save to database here
      const quizResult = {
        id: resultId,
        userId: user?.uid || '',
        standard: quizState.standard,
        subject: quizState.subject,
        score,
        total: questions.length,
        date: new Date().toISOString(),
        submissions
      };
      
      // Store in localStorage for now (replace with API call)
      localStorage.setItem(`quiz_result_${resultId}`, JSON.stringify(quizResult));
      
      navigate(`/results/${resultId}`);
    }
  };

  if (!quizState?.standard || !quizState?.subject) {
    return null;
  }

  if (loading) {
    return <LoadingSpinner text="Loading your quiz questions..." />;
  }

  if (error && questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => navigate('/select-quiz')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quiz Selection
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-indigo-600" />
          <Badge variant="secondary">{quizState.standard}</Badge>
          <Badge variant="secondary">{quizState.subject}</Badge>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-600 text-center">
          {Math.round(progress)}% Complete
        </p>
      </div>

      {/* Question Card */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let buttonClasses = "w-full text-left p-4 rounded-lg border-2 transition-all hover:border-indigo-300";
            
            if (isAnswered) {
              if (index === currentQuestion.answer) {
                buttonClasses += " bg-green-50 border-green-500 text-green-800";
              } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.answer) {
                buttonClasses += " bg-red-50 border-red-500 text-red-800";
              } else {
                buttonClasses += " bg-gray-50 border-gray-300 text-gray-600";
              }
            } else {
              if (selectedAnswer === index) {
                buttonClasses += " bg-indigo-50 border-indigo-500 text-indigo-800";
              } else {
                buttonClasses += " border-gray-300 hover:bg-indigo-50";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={buttonClasses}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{option}</span>
                  {isAnswered && index === currentQuestion.answer && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {isAnswered && index === selectedAnswer && selectedAnswer !== currentQuestion.answer && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Submit Button */}
      {!isAnswered && (
        <div className="text-center">
          <Button 
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            Submit Answer
          </Button>
        </div>
      )}

      {/* Feedback */}
      {isAnswered && (
        <Card className={`border-2 ${submissions[submissions.length - 1]?.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="p-6">
            {loadingFeedback ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
                <span>Getting AI feedback...</span>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-4">
                  {submissions[submissions.length - 1]?.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 mt-1" />
                  )}
                  <div>
                    <h3 className="font-semibold mb-2">
                      {submissions[submissions.length - 1]?.isCorrect ? 'Correct!' : 'Not quite right'}
                    </h3>
                    <p className="text-gray-700">{feedback}</p>
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    onClick={handleNextQuestion}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    {isLastQuestion ? 'View Results' : 'Next Question'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quiz;
