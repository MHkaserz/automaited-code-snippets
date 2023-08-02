import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import CodeSnippet from './components/code-snippet/CodeSnippet';
import Dashboard from './components/dashboard/Dashboard';
import DraggableHeader from './components/draggable-header/DraggableHeader';

import './App.scss';

export default function App() {
  return (
    <div className='App'>
      <Router>
        <DraggableHeader />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/code-snippets/:codeSnippetId"
            element={<CodeSnippet />}
          />
        </Routes>
      </Router>
    </div>
  );
}
