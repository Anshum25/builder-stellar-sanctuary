import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Trophy, Clock, Target, Play, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - replace with real data from backend
  const mockStats = {
    totalQuizzes: 12,
    averageScore: 78,
    bestScore: 95,
    totalQuestions: 180
  };

  const mockRecentQuizzes = [
    {
      id: '1',
      standard: 'Grade 10',
      subject: 'Mathematics',
      difficulty: 'Medium',
      score: 8,
      total: 10,
      date: '2024-01-15',
      percentage: 80
    },
    {
      id: '2',
      standard: 'Grade 10',
      subject: 'Science',
      difficulty: 'Hard',
      score: 9,
      total: 10,
      date: '2024-01-14',
      percentage: 90
    },
    {
      id: '3',
      standard: 'Grade 9',
      subject: 'History',
      difficulty: 'Easy',
      score: 7,
      total: 10,
      date: '2024-01-13',
      percentage: 70
    }
  ];

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.displayName || user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-gray-600">Ready to challenge your mind with some quizzes?</p>
      </div>

      {/* Quick Action */}
      <div className="flex justify-center">
        <Button 
          onClick={() => navigate('/select-quiz')}
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Start New Quiz
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-blue-900">{mockStats.totalQuizzes}</p>
              </div>
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Average Score</p>
                <p className="text-2xl font-bold text-green-900">{mockStats.averageScore}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Best Score</p>
                <p className="text-2xl font-bold text-yellow-900">{mockStats.bestScore}%</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Questions Answered</p>
                <p className="text-2xl font-bold text-purple-900">{mockStats.totalQuestions}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Quiz Results
          </CardTitle>
          <CardDescription>
            Your latest quiz performances and scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockRecentQuizzes.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No quiz results yet</p>
              <Button 
                onClick={() => navigate('/select-quiz')}
                variant="outline"
                className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
              >
                Take Your First Quiz
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {mockRecentQuizzes.map((quiz) => (
                <div 
                  key={quiz.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{quiz.subject}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {quiz.standard}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(quiz.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getScoreColor(quiz.percentage)}>
                      {quiz.score}/{quiz.total} ({quiz.percentage}%)
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
