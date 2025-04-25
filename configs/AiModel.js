const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Create the model
const generationConfig = {
  temperature: 1,
  top_p: 0.95,
  top_k: 40,
  max_output_tokens: 8192,
  response_mime_type: "application/json",
};

const generationConfig1 = {
  temperature: 0.95,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const courseOutlineAIModel = model.startChat({
  generationConfig,
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
          text: '```json\n{"courseSummary": "This course provides an easy introduction to Python programming. It covers fundamental concepts and syntax, making it ideal for beginners preparing for an introductory Python exam.", "chapters": [{"chapterTitle": "Introduction to Python", "chapterSummary": "This chapter introduces the basics of Python, including its history, applications, and how to set up your programming environment.", "topics": ["What is Python?", "Setting up Python environment", "First Python program", "Basic Syntax", "Running Python code"]}, {"chapterTitle": "Variables and Data Types", "chapterSummary": "This chapter covers fundamental data types in Python and how to work with variables.", "topics": ["Variables", "Integers", "Floats", "Strings", "Booleans", "Type Conversion"]}, {"chapterTitle": "Operators", "chapterSummary": "This chapter explores various operators in Python, including arithmetic, comparison, logical, and assignment operators.", "topics": ["Arithmetic Operators", "Comparison Operators", "Logical Operators", "Assignment Operators"]}, {"chapterTitle": "Control Flow", "chapterSummary": "This chapter explains conditional statements and loops in Python.", "topics": ["if-else statements", "for loop", "while loop", "break and continue statements"]}, {"chapterTitle": "Data Structures", "chapterSummary": "This chapter introduces basic data structures such as lists, tuples, and dictionaries.", "topics": ["Lists", "Tuples", "Dictionaries", "Sets"]}, {"chapterTitle": "Functions", "chapterSummary": "This chapter explains how to define and use functions to organize your code.", "topics": ["Defining Functions", "Function Arguments", "Return Values", "Scope"]}, {"chapterTitle": "Input and Output", "chapterSummary": "This chapter demonstrates how to take input from the user and display output.", "topics": ["Taking user input", "Displaying output", "File input and output"]}]}\n\n```',
        },
      ],
    },
  ],
});

