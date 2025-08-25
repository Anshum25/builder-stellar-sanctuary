import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, BookOpen, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STANDARDS, SUBJECTS } from '@shared/types';

const SelectQuiz: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    if (selectedStandard && selectedSubject) {
      // Navigate to quiz with selected parameters
      navigate('/quiz', { 
        state: { 
          standard: selectedStandard, 
          subject: selectedSubject 
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          Select Your Quiz
        </h1>
        <p className="text-gray-600">Choose your grade level and subject to get started</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
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
      </div>

      {/* Quiz Preview */}
      {selectedStandard && selectedSubject && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="text-center">
              <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Start!
              </h3>
              <p className="text-gray-600 mb-4">
                You'll get 5 multiple-choice questions about <strong>{selectedSubject}</strong> at <strong>{selectedStandard}</strong> level
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
          <CardTitle className="text-lg">Quiz Tips 💡</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <p className="font-medium">Read Carefully</p>
                <p className="text-gray-600">Take your time to understand each question</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">💡</span>
              <div>
                <p className="font-medium">Learn from Feedback</p>
                <p className="text-gray-600">AI explanations help you understand concepts</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600">🎯</span>
              <div>
                <p className="font-medium">Practice Regularly</p>
                <p className="text-gray-600">Regular quizzes improve knowledge retention</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectQuiz;
