# 🚀 NeetCode 150 - Revision Playground

An interactive learning platform for mastering all 150 NeetCode problems with pattern-based explanations, examples, and a live code playground.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/shivamskr151/neetcode_learning_platform)

## ✨ Features

- **📚 Category-wise Organization**: All 150 problems organized by category (Arrays & Hashing, Two Pointers, etc.)
- **🎯 Pattern Recognition**: Each problem includes detailed pattern explanations to help you recognize similar problems
- **📝 Clear Examples**: Multiple examples with step-by-step explanations in English and Hinglish
- **💻 Code Playground**: Write and test solutions in multiple languages (JavaScript, Python, Java, C++, Go)
- **✅ Test Execution**: Run your code against test cases and see results instantly
- **🔧 Multi-Language Compilers**: Full support for executing code in all supported languages
- **🐛 Debug Mode**: Enable debug console to see detailed execution logs and error messages
- **⏱️ Complexity Analysis**: Time and space complexity for each solution
- **🌐 Hinglish Support**: Toggle between English and Hinglish explanations

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shivamskr151/neetcode_learning_platform.git
   cd neetcode_learning_platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

#### Basic Setup (JavaScript and Python)

JavaScript and Python work immediately - no additional setup needed:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

#### Full Setup (All Languages - Java, C++, Go)

To enable support for Java, C++, and Go, you need to configure Judge0 API:

1. **Get Judge0 API Key:**
   - Visit https://rapidapi.com/judge0-official/api/judge0-ce
   - Sign up for a free account
   - Subscribe to the free tier (100 requests/day)
   - Copy your API key from the dashboard

2. **Configure Environment Variables:**
   
   Create a `.env` file in the project root:
   ```env
   VITE_JUDGE0_API_KEY=your_api_key_here
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```
   
   > **Note**: No backend server needed! All code execution is handled via Judge0 API in the browser.

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📖 How to Use

1. **Browse Categories**: Start from the home page to see all problem categories
2. **Select a Problem**: Click on any problem to view details
3. **Learn the Pattern**: Read the pattern explanation to understand the core approach
4. **Study Examples**: Review the examples to see how the solution works
5. **Write Code**: Use the code editor to write your solution in your preferred language
6. **Enable Debug Mode** (optional): Toggle the debug button to see detailed execution logs
7. **Test Your Solution**: Click "Run Code" to execute against test cases
8. **Review Results**: See which test cases passed or failed, with detailed error messages if any

## 🎓 Learning Approach

Each problem includes:

1. **Pattern Explanation**: Learn the core pattern/technique used (available in English and Hinglish)
2. **Step-by-step Intuition**: Understand why this approach works
3. **Multiple Examples**: See the pattern applied to different inputs
4. **Complete Solutions**: Reference implementations in multiple languages
5. **Complexity Analysis**: Understand time and space requirements

## 📁 Project Structure

```
algo/
├── src/
│   ├── components/            # React components
│   │   ├── CategoryList.jsx   # Category and problem listing
│   │   ├── ProblemDetail.jsx  # Problem detail view with code editor
│   │   ├── CodeEditor.jsx     # Monaco editor wrapper
│   │   ├── ExecutionResults.jsx # Test results display
│   │   └── DebugConsole.jsx  # Debug output console
│   ├── services/
│   │   └── compilerService.js # Code execution service (Python, Java, C++, Go)
│   ├── utils/
│   │   └── codeBuilder.js     # Code wrapper utilities for Judge0
│   ├── data/
│   │   ├── problems.js        # Problem data loader
│   │   ├── loadProblems.js    # Problem loading utilities
│   │   └── problems/          # All problem definitions
│   │       ├── arrays-hashing/
│   │       │   ├── problem-1/
│   │       │   │   ├── question.json      # Problem metadata, examples, explanations
│   │       │   │   ├── solution.js         # JavaScript solution
│   │       │   │   ├── solution.py         # Python solution
│   │       │   │   ├── solution.java       # Java solution
│   │       │   │   ├── solution.cpp        # C++ solution
│   │       │   │   └── solution.go         # Go solution
│   │       │   ├── problem-2/
│   │       │   │   └── ...
│   │       │   └── ...
│   │       ├── two-pointers/
│   │       ├── sliding-window/
│   │       └── ... (17 categories total)
│   ├── App.jsx                # Main app component with routing
│   └── main.jsx               # App entry point
├── scripts/
│   └── generateProblems.js    # Script to generate problem structure
└── package.json
```

### Problem File Structure

Each problem folder contains:

- **`question.json`**: Problem metadata including:
  - Problem ID, title, difficulty, pattern
  - Description and pattern explanations (English + Hinglish)
  - Examples with inputs, outputs, and explanations
  - Time and space complexity

- **Solution files**: Implementations in supported languages:
  - `solution.js` - JavaScript
  - `solution.py` - Python
  - `solution.java` - Java
  - `solution.cpp` - C++
  - `solution.go` - Go

### question.json Format

