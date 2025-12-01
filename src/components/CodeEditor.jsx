import Editor from '@monaco-editor/react';

function CodeEditor({ language, value, onChange }) {
  const handleEditorChange = (newValue) => {
    onChange(newValue || '');
  };

  // Map language names to Monaco editor language IDs
  const languageMap = {
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    go: 'go'
  };

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden">
      <Editor
        height="400px"
        language={languageMap[language] || 'javascript'}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on'
        }}
      />
    </div>
  );
}

export default CodeEditor;

