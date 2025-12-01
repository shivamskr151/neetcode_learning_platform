function DebugConsole({ logs }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-orange-300">
          🐛 Debug Console
        </h3>
        <span className="text-xs text-gray-400">
          {logs.length} log{logs.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="bg-black rounded p-4 font-mono text-sm max-h-64 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500">
            <div>No debug output yet.</div>
            <div className="mt-2 text-xs">Add console.log() statements to your code to see debug output here.</div>
            <div className="mt-1 text-xs">Example: console.log('Debug:', variable);</div>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className={`mb-2 ${
                log.type === 'error' ? 'text-red-400' :
                log.type === 'success' ? 'text-green-400' :
                log.type === 'info' ? 'text-blue-400' :
                'text-gray-300'
              }`}
            >
              <span className="text-gray-500 mr-2">
                [{log.type.toUpperCase()}]
              </span>
              <span className="whitespace-pre-wrap">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DebugConsole;

