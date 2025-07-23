const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Unified generation configurations
const jsonConfig = {
  temperature: 0.9,
  top_p: 0.95,
  top_k: 40,
  max_output_tokens: 8192,
  response_mime_type: "application/json",
};

const htmlConfig = {
  temperature: 0.8,
  top_p: 0.95,
  top_k: 40,
  max_output_tokens: 8192,
  response_mime_type: "text/plain",
};

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export const courseOutlineAIModel = model.startChat({
  generationConfig: jsonConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate a study material for Python for Exam and level of Difficulty will be easy with summary of course, List of chapters along with the summary for each chapter, Topic list in each chapter in JSON format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '{"courseSummary": "This course provides an easy introduction to Python programming. It covers fundamental concepts and syntax, making it ideal for beginners preparing for an introductory Python exam.", "chapters": [{"chapterTitle": "Introduction to Python", "chapterSummary": "This chapter introduces the basics of Python, including its history, applications, and how to set up your programming environment.", "topics": ["What is Python?", "Setting up Python environment", "First Python program", "Basic Syntax", "Running Python code"]}, {"chapterTitle": "Variables and Data Types", "chapterSummary": "This chapter covers fundamental data types in Python and how to work with variables.", "topics": ["Variables", "Integers", "Floats", "Strings", "Booleans", "Type Conversion"]}]}',
        },
      ],
    },
  ],
});

export const generateNotesAiModel = model.startChat({
  generationConfig: htmlConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: 'Generate detailed study notes in HTML format (without html, head, body tags). Use <h3> for chapter title, <h4> for topics, and <p> for content. Include all topics with explanations.',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '<h3>Sample Chapter</h3><p>This chapter covers fundamental concepts.</p><h4>Topic 1</h4><p>Detailed explanation of the topic with examples and key points.</p>',
        },
      ],
    },
  ],
});

// Create unified study content model for better efficiency
export const GenerateStudyTypeContentAiModel = model.startChat({
  generationConfig: jsonConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate flashcards with front and back content in JSON array format. Each flashcard should have 'front' and 'back' keys.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '[{"front": "What is a Widget in Flutter?", "back": "Widgets are the fundamental building blocks of Flutter\'s UI. Everything is a widget!"}]',
        },
      ],
    },
  ],
});

export const GenerateQuizAiModel = model.startChat({
  generationConfig: jsonConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate quiz questions with options and correct answers. Format: {questions: [{question, options, answer}]}",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '{"questions": [{"question": "What is the primary purpose of widgets in Flutter?", "options": ["Handle network requests", "Manage application state", "Describe user interface", "Perform database operations"], "answer": "Describe user interface"}]}',
        },
      ],
    },
  ],
});

export const GenerateQnAAiModel = model.startChat({
  generationConfig: jsonConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate question and answer pairs. Format: [{question, answer}] where answer is detailed.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '[{"question": "What is a Widget in Flutter?", "answer": "In Flutter, a Widget is the basic building block of the user interface. Everything you see on the screen is a widget."}]',
        },
      ],
    },
  ],
});

// Helper functions for better prompt construction
export const createCourseOutlinePrompt = (topic, courseType, difficultyLevel) => {
  return `Generate a study material for '${topic}' for '${courseType}' and level of Difficulty will be '${difficultyLevel}' with course title, summary of course, List of chapters along with the summary and Emoji icon for each chapter, Topic list in each chapter in JSON format`;
};

export const createNotesPrompt = (chapter) => {
  return `Generate detailed study notes for this chapter in HTML format (without html, head, body tags). Use <h3> for chapter title, <h4> for topics, and <p> for content. Include all topics with detailed explanations and examples. Chapter: ${JSON.stringify(chapter)}`;
};

export const createFlashcardPrompt = (topics) => {
  return `Generate 15 flashcards on topic: ${topics} in JSON format with front and back content. Focus on key concepts and definitions.`;
};

export const createQuizPrompt = (topics) => {
  return `Generate a quiz on topic: ${topics} with 10 questions. Include options and correct answers in JSON format with structure: {questions: [{question, options, answer}]}`;
};

export const createQAPrompt = (topics) => {
  return `Generate 10 question and answer pairs on topic: ${topics} in JSON format. Provide detailed, educational answers. Format: [{question, answer}]`;
};
