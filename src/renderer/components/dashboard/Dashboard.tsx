
import { useContext } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { CodeSnippetsContext } from 'renderer/contexts/CodeSnippetsContext';
import { TCodeSnippet } from 'main/main';

import './Dashboard.scss';

function AddCodeSnippet() {
  const navigate = useNavigate();
  const { addCodeSnippet } = useContext(
    CodeSnippetsContext
  );

  return (
    <div onClick={() => handleAddCodeSnippet(addCodeSnippet, navigate)}>
      +
    </div>
  );
}

export default function Dashboard() {
  const { codeSnippets } = useContext(
    CodeSnippetsContext
  );

  return (
    <div>
      <AddCodeSnippet />
      {Object.entries(codeSnippets).map(([key, codeSnippet]) => {
        return (
          <Link to={`/code-snippets/${key}`} key={key}>
            {codeSnippet.title}
          </Link>
        );
      })}
    </div>
  );
}

const handleAddCodeSnippet = (
  addCodeSnippet: (snippet: TCodeSnippet) => void,
  navigate: NavigateFunction
) => {
  const codeSnippetId: string = uuidv4();
  const newCodeSnippet: TCodeSnippet = {
    id: codeSnippetId,
    title: 'New Snippet',
    type: 'unset',
    code: '',
    desc: '',
  };

  addCodeSnippet(newCodeSnippet);
  navigate(`/code-snippets/${codeSnippetId}`);
}