```json
{
  "id": 1,
  "title": "Problem Title",
  "difficulty": "Easy|Medium|Hard",
  "pattern": "Pattern Name",
  "description": "Problem description",
  "patternExplanation": "English explanation",
  "patternExplanationHinglish": "Hinglish explanation (Hindi + English mix)",
  "examples": [
    {
      "input": { "key": "value" },
      "output": "expected output",
      "explanation": "English explanation",
      "explanationHinglish": "Hinglish explanation"
    }
  ],
  "complexity": {
    "time": "O(n) - Description",
    "space": "O(n) - Description"
  }
}
```

## 📊 Problem Categories

All 150 NeetCode problems are organized into 17 categories:

| Category | Problems | IDs |
|----------|----------|-----|
| Arrays & Hashing | 16 | 1-16 |
| Two Pointers | 5 | 17-21 |
| Sliding Window | 6 | 22-27 |
| Stack | 6 | 28-33 |
| Binary Search | 9 | 34-42 |
| Linked List | 8 | 43-50 |
| Trees | 14 | 51-64 |
| Tries | 4 | 65-68 |
| Heap / Priority Queue | 6 | 69-74 |
| Backtracking | 8 | 75-82 |
| Graphs | 16 | 83-98 |
| Advanced Graphs | 6 | 99-104 |
| Dynamic Programming 1D | 10 | 105-114 |
| Dynamic Programming 2D | 10 | 115-124 |
| Greedy | 7 | 125-131 |
| Intervals | 6 | 132-137 |
| Math & Bit Manipulation | 13 | 138-150 |
| **TOTAL** | **150** | **1-150** |

## 📝 Adding New Problems

To add a new problem:

1. **Create a folder**: `src/data/problems/{category-id}/problem-{id}/`
2. **Add `question.json`** with all problem metadata (see format above)
3. **Add solution files** for each language you want to support
4. **Update `src/data/loadProblems.js`** to include the new problem ID in the category config

## 🔧 How Code Execution Works

### JavaScript
- Executed directly in the browser using `Function()` constructor
- Function is automatically extracted from code (supports function declarations, arrow functions, etc.)
- Test cases are executed against the extracted function
- No backend or API required

### Python
- Executed using **Pyodide** (Python in the browser via WebAssembly)
- Function is automatically detected and test cases are executed
- No backend or API required
- Loaded from CDN on first use

### Java, C++, Go
- Code is executed via **Judge0 API** (cloud-based code execution service)
- Process:
  1. Function name is extracted from code
  2. Code is wrapped in a complete program (adds main function, imports, etc.) using `codeBuilder.js`
  3. Each test case is sent to Judge0 API for compilation and execution
  4. Results are parsed and compared with expected outputs
  5. No backend server needed - runs entirely in the browser!

### Debug Mode
- When enabled, captures all `console.log()` and `console.error()` output
- Shows detailed execution flow, function extraction, and test case results
- Helps identify issues in code logic and execution

## 🛠️ Tech Stack

- **Frontend:**
  - React 19 - UI framework
  - Vite 7 - Build tool and dev server
  - Tailwind CSS 4 - Styling
  - Monaco Editor - Code editor with syntax highlighting
  - React Router 7 - Navigation and routing

- **Code Execution:**
  - **JavaScript**: Direct browser execution using `Function()` constructor
  - **Python**: Pyodide (Python in the browser via WebAssembly)
  - **Java, C++, Go**: Judge0 API (cloud-based code execution service)
  
- **Development:**
  - ESLint - Code linting
  - PostCSS - CSS processing

## 🔍 Troubleshooting

### Python execution fails
- Make sure Pyodide is loading correctly (check browser console)
- Some Python features may not be available in Pyodide

### Java/C++/Go execution fails
- Verify Judge0 API key is configured in `.env` file
- Check browser console for API errors
- Ensure you've subscribed to Judge0 API on RapidAPI
- Free tier allows 100 requests/day - check your usage limits
- Verify your API key is correct and active

### Judge0 API errors
- **"API key not configured"**: Add `VITE_JUDGE0_API_KEY` to your `.env` file
- **"Execution timed out"**: Code may be taking too long (5 second limit on free tier)
- **"API rate limit exceeded"**: Free tier allows 100 requests/day, wait or upgrade
- **"Invalid API key"**: Verify your API key at RapidAPI dashboard

## 🌐 Environment Variables

- `VITE_JUDGE0_API_KEY`: Judge0 API key (required for Java, C++, Go)
- `VITE_JUDGE0_API_URL`: Judge0 API URL (optional, default: `https://judge0-ce.p.rapidapi.com`)
- `VITE_JUDGE0_API_HOST`: Judge0 API host (optional, default: `judge0-ce.p.rapidapi.com`)

Create a `.env` file in the root directory:
```env
VITE_JUDGE0_API_KEY=your_api_key_here
```

The `.env` file is automatically ignored by git (see `.gitignore`), so your API key won't be committed to version control.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Feel free to add more problems, improve explanations, or enhance the playground!

## 📄 License

MIT

---

**Happy Shivam's Coding! 🎉**