export const generateNotesAiModel = model.startChat({
  generationConfig1,
  history: [
    {
      role: "user",
      parts: [
        {
          text: 'Generate exam material detail content for each chapter. Make sure to include all topic point in the content and give detailed explanation for each topic point  make sure to give content in HTML format (Do not add Html, Head, Body, title tag), write the content in html tags like <h3> for chapter title <p> for content <h4> for topic, The Chapters:{\\n"chapterTitle": "Introduction to Data Structures and Algorithms",\\n"chapterSummary": "This chapter Generate exam material detail content for each chapter. Make sure to include all topic point in the content, make sure to give content in HTML format (DO not add HTML, Head, Body, title tag), write the content in html tags like <h3> for chapter title <p> for content <h4> for topic, The Chapters:{\\n"chapterTitle": "Introduction to Data Structures and Algorithms",\\n"chapterSummary": "This chapter introduces the fundamental concepts of data structures and algorithms, their importance in problem-solving, and how to approach algorithm analysis.",\\n"topics": [\\n"What are Data Structures?",\\n"What are Algorithms?",\\n"Big O Notation (Introduction)",\\n"Common Data Structure Categories"\\n]\\n},',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "```html\n <h3>Introduction to Data Structures and Algorithms</h3>\n    <p>This chapter introduces the fundamental concepts of data structures and algorithms, their importance in problem-solving, and how to approach algorithm analysis. Understanding these concepts is crucial for developing efficient and effective software solutions.</p>\n\n    <h4>What are Data Structures?</h4>\n    <p>Data structures are specialized ways of organizing, storing, and managing data within a computer's memory. They are not just about storing data; they are about structuring it in a way that allows for efficient access, modification, and manipulation. The choice of data structure can drastically affect the performance of an algorithm, particularly when dealing with large datasets. Different data structures are suitable for different tasks; for example, an array is excellent for accessing elements by index, while a linked list is better for inserting and deleting elements. In essence, a data structure defines the relationship between the data it holds and the operations that can be performed on that data.</p>\n        <ul>\n            <li><strong>Key Concepts:</strong> Data organization, efficient data access, data storage, manipulation of data.</li>\n            <li><strong>Examples:</strong>\n                <ul>\n                    <li><strong>Arrays:</strong> A collection of elements of the same type stored in contiguous memory locations, accessed by index.</li>\n                    <li><strong>Linked Lists:</strong> A sequence of nodes, each containing data and a reference (link) to the next node in the sequence.</li>\n                    <li><strong>Trees:</strong> Hierarchical structures consisting of nodes connected by edges, often used for representing hierarchical relationships.</li>\n                    <li><strong>Graphs:</strong> A collection of nodes (vertices) connected by edges, useful for representing relationships between objects.</li>\n                    <li><strong>Hash Tables:</strong> Data structures that use a hash function to map keys to values for fast lookups.</li>\n                </ul>\n            </li>\n        </ul>\n\n    <h4>What are Algorithms?</h4>\n    <p>Algorithms are well-defined, step-by-step instructions or procedures designed to solve a particular problem or perform a specific task. They are the core logic behind any program, dictating how data is processed to produce the desired output. An algorithm must be unambiguous, meaning it should have a clear and precise set of instructions. It must also be effective, meaning it should be able to solve the problem in a finite number of steps, and it should terminate. Algorithms can be represented in various forms, including natural language, pseudocode, flowcharts, and programming language code. The efficiency of an algorithm is a crucial consideration, and it is often measured by its time and space complexity.</p>\n    <ul>\n         <li><strong>Key Concepts:</strong> Step-by-step instructions, problem-solving methodology, logical flow of operations.</li>\n         <li><strong>Characteristics:</strong>\n            <ul>\n                <li><strong>Finiteness:</strong> An algorithm must terminate after a finite number of steps.</li>\n                <li><strong>Definiteness:</strong> Each step of the algorithm must be precisely defined and unambiguous.</li>\n                <li><strong>Input:</strong> An algorithm may have zero or more inputs.</li>\n                <li><strong>Output:</strong> An algorithm must produce one or more outputs.</li>\n                <li><strong>Effectiveness:</strong> Each step must be basic and feasible to perform.</li>\n            </ul>\n        </li>\n    </ul>\n\n    <h4>Big O Notation (Introduction)</h4>\n    <p>Big O notation is a mathematical notation used to describe the limiting behavior of a function, particularly in the context of algorithm analysis. It provides a way to express how the runtime or space requirements of an algorithm grow as the input size grows. Big O notation focuses on the dominant term in the algorithm's complexity, ignoring constant factors and lower-order terms. It provides an upper bound on the growth rate of an algorithm’s resource usage, focusing on the worst-case performance, for example, if an algorithm has a time complexity of O(n), it means that the time it takes to run will grow linearly with the size of the input (n). Big O notation is essential for comparing the efficiency of different algorithms and choosing the best one for a particular problem.</p>\n     <ul>\n        <li><strong>Key Concepts:</strong> Algorithm complexity, growth rate of resource usage, worst-case scenario analysis, upper bound on performance.</li>\n        <li><strong>Common Notations:</strong>\n            <ul>\n                <li><strong>O(1) - Constant time:</strong> The algorithm's runtime is independent of the input size (e.g., accessing an element in an array).</li>\n                <li><strong>O(log n) - Logarithmic time:</strong> The algorithm's runtime increases logarithmically with the input size (e.g., binary search).</li>\n                <li><strong>O(n) - Linear time:</strong> The algorithm's runtime increases linearly with the input size (e.g., traversing a list).</li>\n                 <li><strong>O(n log n) - Log-linear time:</strong> The algorithm's runtime grows proportionally to n multiplied by the logarithm of n (e.g., merge sort).</li>\n                <li><strong>O(n^2) - Quadratic time:</strong> The algorithm's runtime increases proportionally to the square of the input size (e.g., nested loops).</li>\n                <li><strong>O(2^n) - Exponential time:</strong> The algorithm's runtime grows exponentially with the input size (e.g., brute force algorithms).</li>\n            </ul>\n        </li>\n    </ul>\n\n    <h4>Common Data Structure Categories</h4>\n    <p>Data structures can be classified into various categories based on their organization and properties. These categories help in understanding the characteristics and appropriate uses of different data structures.</p>\n        <ul>\n         <li><strong>Linear Data Structures:</strong>\n            <p>In linear data structures, data elements are arranged in a sequential manner. Each element is connected to the previous and next element (except for the first and last). These structures are easy to implement and traverse but may not always be the most efficient for complex operations.\n               Examples:\n                <ul>\n                    <li><strong>Arrays:</strong>  A contiguous block of memory storing elements of the same type.</li>\n                    <li><strong>Linked Lists:</strong> A sequence of nodes, each containing data and a link to the next node.</li>\n                    <li><strong>Stacks:</strong>  A LIFO (Last-In-First-Out) structure where elements are added and removed from one end.</li>\n                     <li><strong>Queues:</strong>  A FIFO (First-In-First-Out) structure where elements are added at the rear and removed from the front.</li>\n                </ul>\n            </p>\n        </li>\n         <li><strong>Non-linear Data Structures:</strong>\n            <p>In non-linear data structures, data elements are not arranged sequentially; elements are related to others in a more complex fashion. These structures are better suited for storing data with hierarchical or network-like relationships and can handle more complex operations efficiently.\n                Examples:\n                <ul>\n                    <li><strong>Trees:</strong> A hierarchical data structure with a root node, child nodes, and edges connecting them.</li>\n                     <li><strong>Graphs:</strong> A collection of nodes (vertices) connected by edges, used to model relationships between objects.</li>\n                 </ul>\n            </p>\n        </li>\n         <li><strong>Primitive Data Structures:</strong>\n            <p>Primitive data structures are the basic building blocks provided by programming languages for data representation. They are directly supported by the hardware and are used to build more complex data structures.\n                 Examples:\n                <ul>\n                    <li><strong>Integers:</strong> Whole numbers.</li>\n                    <li><strong>Floats:</strong> Numbers with decimal points.</li>\n                    <li><strong>Characters:</strong> Single text characters.</li>\n                    <li><strong>Booleans:</strong> True or false values.</li>\n                </ul>\n            </p>\n        </li>\n         <li><strong>Abstract Data Types (ADTs):</strong>\n            <p>Abstract data types are high-level, conceptual models of data structures that specify their behavior without revealing implementation details. ADTs focus on what operations can be performed on the data, rather than how the data is stored. They provide a logical view of data and operations, which can be implemented using different data structures.\n               Examples:\n                <ul>\n                    <li><strong>Lists:</strong>  Ordered collection of elements.</li>\n                     <li><strong>Sets:</strong>  Collection of unique elements.</li>\n                     <li><strong>Maps:</strong>  Key-value pairs for mapping keys to values.</li>\n                 </ul>\n            </p>\n        </li>\n        </ul>\n```\n",
        },
      ],
    },
  ],
});

export const GenerateStudyTypeContentAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate the flashcard on topic: Flutter Fundamentals, User Interface(UI) Development, Basic App Navigation in JSON format with front and back content, Maximum15",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  {\n    "front": "What is a Widget in Flutter?",\n    "back": "Widgets are the fundamental building blocks of Flutter\'s UI. Everything is a widget! They describe what the UI should look like based on their configuration."\n  },\n  {\n    "front": "Name three common layout widgets.",\n    "back": "1. **Container**: Provides padding, margin, decoration.\\n2. **Row**: Arranges widgets horizontally.\\n3. **Column**: Arranges widgets vertically."\n  },\n   {\n    "front": "What is the purpose of the `Scaffold` widget?",\n    "back": "The `Scaffold` widget provides the basic visual structure for a Material Design app, such as an `AppBar`, `Drawer`, and `BottomNavigationBar`."\n  },\n   {\n    "front": "What are Stateless and Stateful Widgets?",\n     "back": "**Stateless**: UI doesn\'t change after creation.\\n**Stateful**: UI can change based on user interactions or data changes."\n  },\n  {\n    "front": "How do you change the text in a `Text` widget?",\n    "back": "You pass a new `String` value to the `Text` widget\'s `data` property."\n  },\n  {\n    "front": "What widget is used for displaying an image?",\n    "back": "The `Image` widget. You can use `Image.network` for URLs or `Image.asset` for local files."\n  },\n    {\n    "front": "How to handle user input with a text field?",\n    "back": "Use a `TextField` widget. You often pair it with a `TextEditingController` to manage input."\n  },\n  {\n     "front": "What is `AppBar` and where is it located?",\n      "back": "AppBar is a toolbar displayed at the top of the screen. It is usually the child of a `Scaffold`."\n  },\n    {\n     "front": "How is navigation handled in Flutter?",\n     "back": "Primarily through the `Navigator` widget and routes. Use `Navigator.push` to navigate forward and `Navigator.pop` to go back."\n   },\n  {\n    "front": "What is a \'route\' in Flutter navigation?",\n     "back": "A route is a unique string identifier or a widget representing a screen in the app. It is used by the navigator to manage screens."\n  },\n   {\n     "front": "Explain `MaterialPageRoute`.",\n     "back": "It is the common route used for Android/iOS navigation, providing transition animations specific to each platform."\n   },\n  {\n    "front": "What is `Navigator.pushNamed` used for?",\n      "back": "It\'s used to navigate to a route by its name (String identifier) . It requires predefined routes in the `MaterialApp`."\n   },\n    {\n      "front": "What are `named routes`?",\n      "back": "Named routes are a convenient way to organize navigation. You define routes (names) and the corresponding widgets in your app\'s `MaterialApp`."\n    },\n    {\n      "front": "How do you pass data to a new screen?",\n      "back": "Pass data as an argument to the constructor of the new screen (widget) or using `arguments` property in route navigation."\n    },\n     {\n      "front": "What does `Navigator.pop` do?",\n      "back": "It removes the current screen from the navigator\'s stack and navigates back to the previous screen."\n    }\n]\n```\n',
        },
      ],
    },
  ],
});

