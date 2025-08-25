import { RequestHandler } from "express";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizRequest, QuizResponse, FeedbackRequest, FeedbackResponse } from "@shared/types";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export const generateQuiz: RequestHandler = async (req, res) => {
  try {
    const { standard, subject, questionCount = 5 } = req.body as QuizRequest;

    if (!standard || !subject) {
      return res.status(400).json({ error: 'Standard and subject are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Create prompt for Gemini API
    const prompt = `Generate ${questionCount} multiple-choice questions for ${standard} in ${subject}.
Each question should have 4 options and one correct answer.
Make the questions appropriate for the grade level and educational.
Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": 0
  }
]

Where "answer" is the index (0-3) of the correct option.
Do not include any other text, explanations, or formatting - just the JSON array.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text();
      
      // Clean up the response to extract just the JSON
      responseText = responseText.trim();
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (responseText.startsWith('```')) {
        responseText = responseText.replace(/```\s*/, '').replace(/```\s*$/, '');
      }
      
      const questions = JSON.parse(responseText);
      
      // Validate the response structure
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid response format from Gemini API');
      }

      // Validate each question
      for (const q of questions) {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.answer !== 'number') {
          throw new Error('Invalid question format from Gemini API');
        }
      }

      const quizResponse: QuizResponse = {
        questions
      };

      res.json(quizResponse);
    } catch (apiError) {
      console.error('Gemini API Error:', apiError);
      
      // Fallback to mock questions if Gemini API fails
      const mockQuestions = [
        {
          question: `What is a key concept in ${subject} at ${standard} level?`,
          options: [
            "Basic understanding",
            "Advanced comprehension", 
            "Expert knowledge",
            "Professional mastery"
          ],
          answer: 1
        },
        {
          question: `Which of the following best describes ${subject} principles?`,
          options: [
            "Simple rules",
            "Complex theories",
            "Practical applications", 
            "All of the above"
          ],
          answer: 3
        },
        {
          question: `In ${subject}, what is the most important skill for ${standard} students?`,
          options: [
            "Memorization",
            "Critical thinking",
            "Speed",
            "Creativity"
          ],
          answer: 1
        },
        {
          question: `How does ${subject} connect to real-world applications?`,
          options: [
            "It doesn't",
            "Through practical examples",
            "Only in theory",
            "Sometimes"
          ],
          answer: 1
        },
        {
          question: `What study method works best for ${subject} at ${standard} level?`,
          options: [
            "Reading only",
            "Practice problems",
            "Group discussions",
            "All methods combined"
          ],
          answer: 3
        }
      ];

      const selectedQuestions = mockQuestions.slice(0, questionCount);
      const fallbackResponse: QuizResponse = {
        questions: selectedQuestions
      };

      res.json(fallbackResponse);
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz questions' });
  }
};

export const generateFeedback: RequestHandler = async (req, res) => {
  try {
    const { question, userAnswer, correctAnswer, standard, subject } = req.body as FeedbackRequest;

    if (!question || !userAnswer || !correctAnswer) {
      return res.status(400).json({ error: 'Question, user answer, and correct answer are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const isCorrect = userAnswer === correctAnswer;

    // Create prompt for Gemini API
    const prompt = `Provide friendly, educational feedback for a ${standard} student studying ${subject}.

Question: ${question}
Student's answer: ${userAnswer}
Correct answer: ${correctAnswer}
Was the student correct? ${isCorrect ? 'Yes' : 'No'}

Instructions:
- If the student was correct, provide encouraging feedback and additional educational context
- If incorrect, explain why the correct answer is right in a helpful, non-judgmental way
- Keep it concise (2-3 sentences maximum) but educational
- Use a friendly, encouraging tone appropriate for the grade level
- Include an emoji if appropriate
- Focus on learning, not just right/wrong

Return only the feedback text, no additional formatting or labels.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const feedback = response.text().trim();

      const feedbackResponse: FeedbackResponse = {
        feedback
      };

      res.json(feedbackResponse);
    } catch (apiError) {
      console.error('Gemini API Error for feedback:', apiError);
      
      // Fallback feedback
      let feedback: string;
      if (isCorrect) {
        feedback = `Excellent work! 🎉 You chose "${correctAnswer}" which is absolutely correct. This shows you have a solid understanding of the concept. Keep up the great work in your ${subject} studies!`;
      } else {
        feedback = `Good attempt! While "${userAnswer}" isn't quite right, you're thinking in the right direction. The correct answer is "${correctAnswer}". This is an important concept in ${subject} at the ${standard} level. Don't worry - learning from mistakes is how we grow! 📚`;
      }

      const fallbackResponse: FeedbackResponse = {
        feedback
      };

      res.json(fallbackResponse);
    }
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
};
