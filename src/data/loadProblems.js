// Load problems from folder structure

const categoryConfig = {
  'arrays-hashing': {
    id: 'arrays-hashing',
    name: 'Arrays & Hashing',
    problems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  },
  'two-pointers': {
    id: 'two-pointers',
    name: 'Two Pointers',
    problems: [17, 18, 19, 20, 21]
  },
  'sliding-window': {
    id: 'sliding-window',
    name: 'Sliding Window',
    problems: [22, 23, 24, 25, 26, 27]
  },
  'stack': {
    id: 'stack',
    name: 'Stack',
    problems: [28, 29, 30, 31, 32, 33]
  },
  'binary-search': {
    id: 'binary-search',
    name: 'Binary Search',
    problems: [34, 35, 36, 37, 38, 39, 40, 41, 42]
  },
  'linked-list': {
    id: 'linked-list',
    name: 'Linked List',
    problems: [43, 44, 45, 46, 47, 48, 49, 50]
  },
  'trees': {
    id: 'trees',
    name: 'Trees',
    problems: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64]
  },
  'tries': {
    id: 'tries',
    name: 'Tries',
    problems: [65, 66, 67, 68]
  },
  'heap-priority-queue': {
    id: 'heap-priority-queue',
    name: 'Heap / Priority Queue',
    problems: [69, 70, 71, 72, 73, 74]
  },
  'backtracking': {
    id: 'backtracking',
    name: 'Backtracking',
    problems: [75, 76, 77, 78, 79, 80, 81, 82]
  },
  'graphs': {
    id: 'graphs',
    name: 'Graphs',
    problems: [83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98]
  },
  'advanced-graphs': {
    id: 'advanced-graphs',
    name: 'Advanced Graphs',
    problems: [99, 100, 101, 102, 103, 104]
  },
  'dp-1d': {
    id: 'dp-1d',
    name: 'Dynamic Programming 1D',
    problems: [105, 106, 107, 108, 109, 110, 111, 112, 113, 114]
  },
  'dp-2d': {
    id: 'dp-2d',
    name: 'Dynamic Programming 2D',
    problems: [115, 116, 117, 118, 119, 120, 121, 122, 123, 124]
  },
  'greedy': {
    id: 'greedy',
    name: 'Greedy',
    problems: [125, 126, 127, 128, 129, 130, 131]
  },
  'intervals': {
    id: 'intervals',
    name: 'Intervals',
    problems: [132, 133, 134, 135, 136, 137]
  },
  'math-bit-manipulation': {
    id: 'math-bit-manipulation',
    name: 'Math & Bit Manipulation',
    problems: [138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150]
  }
};

// Load a single problem from folder structure
async function loadProblem(categoryId, problemId) {
  try {
    // Load question.json
    const questionResponse = await fetch(`/src/data/problems/${categoryId}/problem-${problemId}/question.json`);
    if (!questionResponse.ok) {
      return null;
    }
    const question = await questionResponse.json();
    
    // Load solutions for all languages
    const languages = ['javascript', 'python', 'java', 'cpp', 'go'];
    const solutionPromises = languages.map(async (lang) => {
      const ext = lang === 'javascript' ? 'js' : 
                   lang === 'python' ? 'py' : 
                   lang === 'java' ? 'java' : 
                   lang === 'cpp' ? 'cpp' : 'go';
      
      try {
        const solutionResponse = await fetch(`/src/data/problems/${categoryId}/problem-${problemId}/solution.${ext}`);
        if (solutionResponse.ok) {
          const code = await solutionResponse.text();
          return { [lang]: code };
        }
      } catch (e) {
        // Solution file doesn't exist for this language
      }
      return { [lang]: '' };
    });
    
    const solutions = await Promise.all(solutionPromises);
    const solutionObj = Object.assign({}, ...solutions);
    
    return {
      ...question,
      solution: solutionObj,
      categoryId,
      categoryName: categoryConfig[categoryId]?.name || categoryId
    };
  } catch (error) {
    console.error(`Error loading problem ${problemId} from ${categoryId}:`, error);
    return null;
  }
}

// Load all problems for a category
async function loadCategory(categoryId) {
  const category = categoryConfig[categoryId];
  if (!category) return null;
  
  const problemPromises = category.problems.map(id => loadProblem(categoryId, id));
  const problems = (await Promise.all(problemPromises)).filter(p => p !== null);
  
  return {
    ...category,
    problems
  };
}

// Load all categories
export async function loadAllCategories() {
  const categoryPromises = Object.keys(categoryConfig).map(id => loadCategory(id));
  return (await Promise.all(categoryPromises)).filter(c => c !== null);
}

// Get a single problem by ID
export async function getProblemById(problemId) {
  for (const [categoryId, category] of Object.entries(categoryConfig)) {
    if (category.problems.includes(problemId)) {
      return await loadProblem(categoryId, problemId);
    }
  }
  return null;
}

// Get category by ID
export function getCategoryById(categoryId) {
  return categoryConfig[categoryId] || null;
}

// For now, we'll use a hybrid approach - load from files when available, fallback to static data
// This allows gradual migration
export { categoryConfig };