export const GenerateQuizAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate Quiz on topic: Flutter Fundamentals, UserInterface (UI) Development, Basic App Navigation with Question and Options along with correct answer in JSON format. In the questions array give questions in objects with three keys: question, options and answer",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "quizTitle": "Flutter Fundamentals: UI Development & Basic Navigation",\n  "description": "Test your knowledge of Flutter UI concepts and basic app navigation.",\n  "questions": [\n    {\n      "question": "What is the primary purpose of the \'Widget\' in Flutter?",\n      "options": [\n        "To handle network requests.",\n        "To manage application state.",\n        "To describe a part of the user interface.",\n        "To perform database operations."\n      ],\n      "answer": "To describe a part of the user interface."\n    },\n    {\n      "question": "Which widget is commonly used for displaying a sequence of children in a horizontal or vertical layout?",\n      "options": [\n        "Container",\n        "Text",\n        "Row/Column",\n        "Image"\n      ],\n      "answer": "Row/Column"\n    },\n      {\n        "question": "What is the purpose of the \'BuildContext\' in Flutter?",\n        "options": [\n          "To store application preferences.",\n            "To retrieve widget configurations.",\n          "To locate the widget\'s position in the widget tree.",\n            "To manage the lifecycle of widgets."\n        ],\n        "answer": "To locate the widget\'s position in the widget tree."\n      },\n    {\n      "question": "Which widget is used to make a container with specified padding and margin?",\n      "options": [\n        "Center",\n        "Padding",\n          "SafeArea",\n        "Container"\n      ],\n      "answer": "Container"\n    },\n    {\n      "question": "What is the primary role of the \'MaterialApp\' widget in Flutter?",\n      "options": [\n        "To display images.",\n        "To manage network requests.",\n        "To configure the visual theme and overall app structure.",\n        "To handle user input."\n      ],\n      "answer": "To configure the visual theme and overall app structure."\n    },\n      {\n          "question": "Which widget is typically used for navigating between different screens in a Flutter app?",\n          "options": [\n              "Text",\n              "Container",\n              "Navigator",\n              "AlertDialog"\n          ],\n          "answer": "Navigator"\n      },\n      {\n          "question": "What is a \'StatefulWidget\' primarily used for?",\n          "options": [\n              "Displaying static content.",\n              "Managing immutable data.",\n              "Managing a dynamic state that can change over time.",\n              "Rendering simple layouts."\n\n          ],\n        "answer": "Managing a dynamic state that can change over time."\n      },\n    {\n      "question": "How do you typically pass data between screens when using the Navigator?",\n      "options": [\n        "Using global variables.",\n        "Using shared preferences.",\n          "Using arguments in the Navigator.push named route",\n        "Using local storage."\n      ],\n        "answer": "Using arguments in the Navigator.push named route"\n    },\n      {\n          "question": "What is the purpose of the \'pubspec.yaml\' file in a Flutter project?",\n          "options": [\n              "To store user preferences.",\n              "To define the project\'s dependencies and assets.",\n              "To define the project\'s layout structure.",\n              "To store the application\'s business logic."\n\n          ],\n          "answer": "To define the project\'s dependencies and assets."\n      },\n    {\n      "question": "Which widget is used to create a button that can be interacted with?",\n      "options": [\n        "Text",\n        "Row",\n        "Container",\n        "ElevatedButton"\n      ],\n      "answer": "ElevatedButton"\n    }\n\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

