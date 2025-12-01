# Compiler API Server

Backend API server for compiling and executing code in Java, C++, and Go.

## Prerequisites

- Node.js (v18 or higher)
- Java JDK (for Java compilation)
- GCC/G++ (for C++ compilation)
- Go (for Go execution)

## Installation

```bash
cd server
npm install
```

## Running the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001` by default.

## API Endpoints

### Health Check
```
GET /health
```

Returns server status.

### Execute Code
```
POST /api/execute
Content-Type: application/json

{
  "language": "java" | "cpp" | "go",
  "code": "your code here",
  "testCases": [
    {
      "input": { "nums": [2, 7, 11, 15], "target": 9 },
      "output": [0, 1]
    }
  ]
}
```

## Environment Variables

- `PORT`: Server port (default: 3001)

## Supported Languages

- **Java**: Requires JDK installed
- **C++**: Requires GCC/G++ installed
- **Go**: Requires Go compiler installed

## Security Notes

⚠️ **Warning**: This server executes arbitrary code. Only run in a trusted environment or with proper sandboxing.

For production use, consider:
- Running in Docker containers
- Using resource limits
- Implementing timeout mechanisms
- Adding authentication/authorization

