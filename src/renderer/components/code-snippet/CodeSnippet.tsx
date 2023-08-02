import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CodeSnippetsContext } from 'renderer/contexts/CodeSnippetsContext';
import { FaHome, FaTrash, FaSave } from 'react-icons/fa';
import AceEditor from "react-ace";
import { TCodeSnippet } from 'main/main';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import './CodeSnippet.scss';

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
    if (codeSnippetId && codeSnippetId.length === 36) {
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

  let supportedLangs = ['text', 'javascript', 'typescript', 'python', 'css'];

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
        defaultValue={'text'}
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
      <AceEditor
        className='code-snippet-code'
        theme='monokai'
        mode={snippetType}
        name={codeSnippetId}
        onChange={(val: string) => setSnippetCode(val)}
        value={snippetCode}
        wrapEnabled
        showGutter
        highlightActiveLine
        fontSize={24}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
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