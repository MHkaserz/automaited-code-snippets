import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CodeEditor from 'react-simple-code-editor';
import { CodeSnippetsContext } from 'renderer/contexts/CodeSnippetsContext';
import { FaHome, FaTrash, FaSave } from 'react-icons/fa';

const { highlight, languages } = require('prismjs/components/prism-core');
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

import 'prismjs/themes/prism.css';
import './CodeSnippet.scss';
import { TCodeSnippet } from 'main/main';

export default function CodeSnippet() {
  const navigate = useNavigate();
  const { getCodeSnippet, updateCodeSnippet, removeCodeSnippet } = useContext(
    CodeSnippetsContext
  );

  const { codeSnippetId } = useParams();
  const [snippetTitle, setSnippetTitle] = useState<string>('');
  const [snippetType, setSnippetType] = useState<string>('');
  const [snippetCode, setSnippetCode] = useState<string>('');
  const [snippetDesc, setSnippetDesc] = useState<string>('');

  useEffect(() => {
    if (codeSnippetId) {
      const storedSnippet = getCodeSnippet(codeSnippetId);
      if (storedSnippet === undefined) {
        navigate('/');
      } else {
        setSnippetTitle(storedSnippet.title);
        setSnippetType(storedSnippet.type);
        setSnippetCode(storedSnippet.code);
        setSnippetDesc(storedSnippet.desc);
      }
    } else {
      navigate('/');
    }
  }, []);

  const prepareSnippet = (): TCodeSnippet => {
    return {
      id: codeSnippetId as string,
      title: snippetTitle,
      type: snippetType,
      code: snippetCode,
      desc: snippetDesc
    }
  }

  // auto-save once the user is done inputting for 5 seconds
  let timerId: NodeJS.Timeout;
  const debounceDelay = 5000;

  useEffect(() => {
    timerId = setTimeout(() => {
      updateCodeSnippet(prepareSnippet ());
    }, debounceDelay);

    return () => {
      clearTimeout(timerId);
    };
  }, [snippetTitle, snippetType, snippetCode, snippetDesc]);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const { value } = event.currentTarget;
    setter(value);
  };

  const handleSetCodeSnippet = () => {
    updateCodeSnippet(prepareSnippet ());
    clearTimeout(timerId);
  }
  
  const handleDelCodeSnippet = () => {
    removeCodeSnippet(prepareSnippet ());
    navigate('/');
  }

  let supportedLangs = ['javascript', 'typescript', 'python', 'css'];

  return (
    <div className='code-snippet-container'>
      <Link className='code-snippet-back' to={'/'}>
        <FaHome size={40} fill='var(--prim-def-col-fg)' />
      </Link>
      <input
        value={snippetTitle}
        type='text'
        className='code-snippet-title'
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleValueChange(event, setSnippetTitle)}
      />
      <select 
        value={snippetType}
        className='code-snippet-select'
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleValueChange(event, setSnippetType )}
      >
        {supportedLangs.map(
          (lang: string, langIdx: number) =>
          <option key={`${lang}_-_${langIdx}`} value={lang}>
            {lang.length > 3 ? lang.charAt(0).toUpperCase() + lang.slice(1) : lang.toUpperCase() }
          </option>
        )}
      </select>
      <div className='code-snippet-actions'>
        <FaSave  className='delete-icon' size={40} fill='var(--notify)' onClick={() => handleSetCodeSnippet ()} />
        <FaTrash className='save-icon'   size={35} fill='var(--err)'    onClick={() => handleDelCodeSnippet ()} />
      </div>
      <CodeEditor
        className='code-snippet-code'
        value={snippetCode}
        onValueChange={(newCode: string) => setSnippetCode(newCode)}
        highlight={(code: string) => highlight(code, languages.js)}
        padding={20}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 24,
        }}
      >
        {snippetCode}
      </CodeEditor>
      <div className="code-snippet-desc">
        <span>Description</span>
        <textarea
          value={snippetDesc}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleValueChange(event, setSnippetDesc)}
        />
      </div>
    </div>
  );
}