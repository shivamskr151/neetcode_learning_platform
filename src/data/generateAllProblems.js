// Script to generate all 150 NeetCode problems
// This will create the folder structure and files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const problemsData = {
  'arrays-hashing': {
    name: 'Arrays & Hashing',
    problems: [
      { id: 1, title: 'Two Sum', difficulty: 'Easy', pattern: 'Hash Map' },
      { id: 2, title: 'Contains Duplicate', difficulty: 'Easy', pattern: 'Hash Set' },
      { id: 3, title: 'Valid Anagram', difficulty: 'Easy', pattern: 'Hash Map / Frequency Counter' },
      { id: 4, title: 'Group Anagrams', difficulty: 'Medium', pattern: 'Hash Map + Sorting' },
      { id: 5, title: 'Top K Frequent Elements', difficulty: 'Medium', pattern: 'Hash Map + Bucket Sort / Heap' },
      { id: 6, title: 'Product of Array Except Self', difficulty: 'Medium', pattern: 'Prefix/Suffix Product' },
      { id: 7, title: 'Valid Sudoku', difficulty: 'Medium', pattern: 'Hash Set' },
      { id: 8, title: 'Encode and Decode Strings', difficulty: 'Medium', pattern: 'String Encoding' },
      { id: 9, title: 'Longest Consecutive Sequence', difficulty: 'Hard', pattern: 'Hash Set' },
      { id: 10, title: 'Two Sum II', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 11, title: '3Sum', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 12, title: '4Sum', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 13, title: 'Clone Graph', difficulty: 'Medium', pattern: 'Graph DFS/BFS' },
      { id: 14, title: 'Find Duplicate Number', difficulty: 'Medium', pattern: 'Floyd\'s Cycle Detection' },
      { id: 15, title: 'Missing Number', difficulty: 'Easy', pattern: 'Math / XOR' },
      { id: 16, title: 'Maximum Subarray', difficulty: 'Medium', pattern: 'Kadane\'s Algorithm' }
    ]
  },
  'two-pointers': {
    name: 'Two Pointers',
    problems: [
      { id: 17, title: 'Valid Palindrome', difficulty: 'Easy', pattern: 'Two Pointers' },
      { id: 18, title: 'Two Sum II', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 19, title: '3Sum', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 20, title: 'Container With Most Water', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 21, title: 'Trapping Rain Water', difficulty: 'Hard', pattern: 'Two Pointers' }
    ]
  },
  'sliding-window': {
    name: 'Sliding Window',
    problems: [
      { id: 22, title: 'Best Time to Buy & Sell Stock', difficulty: 'Easy', pattern: 'Sliding Window' },
      { id: 23, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', pattern: 'Sliding Window' },
      { id: 24, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', pattern: 'Sliding Window' },
      { id: 25, title: 'Permutation in String', difficulty: 'Medium', pattern: 'Sliding Window' },
      { id: 26, title: 'Minimum Window Substring', difficulty: 'Hard', pattern: 'Sliding Window' },
      { id: 27, title: 'Sliding Window Maximum', difficulty: 'Hard', pattern: 'Sliding Window + Deque' }
    ]
  },
  'stack': {
    name: 'Stack',
    problems: [
      { id: 28, title: 'Valid Parentheses', difficulty: 'Easy', pattern: 'Stack' },
      { id: 29, title: 'Min Stack', difficulty: 'Medium', pattern: 'Stack' },
      { id: 30, title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', pattern: 'Stack' },
      { id: 31, title: 'Generate Parentheses', difficulty: 'Medium', pattern: 'Backtracking + Stack' },
      { id: 32, title: 'Daily Temperatures', difficulty: 'Medium', pattern: 'Monotonic Stack' },
      { id: 33, title: 'Car Fleet', difficulty: 'Medium', pattern: 'Stack' }
    ]
  },
  'binary-search': {
    name: 'Binary Search',
    problems: [
      { id: 34, title: 'Binary Search', difficulty: 'Easy', pattern: 'Binary Search' },
      { id: 35, title: 'Search 2D Matrix', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 36, title: 'Koko Eating Bananas', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 37, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 38, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 39, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', pattern: 'Binary Search' },
      { id: 40, title: 'Time Based Key Value Store', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 41, title: 'Find Peak Element', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 42, title: 'Search Sorted Array of Unknown Size', difficulty: 'Medium', pattern: 'Binary Search' }
    ]
  },
  'linked-list': {
    name: 'Linked List',
    problems: [
      { id: 43, title: 'Reverse Linked List', difficulty: 'Easy', pattern: 'Linked List' },
      { id: 44, title: 'Merge Two Sorted Lists', difficulty: 'Easy', pattern: 'Linked List' },
      { id: 45, title: 'Reorder List', difficulty: 'Medium', pattern: 'Linked List' },
      { id: 46, title: 'Remove Nth Node From End', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 47, title: 'Copy List With Random Pointer', difficulty: 'Medium', pattern: 'Hash Map' },
      { id: 48, title: 'Add Two Numbers', difficulty: 'Medium', pattern: 'Linked List' },
      { id: 49, title: 'Linked List Cycle', difficulty: 'Easy', pattern: 'Floyd\'s Cycle Detection' },
      { id: 50, title: 'Find Intersection of Two Linked Lists', difficulty: 'Easy', pattern: 'Two Pointers' }
    ]
  },
  'trees': {
    name: 'Trees',
    problems: [
      { id: 51, title: 'Invert Binary Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 52, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 53, title: 'Diameter of Binary Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 54, title: 'Balanced Binary Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 55, title: 'Same Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 56, title: 'Subtree of Another Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 57, title: 'Lowest Common Ancestor (BST)', difficulty: 'Medium', pattern: 'BST Properties' },
      { id: 58, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', pattern: 'BFS' },
      { id: 59, title: 'Binary Tree Right Side View', difficulty: 'Medium', pattern: 'BFS' },
      { id: 60, title: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', pattern: 'Tree DFS' },
      { id: 61, title: 'Validate BST', difficulty: 'Medium', pattern: 'BST Properties' },
      { id: 62, title: 'Kth Smallest in BST', difficulty: 'Medium', pattern: 'Inorder Traversal' },
      { id: 63, title: 'Construct Binary Tree from Pre/Post', difficulty: 'Medium', pattern: 'Tree Construction' },
      { id: 64, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', pattern: 'Tree Serialization' }
    ]
  },
  'tries': {
    name: 'Tries',
    problems: [
      { id: 65, title: 'Implement Trie', difficulty: 'Medium', pattern: 'Trie' },
      { id: 66, title: 'Design Add and Search Word', difficulty: 'Medium', pattern: 'Trie + DFS' },
      { id: 67, title: 'Word Search II', difficulty: 'Hard', pattern: 'Trie + Backtracking' },
      { id: 68, title: 'Longest Word in Dictionary', difficulty: 'Medium', pattern: 'Trie' }
    ]
  },
  'heap-priority-queue': {
    name: 'Heap / Priority Queue',
    problems: [
      { id: 69, title: 'Kth Largest Element in Array', difficulty: 'Medium', pattern: 'Heap' },
      { id: 70, title: 'Last Stone Weight', difficulty: 'Easy', pattern: 'Heap' },
      { id: 71, title: 'K Closest Points to Origin', difficulty: 'Medium', pattern: 'Heap' },
      { id: 72, title: 'Task Scheduler', difficulty: 'Medium', pattern: 'Heap + Greedy' },
      { id: 73, title: 'Design Twitter', difficulty: 'Medium', pattern: 'Heap' },
      { id: 74, title: 'Find Median from Data Stream', difficulty: 'Hard', pattern: 'Two Heaps' }
    ]
  },
  'backtracking': {
    name: 'Backtracking',
    problems: [
      { id: 75, title: 'Subsets', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 76, title: 'Combination Sum', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 77, title: 'Permutations', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 78, title: 'Combination Sum II', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 79, title: 'Word Search', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 80, title: 'Palindrome Partitioning', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 81, title: 'Letter Combinations of Phone Number', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 82, title: 'N Queens', difficulty: 'Hard', pattern: 'Backtracking' }
    ]
  },
  'graphs': {
    name: 'Graphs',
    problems: [
      { id: 83, title: 'Number of Islands', difficulty: 'Medium', pattern: 'DFS/BFS' },
      { id: 84, title: 'Max Area of Island', difficulty: 'Medium', pattern: 'DFS' },
      { id: 85, title: 'Clone Graph', difficulty: 'Medium', pattern: 'DFS/BFS' },
      { id: 86, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', pattern: 'DFS' },
      { id: 87, title: 'Surrounded Regions', difficulty: 'Medium', pattern: 'DFS' },
      { id: 88, title: 'Rotting Oranges', difficulty: 'Medium', pattern: 'BFS' },
      { id: 89, title: 'Walls and Gates', difficulty: 'Medium', pattern: 'BFS' },
      { id: 90, title: 'Course Schedule', difficulty: 'Medium', pattern: 'Topological Sort' },
      { id: 91, title: 'Course Schedule II', difficulty: 'Medium', pattern: 'Topological Sort' },
      { id: 92, title: 'Redundant Connection', difficulty: 'Medium', pattern: 'Union Find' },
      { id: 93, title: 'Number of Connected Components', difficulty: 'Medium', pattern: 'Union Find' },
      { id: 94, title: 'Graph Valid Tree', difficulty: 'Medium', pattern: 'Union Find' },
      { id: 95, title: 'Word Ladder', difficulty: 'Hard', pattern: 'BFS' },
      { id: 96, title: 'Minimum Knight Moves', difficulty: 'Medium', pattern: 'BFS' },
      { id: 97, title: 'Evaluate Division', difficulty: 'Medium', pattern: 'DFS' },
      { id: 98, title: 'Alien Dictionary', difficulty: 'Hard', pattern: 'Topological Sort' }
    ]
  },
  'advanced-graphs': {
    name: 'Advanced Graphs',
    problems: [
      { id: 99, title: 'Network Delay Time', difficulty: 'Medium', pattern: 'Dijkstra' },
      { id: 100, title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', pattern: 'Bellman-Ford' },
      { id: 101, title: 'Swim in Rising Water', difficulty: 'Hard', pattern: 'Dijkstra' },
      { id: 102, title: 'Min Cost to Connect All Points', difficulty: 'Medium', pattern: 'Prim\'s / Kruskal' },
      { id: 103, title: 'Max Points on a Line', difficulty: 'Hard', pattern: 'Math' },
      { id: 104, title: 'Bipartite Graph', difficulty: 'Medium', pattern: 'Graph Coloring' }
    ]
  },
  'dp-1d': {
    name: 'Dynamic Programming 1D',
    problems: [
      { id: 105, title: 'Climbing Stairs', difficulty: 'Easy', pattern: 'DP' },
      { id: 106, title: 'Min Cost Climbing Stairs', difficulty: 'Easy', pattern: 'DP' },
      { id: 107, title: 'House Robber', difficulty: 'Medium', pattern: 'DP' },
      { id: 108, title: 'House Robber II', difficulty: 'Medium', pattern: 'DP' },
      { id: 109, title: 'Longest Palindromic Substring', difficulty: 'Medium', pattern: 'DP' },
      { id: 110, title: 'Palindromic Substrings', difficulty: 'Medium', pattern: 'DP' },
      { id: 111, title: 'Decode Ways', difficulty: 'Medium', pattern: 'DP' },
      { id: 112, title: 'Coin Change', difficulty: 'Medium', pattern: 'DP' },
      { id: 113, title: 'Maximum Product Subarray', difficulty: 'Medium', pattern: 'DP' },
      { id: 114, title: 'Word Break', difficulty: 'Medium', pattern: 'DP' }
    ]
  },
  'dp-2d': {
    name: 'Dynamic Programming 2D',
    problems: [
      { id: 115, title: 'Unique Paths', difficulty: 'Medium', pattern: 'DP 2D' },
      { id: 116, title: 'Longest Common Subsequence', difficulty: 'Medium', pattern: 'DP 2D' },
      { id: 117, title: 'Longest Increasing Path Matrix', difficulty: 'Hard', pattern: 'DP 2D + DFS' },
      { id: 118, title: 'Coin Change II', difficulty: 'Medium', pattern: 'DP 2D' },
      { id: 119, title: 'Target Sum', difficulty: 'Medium', pattern: 'DP 2D' },
      { id: 120, title: 'Interleaving String', difficulty: 'Medium', pattern: 'DP 2D' },
      { id: 121, title: 'Edit Distance', difficulty: 'Hard', pattern: 'DP 2D' },
      { id: 122, title: 'Burst Balloons', difficulty: 'Hard', pattern: 'DP 2D' },
      { id: 123, title: 'Regular Expression Matching', difficulty: 'Hard', pattern: 'DP 2D' },
      { id: 124, title: 'Maximum Profit in Job Scheduling', difficulty: 'Hard', pattern: 'DP 2D' }
    ]
  },
  'greedy': {
    name: 'Greedy',
    problems: [
      { id: 125, title: 'Maximum Subarray', difficulty: 'Medium', pattern: 'Kadane\'s Algorithm' },
      { id: 126, title: 'Jump Game', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 127, title: 'Jump Game II', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 128, title: 'Gas Station', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 129, title: 'Hand of Straights', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 130, title: 'Merge Triplets', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 131, title: 'Partition Labels', difficulty: 'Medium', pattern: 'Greedy' }
    ]
  },
  'intervals': {
    name: 'Intervals',
    problems: [
      { id: 132, title: 'Insert Interval', difficulty: 'Medium', pattern: 'Intervals' },
      { id: 133, title: 'Merge Intervals', difficulty: 'Medium', pattern: 'Intervals' },
      { id: 134, title: 'Non-overlapping Intervals', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 135, title: 'Meeting Rooms', difficulty: 'Easy', pattern: 'Intervals' },
      { id: 136, title: 'Meeting Rooms II', difficulty: 'Medium', pattern: 'Heap' },
      { id: 137, title: 'Minimum Interval to Include Each Query', difficulty: 'Hard', pattern: 'Intervals + Heap' }
    ]
  },
  'math-bit-manipulation': {
    name: 'Math & Bit Manipulation',
    problems: [
      { id: 138, title: 'Sum of Two Integers', difficulty: 'Medium', pattern: 'Bit Manipulation' },
      { id: 139, title: 'Reverse Bits', difficulty: 'Easy', pattern: 'Bit Manipulation' },
      { id: 140, title: 'Number of 1 Bits', difficulty: 'Easy', pattern: 'Bit Manipulation' },
      { id: 141, title: 'Counting Bits', difficulty: 'Easy', pattern: 'DP + Bit Manipulation' },
      { id: 142, title: 'Power of Two', difficulty: 'Easy', pattern: 'Bit Manipulation' },
      { id: 143, title: 'Missing Number', difficulty: 'Easy', pattern: 'Math / XOR' },
      { id: 144, title: 'Rotate Image', difficulty: 'Medium', pattern: 'Matrix Manipulation' },
      { id: 145, title: 'Pascals Triangle', difficulty: 'Easy', pattern: 'Math' },
      { id: 146, title: 'Valid Tic Tac Toe State', difficulty: 'Medium', pattern: 'Simulation' },
      { id: 147, title: 'Multiply Strings', difficulty: 'Medium', pattern: 'String Math' },
      { id: 148, title: 'Happy Number', difficulty: 'Easy', pattern: 'Hash Set / Floyd\'s Cycle' },
      { id: 149, title: 'Factorial Trailing Zeroes', difficulty: 'Medium', pattern: 'Math' },
      { id: 150, title: 'Excel Sheet Column Number', difficulty: 'Easy', pattern: 'Base Conversion' }
    ]
  }
};

// Generate default question.json template
function generateQuestionJSON(problem, categoryName) {
  return {
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    pattern: problem.pattern,
    description: `Problem description for ${problem.title}. This is a placeholder - please update with the actual problem description.`,
    patternExplanation: `Pattern explanation for ${problem.pattern}. This is a placeholder - please update with detailed pattern explanation.`,
    patternExplanationHinglish: `Hinglish mein pattern explanation for ${problem.pattern}. Yeh ek placeholder hai - please update karein with detailed explanation.`,
    examples: [
      {
        input: {},
        output: null,
        explanation: 'Example explanation placeholder.',
        explanationHinglish: 'Example explanation ka placeholder.'
      }
    ],
    complexity: {
      time: 'O(n) - Placeholder',
      space: 'O(n) - Placeholder'
    }
  };
}

// Generate default solution template
function generateSolutionJS(title) {
  return `// ${title}
// TODO: Implement the solution

function solution() {
  // Your code here
  return null;
}

// Example usage:
// console.log(solution());
`;
}

// Main function to generate all problems
export function generateAllProblems() {
  const basePath = path.join(__dirname, 'problems');
  
  Object.entries(problemsData).forEach(([categoryId, category]) => {
    const categoryPath = path.join(basePath, categoryId);
    
    // Ensure category directory exists
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }
    
    category.problems.forEach(problem => {
      const problemPath = path.join(categoryPath, `problem-${problem.id}`);
      
      // Create problem directory
      if (!fs.existsSync(problemPath)) {
        fs.mkdirSync(problemPath, { recursive: true });
      }
      
      // Generate question.json
      const questionPath = path.join(problemPath, 'question.json');
      if (!fs.existsSync(questionPath)) {
        const questionJSON = generateQuestionJSON(problem, category.name);
        fs.writeFileSync(questionPath, JSON.stringify(questionJSON, null, 2));
      }
      
      // Generate solution files
      const languages = [
        { ext: 'js', lang: 'javascript' },
        { ext: 'py', lang: 'python' },
        { ext: 'java', lang: 'java' },
        { ext: 'cpp', lang: 'cpp' },
        { ext: 'go', lang: 'go' }
      ];
      
      languages.forEach(({ ext, lang }) => {
        const solutionPath = path.join(problemPath, `solution.${ext}`);
        if (!fs.existsSync(solutionPath)) {
          const solutionCode = generateSolutionJS(problem.title);
          fs.writeFileSync(solutionPath, solutionCode);
        }
      });
    });
  });
  
  console.log('✅ All 150 problems generated successfully!');
}

// Export problems data for use in categoryConfig
export { problemsData };