export const GenerateQnAAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate question and answer on topic: Flutter Fundamentals, User Interface(UI) Development, Basic App Navigation in JSON format. Just give a question and its descriptive answer . Maximum 10",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  {\n    "question": "What is a Widget in Flutter and why are they fundamental to building UIs?",\n    "answer": "In Flutter, a Widget is the basic building block of the user interface. Everything you see on the screen, from buttons to text to layouts, is a widget. Widgets are fundamental because they describe what the UI should look like and how it should behave. Flutter\'s UI is built by composing widgets together in a nested tree structure."\n  },\n  {\n    "question": "Explain the difference between `StatelessWidget` and `StatefulWidget`.",\n    "answer": "`StatelessWidget` are widgets that do not have any internal state that changes over time; their properties are immutable and determined when the widget is created (e.g., a Text widget displaying static text). `StatefulWidget` are widgets that have an internal state that can change over time, triggering a UI rebuild when updated. Examples include widgets that respond to user interaction or display dynamic content."\n  },\n  {\n    "question": "What is the purpose of the `build` method in a Flutter Widget?",\n    "answer": "The `build` method is a core part of every Flutter widget. It\'s a function that returns the widget\'s UI representation as a widget tree. Whenever a widget\'s properties or its state changes, Flutter calls the `build` method to construct the new UI representation."\n  },\n   {\n    "question": "What is the role of the `MaterialApp` widget in a Flutter application?",\n    "answer": "The `MaterialApp` widget is a top-level widget that establishes the fundamental components for a Material Design application. It sets up things like the app\'s theme (colors, typography), navigation routing, and can define the initial screen of the app. It also uses a `Navigator` for managing routes."\n  },\n   {\n    "question": "How do you navigate between screens in Flutter using named routes?",\n    "answer": "Named routes are a way to define paths for screens that are identified by a String. To navigate to a screen using named routes, you must first define these routes in the `MaterialApp`\'s `routes` property, typically in your `main.dart` file.  Then, you can use `Navigator.pushNamed(context, \'/routeName\')` to navigate to the specified route."\n  },\n  {\n     "question": "What is the purpose of the `Navigator` in Flutter?",\n    "answer":"The `Navigator` is a widget in Flutter responsible for managing navigation between screens, also known as routes. It uses a stack to manage screens, and you can push a new screen onto the stack using `Navigator.push` or `Navigator.pushNamed`, and pop the current screen using `Navigator.pop`."\n  },\n   {\n     "question":"What is the difference between `push` and `pushReplacementNamed`?",\n    "answer":"Both `push` and `pushReplacementNamed` are used to navigate to new screens. `push` adds the new route to the top of the navigation stack, allowing you to return to the previous screen with `pop`. `pushReplacementNamed`, however, removes the current route from the navigation stack and pushes the new one, meaning the user cannot navigate back to the original screen using back-button from device."\n   },\n    {\n    "question": "How do you pass data when navigating between screens?",\n      "answer": "You can pass data during navigation using the `arguments` parameter of the Navigator methods. For example `Navigator.pushNamed(context, \'/second\', arguments: \'some data\')` can pass a string to the second screen. The second screen then gets this data using the `ModalRoute.of(context)!.settings.arguments` property."\n\n    },\n  {\n    "question": "What is a `Scaffold` widget and what basic UI structure does it provide?",\n     "answer":"The `Scaffold` widget provides the basic visual layout structure for a material design application. It offers common UI elements like an `AppBar`, a `drawer`, and a `bottomNavigationBar`, allowing you to structure the app interface consistently with material guidelines. The body of the app sits inside the scaffold area. "\n  },\n   {\n      "question": "What is the `BuildContext` in Flutter and why is it important?",\n      "answer": "The `BuildContext` is a handle to the location of a widget in the widget tree. It is passed as a parameter to the `build` method and is needed when interacting with the tree, such as finding widgets using `context.findAncestorWidgetOfExactType<Widget>()` or using the Navigator as in `Navigator.push(context)` to navigate to other screens. It provides contextual information of the widgets current location in tree. "\n   }\n\n]\n```\n',
        },
      ],
    },
  ],
});
