import { RequestHandler } from "express";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizRequest, QuizResponse, FeedbackRequest, FeedbackResponse } from "@shared/types";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Enhanced question banks with realistic questions and options
const questionBanks = {
  Mathematics: {
    Easy: [
      {
        question: "What is 15 + 27?",
        options: ["42", "41", "43", "40"],
        answer: 0
      },
      {
        question: "If you have 24 cookies and eat 8, how many are left?",
        options: ["16", "18", "14", "15"],
        answer: 0
      },
      {
        question: "What is 8 × 7?",
        options: ["56", "54", "48", "63"],
        answer: 0
      },
      {
        question: "Round 67 to the nearest ten.",
        options: ["70", "60", "80", "65"],
        answer: 0
      },
      {
        question: "What fraction is equivalent to 0.5?",
        options: ["1/2", "1/3", "2/3", "1/4"],
        answer: 0
      }
    ],
    Medium: [
      {
        question: "Solve for x: 3x + 5 = 14",
        options: ["3", "4", "2", "5"],
        answer: 0
      },
      {
        question: "What is 25% of 80?",
        options: ["20", "25", "15", "30"],
        answer: 0
      },
      {
        question: "The area of a rectangle with length 8 and width 5 is:",
        options: ["40 square units", "26 square units", "13 square units", "45 square units"],
        answer: 0
      },
      {
        question: "If a car travels 120 miles in 2 hours, what is its average speed?",
        options: ["60 mph", "50 mph", "70 mph", "80 mph"],
        answer: 0
      },
      {
        question: "What is the prime factorization of 18?",
        options: ["2 × 3²", "3 × 6", "2² × 3", "2 × 9"],
        answer: 0
      }
    ],
    Hard: [
      {
        question: "Find the derivative of f(x) = 3x² + 2x - 1",
        options: ["6x + 2", "3x + 2", "6x² + 2x", "6x - 1"],
        answer: 0
      },
      {
        question: "Solve the system: 2x + 3y = 12, x - y = 1",
        options: ["x = 3, y = 2", "x = 2, y = 3", "x = 1, y = 4", "x = 4, y = 1"],
        answer: 0
      },
      {
        question: "What is the probability of getting exactly 2 heads in 4 coin flips?",
        options: ["3/8", "1/4", "1/2", "2/3"],
        answer: 0
      },
      {
        question: "Find the limit of (x² - 4)/(x - 2) as x approaches 2",
        options: ["4", "2", "0", "undefined"],
        answer: 0
      },
      {
        question: "In a right triangle, if one angle is 30°, what is the other acute angle?",
        options: ["60°", "45°", "90°", "120°"],
        answer: 0
      }
    ]
  },
  Science: {
    Easy: [
      {
        question: "What gas do plants absorb during photosynthesis?",
        options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
        answer: 0
      },
      {
        question: "How many legs does a spider have?",
        options: ["8", "6", "10", "4"],
        answer: 0
      },
      {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        answer: 0
      },
      {
        question: "Which planet is closest to the Sun?",
        options: ["Mercury", "Venus", "Earth", "Mars"],
        answer: 0
      },
      {
        question: "What happens to the speed of sound in warmer air?",
        options: ["It increases", "It decreases", "It stays the same", "It becomes silent"],
        answer: 0
      }
    ],
    Medium: [
      {
        question: "What is the function of mitochondria in cells?",
        options: ["Produce energy (ATP)", "Store genetic material", "Make proteins", "Control cell division"],
        answer: 0
      },
      {
        question: "Which element has the atomic number 6?",
        options: ["Carbon", "Oxygen", "Nitrogen", "Hydrogen"],
        answer: 0
      },
      {
        question: "What happens to the speed of sound in warmer air?",
        options: ["It increases", "It decreases", "It stays the same", "It becomes unpredictable"],
        answer: 0
      },
      {
        question: "How do vaccines work to prevent disease?",
        options: ["Train immune system to recognize pathogens", "Kill all bacteria in the body", "Provide immediate cure", "Block all viruses permanently"],
        answer: 0
      },
      {
        question: "What is the pH of a neutral solution?",
        options: ["7", "0", "14", "1"],
        answer: 0
      }
    ],
    Hard: [
      {
        question: "Which process describes DNA replication?",
        options: ["Semi-conservative replication with helicase and polymerase", "Conservative replication with ligase only", "Dispersive replication with transcriptase", "Random replication with ribosomes"],
        answer: 0
      },
      {
        question: "How does quantum tunneling affect chemical reactions?",
        options: ["Allows particles to pass through energy barriers", "Prevents all chemical bonding", "Only works at absolute zero", "Creates perpetual motion"],
        answer: 0
      },
      {
        question: "What does the second law of thermodynamics state?",
        options: ["Entropy of isolated systems always increases", "Energy cannot be created or destroyed", "All reactions are reversible", "Heat flows from cold to hot"],
        answer: 0
      },
      {
        question: "In natural selection, what determines evolutionary fitness?",
        options: ["Reproductive success in environment", "Physical strength only", "Longest lifespan", "Largest body size"],
        answer: 0
      },
      {
        question: "How do catalysts affect chemical reaction rates?",
        options: ["Lower activation energy without being consumed", "Increase activation energy", "Get permanently changed", "Only work once"],
        answer: 0
      }
    ]
  },
  English: {
    Easy: [
      {
        question: "What is a noun?",
        options: ["A person, place, or thing", "An action word", "A describing word", "A connecting word"],
        answer: 0
      },
      {
        question: "Which word rhymes with 'cat'?",
        options: ["hat", "dog", "bird", "fish"],
        answer: 0
      },
      {
        question: "What is the plural of 'child'?",
        options: ["children", "childs", "childes", "child"],
        answer: 0
      },
      {
        question: "What does the prefix 'un-' mean?",
        options: ["not", "very", "again", "before"],
        answer: 0
      },
      {
        question: "Which is a complete sentence?",
        options: ["The dog ran quickly.", "Running quickly", "The quick dog", "Ran quickly"],
        answer: 0
      }
    ],
    Medium: [
      {
        question: "What literary device is used in 'The wind whispered through the trees'?",
        options: ["Personification", "Metaphor", "Simile", "Alliteration"],
        answer: 0
      },
      {
        question: "What is the main theme in Romeo and Juliet?",
        options: ["Love conquers all obstacles", "War is terrible", "Money brings happiness", "Education is important"],
        answer: 0
      },
      {
        question: "What is the difference between 'affect' and 'effect'?",
        options: ["Affect is a verb, effect is a noun", "They mean the same thing", "Affect is a noun, effect is a verb", "Only effect is correct"],
        answer: 0
      },
      {
        question: "Which point of view uses 'I' and 'me' pronouns?",
        options: ["First person", "Second person", "Third person", "Omniscient"],
        answer: 0
      },
      {
        question: "What is an example of alliteration?",
        options: ["Peter Piper picked", "He ran fast", "The sun is bright", "Time flies quickly"],
        answer: 0
      }
    ],
    Hard: [
      {
        question: "What does the green light symbolize in The Great Gatsby?",
        options: ["Hope and the American Dream", "Money and greed", "Nature and peace", "Danger and warning"],
        answer: 0
      },
      {
        question: "How does stream of consciousness affect narrative?",
        options: ["Reveals inner thoughts and feelings", "Makes plot more linear", "Simplifies character development", "Removes all dialogue"],
        answer: 0
      },
      {
        question: "What theme connects Hamlet and Waiting for Godot?",
        options: ["Existential uncertainty and meaning", "Love and romance", "War and peace", "Wealth and poverty"],
        answer: 0
      },
      {
        question: "What effect does enjambment create in poetry?",
        options: ["Flows thoughts across line breaks", "Stops all rhythm", "Makes rhymes perfect", "Shortens every line"],
        answer: 0
      },
      {
        question: "What makes a narrator unreliable?",
        options: ["Limited or biased perspective", "Perfect memory", "Complete honesty", "All-knowing ability"],
        answer: 0
      }
    ]
  },
  History: {
    Easy: [
      {
        question: "Who was the first President of the United States?",
        options: ["George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"],
        answer: 0
      },
      {
        question: "In which year did World War II end?",
        options: ["1945", "1944", "1946", "1943"],
        answer: 0
      },
      {
        question: "Which ancient wonder was located in Egypt?",
        options: ["Great Pyramid of Giza", "Hanging Gardens", "Colossus of Rhodes", "Lighthouse of Alexandria"],
        answer: 0
      },
      {
        question: "Which country gifted the Statue of Liberty to the United States?",
        options: ["France", "England", "Spain", "Italy"],
        answer: 0
      },
      {
        question: "Who painted the ceiling of the Sistine Chapel?",
        options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
        answer: 0
      }
    ],
    Medium: [
      {
        question: "What was a main cause of the American Civil War?",
        options: ["Disagreement over slavery", "Taxes on tea", "Religious freedom", "Territorial expansion only"],
        answer: 0
      },
      {
        question: "How did the Industrial Revolution change society?",
        options: ["Created urban factory jobs", "Eliminated all farming", "Stopped all trade", "Made everything worse"],
        answer: 0
      },
      {
        question: "What was the significance of the Magna Carta?",
        options: ["Limited the king's power", "Started democracy everywhere", "Ended all wars", "Created modern laws"],
        answer: 0
      },
      {
        question: "What contributed to the fall of the Roman Empire?",
        options: ["Political instability and invasions", "Too much democracy", "Lack of roads", "No military"],
        answer: 0
      },
      {
        question: "What were effects of the Black Death on Europe?",
        options: ["Labor shortages and social change", "Population growth", "More trade", "Stronger feudalism"],
        answer: 0
      }
    ],
    Hard: [
      {
        question: "How did the Treaty of Versailles contribute to future conflict?",
        options: ["Created resentment and economic hardship in Germany", "Brought lasting peace to Europe", "United all European nations", "Eliminated all military forces"],
        answer: 0
      },
      {
        question: "How did imperialism contribute to World War I?",
        options: ["Created competition and tensions between nations", "Prevented all conflicts", "United world powers", "Ended colonial systems"],
        answer: 0
      },
      {
        question: "How were the Russian and Chinese revolutions similar?",
        options: ["Both overthrew monarchies for communist systems", "Both created democracies", "Both failed completely", "Both restored old systems"],
        answer: 0
      },
      {
        question: "What economic factors led to the Weimar Republic's fall?",
        options: ["Hyperinflation and economic depression", "Too much prosperity", "Stable currency", "Full employment"],
        answer: 0
      },
      {
        question: "How did the Columbian Exchange transform demographics?",
        options: ["Disease decimated Native populations", "Populations remained unchanged", "Only Europe was affected", "No demographic changes occurred"],
        answer: 0
      }
    ]
  }
};

