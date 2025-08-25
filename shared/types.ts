export interface MCQuestion {
  question: string;
  options: string[];
  answer: number; // index of correct option
  explanation?: string;
}

export interface QuizRequest {
  standard: string;
  subject: string;
  questionCount?: number;
}

export interface QuizResponse {
  questions: MCQuestion[];
}

export interface QuizSubmission {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface QuizResult {
  id: string;
  userId: string;
  standard: string;
  subject: string;
  score: number;
  total: number;
  date: string;
  submissions: QuizSubmission[];
}

export interface FeedbackRequest {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  standard: string;
  subject: string;
}

export interface FeedbackResponse {
  feedback: string;
}

export const STANDARDS = [
  'Grade 6',
  'Grade 7', 
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12'
];

export const SUBJECTS = [
  'Mathematics',
  'Science', 
  'English',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology'
];
