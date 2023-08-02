
import { useContext, useEffect, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { CodeSnippetsContext } from 'renderer/contexts/CodeSnippetsContext';
import { TCodeSnippet } from 'main/main';
import { FaPlus, FaTrash, FaSearch } from 'react-icons/fa';

import './Dashboard.scss';

function AddCodeSnippet() {
  const navigate = useNavigate();
  const { addCodeSnippet } = useContext(
    CodeSnippetsContext
  );

  return (
    <div className='dashboard-card add-card' onClick={() => handleAddCodeSnippet(addCodeSnippet, navigate)}>
      <FaPlus size={80} />
    </div>
  );
}

export default function Dashboard() {
  const [ filter, setFilter ] = useState('');
  const [ curFilter, setCurFilter] = useState(filter);
  const { codeSnippets, removeCodeSnippet } = useContext(
    CodeSnippetsContext
  );
  
  let timerId: NodeJS.Timeout;
  const debounceDelay = 200;

  // Debounce the setCurFilter function using useMemo
  useEffect(() => {
    timerId = setTimeout(() => {
      setCurFilter(filter);
    }, debounceDelay);

    return () => {
      clearTimeout(timerId);
    };
  }, [filter]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setFilter(value);
  };

  return (
    <div className='dashboard'>
      <div className='dashboard-filter-area'>
        <input
          type='text'
          value={filter}
          className='dashboard-filter-input'
          onChange={handleFilterChange}
        />
        <FaSearch className='filter-icon' size={25} fill='var(--prim-def-col-fg)' />
      </div>
      <div className='dashboard-body'>
        <AddCodeSnippet />
        {Object.entries(codeSnippets).map(([key, codeSnippet]) => {
          if (curFilter.length && !codeSnippet.title.toLocaleLowerCase().includes(curFilter.toLocaleLowerCase())) return;
          return (
            <Link className='dashboard-card-container' to={`/code-snippets/${key}`} key={key}>
              <FaTrash
                className='card-delete-icon'
                size={30} fill='var(--err)'
                onClick={(event: React.MouseEvent<SVGElement>) => {
                  event.stopPropagation();
                  removeCodeSnippet(codeSnippet);
                }}
              />
              <div className='dashboard-card'>
                {codeSnippet.title}
              </div>
            </Link>
          );
        })}
      </div>
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