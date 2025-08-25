import { RequestHandler } from "express";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizRequest, QuizResponse, FeedbackRequest, FeedbackResponse } from "@shared/types";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Enhanced question banks for dynamic generation
const questionBanks = {
  Mathematics: {
    Easy: [
      { template: "What is {a} + {b}?", type: "arithmetic" },
      { template: "If you have {a} apples and give away {b}, how many do you have left?", type: "word_problem" },
      { template: "What is {a} × {b}?", type: "multiplication" },
      { template: "Which number is larger: {a} or {b}?", type: "comparison" },
      { template: "Round {a} to the nearest ten.", type: "rounding" }
    ],
    Medium: [
      { template: "Solve for x: {a}x + {b} = {c}", type: "algebra" },
      { template: "What is {a}% of {b}?", type: "percentage" },
      { template: "The area of a rectangle with length {a} and width {b} is:", type: "geometry" },
      { template: "If a car travels {a} miles in {b} hours, what is its speed?", type: "rate" },
      { template: "What is the prime factorization of {a}?", type: "number_theory" }
    ],
    Hard: [
      { template: "Find the derivative of f(x) = {a}x² + {b}x + {c}", type: "calculus" },
      { template: "Solve the system: {a}x + {b}y = {c}, {d}x + {e}y = {f}", type: "system_equations" },
      { template: "What is the probability of getting exactly {a} heads in {b} coin flips?", type: "probability" },
      { template: "Find the limit of ({a}x² + {b}) / ({c}x² + {d}) as x approaches infinity", type: "limits" },
      { template: "Prove that the sum of angles in a triangle is 180°", type: "proof" }
    ]
  },
  Science: {
    Easy: [
      { template: "What gas do plants absorb during photosynthesis?", type: "biology" },
      { template: "How many legs does a spider have?", type: "biology" },
      { template: "What is the chemical symbol for water?", type: "chemistry" },
      { template: "Which planet is closest to the Sun?", type: "astronomy" },
      { template: "What force pulls objects toward Earth?", type: "physics" }
    ],
    Medium: [
      { template: "What is the function of mitochondria in cells?", type: "biology" },
      { template: "Which element has the atomic number {a}?", type: "chemistry" },
      { template: "What happens to the speed of sound in warmer air?", type: "physics" },
      { template: "How do vaccines work to prevent disease?", type: "biology" },
      { template: "What is the pH of a neutral solution?", type: "chemistry" }
    ],
    Hard: [
      { template: "Explain the process of DNA replication and its key enzymes", type: "molecular_biology" },
      { template: "How does quantum tunneling affect chemical reactions?", type: "quantum_chemistry" },
      { template: "What is the relationship between entropy and the second law of thermodynamics?", type: "thermodynamics" },
      { template: "Describe the mechanism of natural selection in population genetics", type: "evolution" },
      { template: "How do catalysts affect activation energy in chemical reactions?", type: "kinetics" }
    ]
  },
  English: {
    Easy: [
      { template: "What is a noun?", type: "grammar" },
      { template: "Which word rhymes with 'cat'?", type: "phonics" },
      { template: "What is the plural of 'child'?", type: "grammar" },
      { template: "What does the prefix 'un-' mean?", type: "vocabulary" },
      { template: "Which is a complete sentence?", type: "sentence_structure" }
    ],
    Medium: [
      { template: "What literary device is used in 'The wind whispered through the trees'?", type: "literary_devices" },
      { template: "Identify the main theme in Romeo and Juliet", type: "literature" },
      { template: "What is the difference between 'affect' and 'effect'?", type: "usage" },
      { template: "Which point of view uses 'I' and 'me' pronouns?", type: "narrative" },
      { template: "What is an example of alliteration?", type: "literary_devices" }
    ],
    Hard: [
      { template: "Analyze the use of symbolism in The Great Gatsby", type: "literary_analysis" },
      { template: "How does stream of consciousness affect narrative structure?", type: "literary_technique" },
      { template: "Compare the themes of existentialism in Hamlet and Waiting for Godot", type: "comparative_literature" },
      { template: "What is the effect of enjambment in modern poetry?", type: "poetry_analysis" },
      { template: "How does unreliable narration create ambiguity in The Turn of the Screw?", type: "narrative_analysis" }
    ]
  },
  History: {
    Easy: [
      { template: "Who was the first President of the United States?", type: "american_history" },
      { template: "In which year did World War II end?", type: "world_history" },
      { template: "What ancient wonder was located in Egypt?", type: "ancient_history" },
      { template: "Which country gifted the Statue of Liberty to the United States?", type: "american_history" },
      { template: "Who painted the ceiling of the Sistine Chapel?", type: "renaissance" }
    ],
    Medium: [
      { template: "What were the main causes of the American Civil War?", type: "american_history" },
      { template: "How did the Industrial Revolution change society?", type: "modern_history" },
      { template: "What was the significance of the Magna Carta?", type: "medieval_history" },
      { template: "Why did the Roman Empire fall?", type: "ancient_history" },
      { template: "What were the effects of the Black Death on Europe?", type: "medieval_history" }
    ],
    Hard: [
      { template: "Analyze the long-term consequences of the Treaty of Versailles", type: "diplomatic_history" },
      { template: "How did imperialism contribute to World War I?", type: "geopolitical_analysis" },
      { template: "Compare the Russian and Chinese revolutions of the 20th century", type: "comparative_history" },
      { template: "What role did economic factors play in the fall of the Weimar Republic?", type: "economic_history" },
      { template: "How did the Columbian Exchange transform global demographics?", type: "global_history" }
    ]
  }
};

