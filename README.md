# 🚀 NeetCode 150 - Interactive Learning Platform

An interactive learning platform for mastering all 150 NeetCode problems with pattern-based explanations, examples, and a live code playground.

## ✨ Features

- **📚 Category-wise Organization**: All 150 problems organized by category (Arrays & Hashing, Two Pointers, etc.)
- **🎯 Pattern Recognition**: Each problem includes detailed pattern explanations to help you recognize similar problems
- **📝 Clear Examples**: Multiple examples with step-by-step explanations in English and Hinglish
- **💻 Code Playground**: Write and test solutions in multiple languages (JavaScript, Python, Java, C++, Go)
- **✅ Test Execution**: Run your code against test cases and see results instantly
- **🔧 Multi-Language Compilers**: Full support for executing code in all supported languages
- **⏱️ Complexity Analysis**: Time and space complexity for each solution
- **🌐 Hinglish Support**: Toggle between English and Hinglish explanations

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies** (required for Java, C++, Go):
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

#### Frontend Only (JavaScript and Python)

For basic usage with JavaScript and Python support only:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

> **Note**: JavaScript and Python work without the backend. Java, C++, and Go require the backend server to be running.

#### Full Setup (All Languages)

To enable support for Java, C++, and Go:

1. **Install system dependencies:**

   - **Java**: Install JDK
     ```bash
     # macOS
     brew install openjdk
     
     # Ubuntu/Debian
     sudo apt-get install default-jdk
     
     # Verify
     javac -version
     java -version
     ```
     
     > **macOS Java Setup**: If you encounter "Unable to locate a Java Runtime", see [Java Installation Troubleshooting](#java-installation-troubleshooting) below.

   - **C++**: Install GCC/G++
     ```bash
     # macOS
     brew install gcc
     
     # Ubuntu/Debian
     sudo apt-get install build-essential
     
     # Verify
     g++ --version
     ```

   - **Go**: Install Go
     ```bash
     # macOS
     brew install go
     
     # Ubuntu/Debian
     sudo apt-get install golang-go
     
     # Verify
     go version
     ```

2. **Start the backend server** (in one terminal):
   ```bash
   npm run server
   # or
   cd server && npm start
   ```
   
   The server will run on `http://localhost:3001` by default.

3. **Start the frontend** (in another terminal):
   ```bash
   npm run dev
   ```

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
6. **Test Your Solution**: Click "Run Code" to execute against test cases
7. **Review Results**: See which test cases passed or failed

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
│   ├── data/
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
│   └── ...
├── server/                     # Backend API for compiled languages
│   ├── index.js               # Express server
│   └── package.json
├── scripts/                    # Utility scripts
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
- Executed directly in the browser using `eval()` and `Function()` constructor
- No backend required

### Python
- Executed using Pyodide (Python in the browser via WebAssembly)
- No backend required

### Java, C++, Go
- Code is sent to the backend API (`http://localhost:3001`)
- Backend process:
  1. Wraps the code in a complete program (adds main function, imports, etc.)
  2. Compiles the code (for Java and C++)
  3. Executes the program
  4. Captures and parses the output
  5. Returns results in a standardized format

## 🛠️ Tech Stack

- **Frontend:**
  - React 19 - UI framework
  - Vite - Build tool
  - Tailwind CSS - Styling
  - Monaco Editor - Code editor
  - React Router - Navigation
  - Pyodide - Python execution in browser

- **Backend:**
  - Express - API server
  - Node.js - Runtime

## 🔍 Troubleshooting

### Python execution fails
- Make sure Pyodide is loading correctly (check browser console)
- Some Python features may not be available in Pyodide

### Java/C++/Go execution fails
- Verify the backend server is running: `curl http://localhost:3001/health`
- Check that compilers are installed: `javac -version`, `g++ --version`, `go version`
- Check backend server logs for errors

### Backend connection errors
- Ensure the backend is running on the correct port (default: 3001)
- Set `VITE_API_URL` environment variable if using a different URL
- Check CORS settings if accessing from a different origin

### Java Installation Troubleshooting

#### macOS: "Unable to locate a Java Runtime"

If `javac` works but `java` doesn't:

1. **Find Java installation:**
   ```bash
   /usr/libexec/java_home -V
   ```

2. **Set JAVA_HOME** (add to your `~/.zshrc` or `~/.bash_profile`):
   ```bash
   echo 'export JAVA_HOME=$(/usr/libexec/java_home)' >> ~/.zshrc
   echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Verify installation:**
   ```bash
   java -version
   javac -version
   ```

Both commands should show version information without errors.

#### Alternative Java Installation Methods

**Using SDKMAN:**
```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Install Java
sdk install java
```

**Using Oracle JDK:**
1. Download from: https://www.oracle.com/java/technologies/downloads/
2. Install the `.dmg` file
3. Set JAVA_HOME:
   ```bash
   export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-XX.jdk/Contents/Home
   export PATH="$JAVA_HOME/bin:$PATH"
   ```

## 🌐 Environment Variables

- `VITE_API_URL`: Backend API URL (default: `http://localhost:3001`)

Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3001
```

## 📜 Available Scripts

- `npm run dev` - Start development server (frontend)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run server` - Start backend server
- `npm run server:dev` - Start backend server in development mode

## 🤝 Contributing

Feel free to add more problems, improve explanations, or enhance the playground!

## 📄 License

MIT

---

**Happy Shivam's Coding! 🎉**
