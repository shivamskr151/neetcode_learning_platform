import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CategoryList from './components/CategoryList';
import ProblemDetail from './components/ProblemDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-blue-400">
              🚀 NeetCode 150 - Revision Playground
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Master all 150 problems with pattern-based learning
            </p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CategoryList />} />
            <Route path="/category/:categoryId" element={<CategoryList />} />
            <Route path="/problem/:id" element={<ProblemDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
