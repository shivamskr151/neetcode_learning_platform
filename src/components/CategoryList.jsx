import { Link, useParams } from 'react-router-dom';
import { categories, getCategoryById } from '../data/problems';

function CategoryList() {
  const { categoryId } = useParams();
  const selectedCategory = categoryId ? getCategoryById(categoryId) : null;
  const displayCategories = selectedCategory ? [selectedCategory] : categories;

  return (
    <div>
      {!selectedCategory && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">📚 Categories</h2>
          <p className="text-gray-400 mb-6">
            Select a category to start practicing problems. Each problem includes pattern explanation, examples, and a code playground.
          </p>
        </div>
      )}

      {selectedCategory && (
        <div className="mb-6">
          <Link 
            to="/" 
            className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to Categories
          </Link>
          <h2 className="text-3xl font-bold mt-4">{selectedCategory.name}</h2>
        </div>
      )}

      <div className="grid gap-6">
        {displayCategories.map(category => (
          <div key={category.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              {category.name}
            </h3>
            <div className="grid gap-3">
              {category.problems.map(problem => (
                <Link
                  key={problem.id}
                  to={`/problem/${problem.id}`}
                  className="block bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition-colors border border-gray-600 hover:border-blue-500"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-mono text-sm">
                        #{problem.id}
                      </span>
                      <span className="font-medium">{problem.title}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        problem.difficulty === 'Easy' ? 'bg-green-600' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {problem.pattern}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;

