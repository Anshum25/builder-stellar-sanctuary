import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, BookOpen, GraduationCap, ArrowRight, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STANDARDS, SUBJECTS, DIFFICULTY_LEVELS } from '@shared/types';

const SelectQuiz: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    if (selectedStandard && selectedSubject && selectedDifficulty) {
      // Navigate to quiz with selected parameters
      navigate('/quiz', { 
        state: { 
          standard: selectedStandard, 
          subject: selectedSubject,
          difficulty: selectedDifficulty
        } 
      });
    }
  };

  const getSubjectIcon = (subject: string) => {
    const icons: { [key: string]: string } = {
      'Mathematics': '🔢',
      'Science': '🔬',
      'English': '📚',
      'History': '🏛️',
      'Geography': '🌍',
      'Physics': '⚡',
      'Chemistry': '🧪',
      'Biology': '🧬'
    };
    return icons[subject] || '📖';
  };

  const getStandardLevel = (standard: string) => {
    const level = parseInt(standard.replace('Grade ', ''));
    if (level <= 8) return { color: 'bg-green-100 text-green-800', label: 'Elementary' };
    if (level <= 10) return { color: 'bg-blue-100 text-blue-800', label: 'Middle School' };
    return { color: 'bg-purple-100 text-purple-800', label: 'High School' };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'Basic concepts and fundamental understanding';
      case 'Medium': return 'Intermediate concepts with some complexity';
      case 'Hard': return 'Advanced concepts and challenging problems';
      default: return '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          Select Your Quiz
        </h1>
        <p className="text-gray-600">Choose your grade level, subject, and difficulty to get started</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Standard Selection */}
        <Card className="border-2 border-gray-200 hover:border-indigo-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              Select Your Grade
            </CardTitle>
            <CardDescription>
              Choose the appropriate grade level for your quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedStandard} onValueChange={setSelectedStandard}>
              <SelectTrigger className="h-12 text-left">
                <SelectValue placeholder="Choose your grade level" />
              </SelectTrigger>
              <SelectContent>
                {STANDARDS.map((standard) => {
                  const levelInfo = getStandardLevel(standard);
                  return (
                    <SelectItem key={standard} value={standard}>
                      <div className="flex items-center justify-between w-full">
                        <span>{standard}</span>
                        <Badge className={`ml-2 ${levelInfo.color}`}>
                          {levelInfo.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {selectedStandard && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-700">
                  <strong>Selected:</strong> {selectedStandard}
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  {getStandardLevel(selectedStandard).label} level content
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subject Selection */}
        <Card className="border-2 border-gray-200 hover:border-purple-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Select Subject
            </CardTitle>
            <CardDescription>
              Pick the subject you want to be quizzed on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="h-12 text-left">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    <div className="flex items-center gap-2">
                      <span>{getSubjectIcon(subject)}</span>
                      <span>{subject}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedSubject && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">
                  <strong>Selected:</strong> {selectedSubject} {getSubjectIcon(selectedSubject)}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  AI-generated questions tailored to your level
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Difficulty Selection */}
        <Card className="border-2 border-gray-200 hover:border-orange-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Select Difficulty
            </CardTitle>
            <CardDescription>
              Choose your challenge level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="h-12 text-left">
                <SelectValue placeholder="Choose difficulty level" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(difficulty)}>
                        {difficulty}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedDifficulty && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-700">
                  <strong>Selected:</strong> {selectedDifficulty}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {getDifficultyDescription(selectedDifficulty)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quiz Preview */}
      {selectedStandard && selectedSubject && selectedDifficulty && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="text-center">
              <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Start!
              </h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary">{selectedStandard}</Badge>
                <Badge variant="secondary">{selectedSubject}</Badge>
                <Badge className={getDifficultyColor(selectedDifficulty)}>
                  {selectedDifficulty}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">
                You'll get 5 multiple-choice questions about <strong>{selectedSubject}</strong> at <strong>{selectedStandard}</strong> level with <strong>{selectedDifficulty.toLowerCase()}</strong> difficulty
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <span>📊</span>
                  <span>Instant feedback</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🎯</span>
                  <span>Detailed explanations</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>~5 minutes</span>
                </div>
              </div>
              <Button 
                onClick={handleStartQuiz}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4"
              >
                Start Quiz
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Difficulty Guide 💡</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Badge className="bg-green-100 text-green-800 mt-1">Easy</Badge>
              <div>
                <p className="font-medium">Foundation Level</p>
                <p className="text-gray-600">Basic concepts and straightforward questions</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 mt-1">Medium</Badge>
              <div>
                <p className="font-medium">Intermediate Level</p>
                <p className="text-gray-600">Applied knowledge and moderate complexity</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="bg-red-100 text-red-800 mt-1">Hard</Badge>
              <div>
                <p className="font-medium">Advanced Level</p>
                <p className="text-gray-600">Complex problems and critical thinking</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectQuiz;