const generateRandomNumbers = () => ({
  a: Math.floor(Math.random() * 20) + 1,
  b: Math.floor(Math.random() * 20) + 1,
  c: Math.floor(Math.random() * 50) + 1,
  d: Math.floor(Math.random() * 10) + 1,
  e: Math.floor(Math.random() * 10) + 1,
  f: Math.floor(Math.random() * 30) + 1
});

const generateDynamicQuestion = (subject: string, difficulty: string, standard: string): any => {
  const bank = questionBanks[subject as keyof typeof questionBanks]?.[difficulty as keyof typeof questionBanks[keyof typeof questionBanks]];
  if (!bank) return null;

  const template = bank[Math.floor(Math.random() * bank.length)];
  const vars = generateRandomNumbers();
  
  let question = template.template;
  Object.entries(vars).forEach(([key, value]) => {
    question = question.replace(new RegExp(`{${key}}`, 'g'), value.toString());
  });

  // Generate options based on question type and subject
  const options = generateOptionsForQuestion(question, template.type, vars, subject, difficulty);
  
  return {
    question,
    options: options.choices,
    answer: options.correctIndex,
    difficulty
  };
};

const generateOptionsForQuestion = (question: string, type: string, vars: any, subject: string, difficulty: string) => {
  let correctAnswer: string;
  let wrongAnswers: string[] = [];

  // Generate correct answer and distractors based on question type
  switch (type) {
    case "arithmetic":
      if (question.includes("+")) {
        correctAnswer = (vars.a + vars.b).toString();
        wrongAnswers = [
          (vars.a + vars.b + 1).toString(),
          (vars.a + vars.b - 1).toString(),
          (vars.a * vars.b).toString()
        ];
      } else if (question.includes("×")) {
        correctAnswer = (vars.a * vars.b).toString();
        wrongAnswers = [
          (vars.a + vars.b).toString(),
          (vars.a * vars.b + vars.a).toString(),
          (vars.a * vars.b - vars.b).toString()
        ];
      } else {
        correctAnswer = Math.abs(vars.a - vars.b).toString();
        wrongAnswers = [
          (vars.a + vars.b).toString(),
          (vars.a - vars.b + 1).toString(),
          (vars.b - vars.a).toString()
        ];
      }
      break;
    
    case "percentage":
      correctAnswer = ((vars.a / 100) * vars.b).toString();
      wrongAnswers = [
        ((vars.a / 10) * vars.b).toString(),
        (vars.a + vars.b).toString(),
        ((vars.b / 100) * vars.a).toString()
      ];
      break;
      
    case "biology":
    case "chemistry":
    case "physics":
      // Subject-specific answers
      const scienceAnswers = {
        "What gas do plants absorb during photosynthesis?": {
          correct: "Carbon dioxide",
          wrong: ["Oxygen", "Nitrogen", "Hydrogen"]
        },
        "What is the chemical symbol for water?": {
          correct: "H2O",
          wrong: ["CO2", "O2", "NaCl"]
        },
        "Which planet is closest to the Sun?": {
          correct: "Mercury",
          wrong: ["Venus", "Earth", "Mars"]
        }
      };
      
      const match = Object.keys(scienceAnswers).find(q => question.includes(q.split("?")[0]));
      if (match) {
        correctAnswer = scienceAnswers[match as keyof typeof scienceAnswers].correct;
        wrongAnswers = scienceAnswers[match as keyof typeof scienceAnswers].wrong;
      } else {
        correctAnswer = "Correct answer";
        wrongAnswers = ["Option A", "Option B", "Option C"];
      }
      break;
      
    default:
      correctAnswer = "Correct answer";
      wrongAnswers = ["Incorrect option 1", "Incorrect option 2", "Incorrect option 3"];
  }

  // Shuffle options
  const allOptions = [correctAnswer, ...wrongAnswers];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);
  const correctIndex = shuffled.indexOf(correctAnswer);

  return {
    choices: shuffled,
    correctIndex
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

    // Enhanced prompt for Gemini API
    const prompt = `Generate ${questionCount} multiple-choice questions for ${standard} students studying ${subject} at ${difficulty} difficulty level.

Requirements:
- Questions should be appropriate for ${standard} level students
- Difficulty: ${difficulty} (Easy = basic concepts, Medium = applied knowledge, Hard = advanced analysis)
- Subject: ${subject}
- Each question must have exactly 4 options
- Make questions educational and engaging
- Vary question types (definitions, applications, analysis, problem-solving)

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": 0,
    "difficulty": "${difficulty}"
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
      
      // Enhanced fallback with dynamic question generation
      const dynamicQuestions = [];
      for (let i = 0; i < questionCount; i++) {
        const dynamicQ = generateDynamicQuestion(subject, difficulty, standard);
        if (dynamicQ) {
          dynamicQuestions.push(dynamicQ);
        }
      }

      // If dynamic generation fails, use enhanced static questions
      if (dynamicQuestions.length === 0) {
        const staticQuestions = [
          {
            question: `What is a fundamental concept in ${subject} at ${standard} level? (${difficulty} difficulty)`,
            options: [
              "Basic understanding",
              "Advanced comprehension", 
              "Expert knowledge",
              "Professional mastery"
            ],
            answer: difficulty === 'Easy' ? 0 : difficulty === 'Medium' ? 1 : 2,
            difficulty
          },
          {
            question: `Which approach works best for ${difficulty.toLowerCase()} ${subject} problems in ${standard}?`,
            options: [
              "Simple memorization",
              "Step-by-step analysis",
              "Complex reasoning", 
              "Creative thinking"
            ],
            answer: difficulty === 'Easy' ? 0 : difficulty === 'Medium' ? 1 : 2,
            difficulty
          },
          {
            question: `In ${subject}, what should ${standard} students focus on for ${difficulty.toLowerCase()} concepts?`,
            options: [
              "Basic definitions",
              "Practical applications",
              "Theoretical analysis",
              "All of the above"
            ],
            answer: difficulty === 'Easy' ? 0 : difficulty === 'Hard' ? 2 : 3,
            difficulty
          },
          {
            question: `How does ${difficulty.toLowerCase()} ${subject} content help ${standard} students?`,
            options: [
              "Builds foundation",
              "Develops skills",
              "Encourages analysis",
              "All approaches"
            ],
            answer: 3,
            difficulty
          },
          {
            question: `What makes ${subject} ${difficulty.toLowerCase()} for ${standard} students?`,
            options: [
              "Simple concepts",
              "Clear examples",
              "Complex interactions",
              "Depends on preparation"
            ],
            answer: difficulty === 'Easy' ? 0 : difficulty === 'Medium' ? 1 : 2,
            difficulty
          }
        ];
        dynamicQuestions.push(...staticQuestions.slice(0, questionCount));
      }

      const fallbackResponse: QuizResponse = {
        questions: dynamicQuestions.slice(0, questionCount)
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
- If correct: provide encouraging feedback and explain why the answer is right, plus additional context
- If incorrect: explain the concept gently, why the correct answer is right, and provide a learning tip
- Adjust complexity based on ${difficulty} difficulty level
- Keep it 2-3 sentences maximum but educational
- Use a supportive, encouraging tone
- Include relevant emoji if appropriate
- Focus on understanding, not just correctness

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
        const encouragement = difficulty === 'Hard' ? 'Excellent analytical thinking!' : difficulty === 'Medium' ? 'Great job applying your knowledge!' : 'Perfect! You got it right!';
        feedback = `${encouragement} 🎉 You chose "${correctAnswer}" which is correct. This shows you understand the ${difficulty.toLowerCase()} concepts in ${subject}. Keep up the excellent work!`;
      } else {
        const explanation = difficulty === 'Hard' ? 'This is a challenging concept that requires careful analysis.' : difficulty === 'Medium' ? 'This concept builds on fundamental knowledge.' : 'This is an important basic concept to remember.';
        feedback = `Good attempt! While "${userAnswer}" isn't quite right, you're thinking in the right direction. The correct answer is "${correctAnswer}". ${explanation} Keep practicing these ${subject} concepts! 📚`;
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
