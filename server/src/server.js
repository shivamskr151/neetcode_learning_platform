// Server entry point
import app from './app.js';
import { PORT } from './config/environment.js';

app.listen(PORT, () => {
  console.log(`🚀 Compiler API server running on http://localhost:${PORT}`);
  console.log(`📝 Supported languages: Java, C++, Go`);
});

