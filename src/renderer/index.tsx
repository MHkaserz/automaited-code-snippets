import { createRoot } from 'react-dom/client';
import { CodeSnippetsContextProvider } from './contexts/CodeSnippetsContext';
import App from './App';

import './index.scss';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <CodeSnippetsContextProvider>
    <App />
  </CodeSnippetsContextProvider>
);
