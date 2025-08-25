import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  CheckCircle, 
  XCircle, 
  Target,
  Calendar,
  Book,
  GraduationCap
} from 'lucide-react';
import { QuizResult } from '@shared/types';

const Results: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      loadResult(resultId);
    }
  }, [resultId]);

  const loadResult = async (id: string) => {
    setLoading(true);
    try {
      // For now, load from localStorage (replace with API call)
      const stored = localStorage.getItem(`quiz_result_${id}`);
      if (stored) {
        setResult(JSON.parse(stored));
      } else {
        // In a real app, fetch from database
        console.error('Result not found');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading result:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! You're a quiz master! 🌟";
    if (percentage >= 80) return "Great job! You really know your stuff! 🎉";
    if (percentage >= 70) return "Good work! Keep practicing to improve! 👍";
    if (percentage >= 60) return "Not bad! A bit more study and you'll ace it! 📚";
    return "Keep learning! Practice makes perfect! 💪";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Not Found</h2>
        <p className="text-gray-600 mb-4">The quiz results you're looking for could not be found.</p>
        <Button onClick={() => navigate('/dashboard')}>
          <Home className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.total) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Results Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
        <p className="text-gray-600">{getPerformanceMessage(percentage)}</p>
      </div>

      {/* Score Overview */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(percentage)}`}>
              {result.score}/{result.total}
            </div>
            <div className="space-y-4">
              <Progress value={percentage} className="h-4" />
              <Badge className={`text-lg px-4 py-2 ${getScoreBadgeColor(percentage)}`}>
                {percentage}% Score
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Details */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <GraduationCap className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Grade Level</h3>
            <p className="text-gray-600">{result.standard}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Book className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Subject</h3>
            <p className="text-gray-600">{result.subject}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Difficulty</h3>
            <p className={`font-medium ${
              result.difficulty === 'Easy' ? 'text-green-600' :
              result.difficulty === 'Medium' ? 'text-yellow-600' :
              'text-red-600'
            }`}>{result.difficulty}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Date</h3>
            <p className="text-gray-600">
              {new Date(result.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Question Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Question Breakdown
          </CardTitle>
          <CardDescription>
            Review your answers and see how you performed on each question
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.submissions.map((submission, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {submission.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span className="font-medium">
                    Question {submission.questionIndex + 1}
                  </span>
                </div>
                <Badge 
                  className={submission.isCorrect 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }
                >
                  {submission.isCorrect ? 'Correct' : 'Incorrect'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={() => navigate('/select-quiz')}
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Take Another Quiz
        </Button>
        
        <Button 
          onClick={() => navigate('/dashboard')}
          variant="outline"
          size="lg"
          className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Keep Learning! 🚀</h3>
          <p className="text-gray-600">
            {percentage >= 80 
              ? "You're doing great! Try quizzes in other subjects to expand your knowledge."
              : "Learning is a journey. Keep practicing and you'll see improvement with each quiz!"
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
