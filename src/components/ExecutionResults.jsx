function ExecutionResults({ result }) {
  if (!result) {
    return null;
  }
  
  if (!result.success) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-red-300">❌ Execution Error</h3>
        <pre className="text-red-200 whitespace-pre-wrap font-mono text-sm">{result.error || 'Unknown error occurred'}</pre>
        <div className="mt-4 text-sm text-red-300">
          <strong>Tips:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Make sure you're using JavaScript (not Go/Python/Java/C++)</li>
            <li>Check that your function is properly defined</li>
            <li>Enable Debug mode to see detailed error messages</li>
          </ul>
        </div>
      </div>
    );
  }

  const allPassed = result.results.every(r => r.passed);
  const passedCount = result.results.filter(r => r.passed).length;
  const totalCount = result.results.length;

  return (
    <div className={`rounded-lg p-6 border ${
      allPassed 
        ? 'bg-green-900/30 border-green-700' 
        : 'bg-yellow-900/30 border-yellow-700'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {allPassed ? '✅ All Tests Passed!' : '⚠️ Some Tests Failed'}
        </h3>
        <span className="text-sm">
          {passedCount} / {totalCount} passed
        </span>
      </div>

      <div className="space-y-4">
        {result.results.map((testResult, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-4 border ${
              testResult.passed
                ? 'bg-green-900/20 border-green-600'
                : 'bg-red-900/20 border-red-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-lg ${testResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                {testResult.passed ? '✓' : '✗'}
              </span>
              <span className="font-semibold">Test Case {testResult.example}</span>
            </div>

            {testResult.error ? (
              <div className="text-red-300 text-sm">
                <strong>Error:</strong> {testResult.error}
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <span className="text-gray-400 text-sm">Input: </span>
                  <code className="text-green-400 text-sm">
                    {JSON.stringify(testResult.input)}
                  </code>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400 text-sm">Expected: </span>
                  <code className="text-yellow-400 text-sm">
                    {JSON.stringify(testResult.expected)}
                  </code>
                </div>
                <div className="mb-2">
                  <span className="text-gray-400 text-sm">Got: </span>
                  <code className={`text-sm ${
                    testResult.passed ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {JSON.stringify(testResult.actual)}
                  </code>
                </div>
                {testResult.explanation && (
                  <div className="mt-2 text-gray-300 text-sm italic">
                    {testResult.explanation}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExecutionResults;

