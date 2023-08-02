import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CodeSnippetsContext } from 'renderer/contexts/CodeSnippetsContext';

import './CodeSnippet.scss';

export default function CodeSnippet() {
  const navigate = useNavigate();
  const { getCodeSnippet } = useContext(
    CodeSnippetsContext
  );

  const { codeSnippetId } = useParams();
  const [snippetCode, setSnippetCode] = useState<string>('');
  const [snippetDesc, setSnippetDesc] = useState<string>('');
  const [snippetTitle, setSnippetTitle] = useState<string>('');
  const [snippetType, setSnippetType] = useState<string>('');

  useEffect(() => {
    if (codeSnippetId) {
      const storedSnippet = getCodeSnippet(codeSnippetId);
      if (storedSnippet === undefined) {
        navigate('/');
      } else {
        setSnippetCode(storedSnippet.code);
        setSnippetDesc(storedSnippet.desc);
        setSnippetTitle(storedSnippet.title);
        setSnippetType(storedSnippet.type);
      }
    } else {
      navigate('/');
    }
  }, [])

  return (
    <div>
      <Link to={'/'}>home</Link>
      {snippetCode}{snippetDesc}{snippetTitle}{snippetType}
    </div>
  );
}