const generateRandomQuestion = (subject: string, difficulty: string): any => {
  const subjectBank = questionBanks[subject as keyof typeof questionBanks];
  if (!subjectBank) return null;
  
  const difficultyBank = subjectBank[difficulty as keyof typeof subjectBank];
  if (!difficultyBank || difficultyBank.length === 0) return null;
  
  // Select a random question from the bank
  const randomIndex = Math.floor(Math.random() * difficultyBank.length);
  const selectedQuestion = difficultyBank[randomIndex];
  
  return {
    ...selectedQuestion,
    difficulty
  };
};

export const generateQuiz: RequestHandler = async (req, res) => {
  try {
    const { standard, subject, difficulty, questionCount = 5 } = req.body as QuizRequest;

    if (!standard || !subject || !difficulty) {
      return res.status(400).json({ error: 'Standard, subject, and difficulty are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Enhanced prompt for Gemini API with better option generation
    const prompt = `Generate ${questionCount} multiple-choice questions for ${standard} students studying ${subject} at ${difficulty} difficulty level.

Requirements:
- Questions appropriate for ${standard} level students
- Difficulty: ${difficulty} (Easy = basic concepts, Medium = applied knowledge, Hard = advanced analysis)
- Subject: ${subject}
- Each question must have exactly 4 realistic, plausible options
- One correct answer and three believable distractors
- Make questions educational, engaging, and test real understanding
- Vary question types (definitions, applications, analysis, problem-solving)
- Options should be clearly different and not confusing
- Avoid obvious wrong answers like "All of the above" unless appropriate

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "Clear, specific question text",
    "options": ["Realistic option A", "Realistic option B", "Realistic option C", "Realistic option D"],
    "answer": 0,
    "difficulty": "${difficulty}"
  }
]

Where "answer" is the index (0-3) of the correct option.
Ensure all options are believable and educational.
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

      console.log('Successfully generated questions from Gemini API');

      const quizResponse: QuizResponse = {
        questions
      };

      res.json(quizResponse);
    } catch (apiError) {
      console.error('Gemini API Error:', apiError);
      
      // Enhanced fallback with realistic questions from question bank
      const fallbackQuestions = [];
      for (let i = 0; i < questionCount; i++) {
        const randomQ = generateRandomQuestion(subject, difficulty);
        if (randomQ) {
          fallbackQuestions.push(randomQ);
        }
      }

      // If we don't have enough questions in the bank, generate some dynamically
      while (fallbackQuestions.length < questionCount) {
        const genericQuestion = {
          question: `Which concept is most important in ${subject} for ${standard} students at ${difficulty} level?`,
          options: [
            `Core ${subject.toLowerCase()} principles`,
            `Advanced theoretical concepts`,
            `Basic memorization only`,
            `Practical applications only`
          ],
          answer: difficulty === 'Easy' ? 2 : difficulty === 'Hard' ? 1 : 0,
          difficulty
        };
        fallbackQuestions.push(genericQuestion);
      }

      console.log(`Using ${fallbackQuestions.length} fallback questions for ${subject} - ${difficulty}`);

      const fallbackResponse: QuizResponse = {
        questions: fallbackQuestions.slice(0, questionCount)
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
    const { question, userAnswer, correctAnswer, standard, subject, difficulty } = req.body as FeedbackRequest;

    if (!question || !userAnswer || !correctAnswer) {
      return res.status(400).json({ error: 'Question, user answer, and correct answer are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const isCorrect = userAnswer === correctAnswer;

    // Enhanced prompt for Gemini API
    const prompt = `Provide friendly, educational feedback for a ${standard} student studying ${subject} at ${difficulty} difficulty level.

Question: ${question}
Student's answer: ${userAnswer}
Correct answer: ${correctAnswer}
Was the student correct? ${isCorrect ? 'Yes' : 'No'}
Difficulty level: ${difficulty}

Instructions:
- Use age-appropriate language for ${standard} students
- If correct: provide encouraging feedback and explain why the answer is right, plus additional educational context
- If incorrect: explain the concept gently, why the correct answer is right, and provide a helpful learning tip
- Adjust explanation complexity based on ${difficulty} difficulty level
- Keep it 2-3 sentences maximum but educational and encouraging
- Use a supportive, motivating tone that builds confidence
- Include relevant emoji if appropriate
- Focus on learning and understanding, not just correctness
- Provide a specific learning tip related to the topic

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
      
      // Enhanced fallback feedback based on difficulty and subject
      let feedback: string;
      if (isCorrect) {
        const encouragements = {
          Easy: 'Perfect! You got it right! 🎉',
          Medium: 'Great job applying your knowledge! 🎯',
          Hard: 'Excellent analytical thinking! 🧠'
        };
        const encouragement = encouragements[difficulty as keyof typeof encouragements] || 'Well done! ✨';
        feedback = `${encouragement} You chose "${correctAnswer}" which is absolutely correct. This shows you understand this important ${subject.toLowerCase()} concept. Keep up the excellent work!`;
      } else {
        const supportiveMessages = {
          Easy: 'Good try! This is a fundamental concept that takes practice to master.',
          Medium: 'Nice attempt! This concept builds on basic knowledge and requires careful thinking.',
          Hard: 'Great effort! This is a challenging concept that even advanced students find tricky.'
        };
        const support = supportiveMessages[difficulty as keyof typeof supportiveMessages] || 'Good attempt!';
        feedback = `${support} The correct answer is "${correctAnswer}". ${difficulty === 'Hard' ? 'This advanced concept' : 'This important topic'} is key to understanding ${subject.toLowerCase()}. Keep practicing - you're learning! 📚`;
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
