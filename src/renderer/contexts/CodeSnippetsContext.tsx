import { ReactNode, createContext, useEffect, useReducer } from 'react';
import { TCodeSnippet, TCodeSnippets } from 'main/main';

interface CodeSnippetsState extends TCodeSnippets {};

interface CodeSnippetsContextValue {
  codeSnippets: CodeSnippetsState;
  addCodeSnippet: (snippet: TCodeSnippet) => void;
  updateCodeSnippet: (snippet: TCodeSnippet) => void;
  removeCodeSnippet: (snippet: TCodeSnippet) => void;
  setCodeSnippets: (snippets: TCodeSnippets) => void;
  getCodeSnippet: (snippetId: string) => TCodeSnippet | undefined;
}

type CodeSnippetsAction =
  | { type: 'SET_CODE_SNIPPETS'; payload: TCodeSnippets }
  | { type: 'SET_CODE_SNIPPET';  payload: TCodeSnippet  }
  | { type: 'GET_CODE_SNIPPET';  payload: string        }
  | { type: 'RM_CODE_SNIPPET';   payload: string        };

const initialState = {}
export const CodeSnippetsContext = createContext<CodeSnippetsContextValue>({
  codeSnippets: initialState,
  addCodeSnippet: () => {},
  updateCodeSnippet: () => {},
  removeCodeSnippet: () => {},
  setCodeSnippets: () => {},
  getCodeSnippet: () => undefined
});

const codeSnippetsReducer = (state: CodeSnippetsState, action: CodeSnippetsAction): CodeSnippetsState => {
  switch (action.type) {
    case 'SET_CODE_SNIPPETS': {
      const tmpState = structuredClone(action.payload);
      return tmpState;
    }

    case 'SET_CODE_SNIPPET': {
      const tmpState = structuredClone(state);
      tmpState[action.payload.id] = action.payload;
      window.electron.ipcRenderer.sendMessage('save', tmpState);
      return tmpState;
    }

    case 'RM_CODE_SNIPPET': {
      const tmpState = structuredClone(state);
      delete tmpState[action.payload];
      window.electron.ipcRenderer.sendMessage('save', tmpState);
      return tmpState;
    }

    default:
      return state;
  }
};

interface CodeSnippetsContextProviderProps {
  children: ReactNode;
}

export const CodeSnippetsContextProvider = (props: CodeSnippetsContextProviderProps) => {
  const [state, dispatch] = useReducer(codeSnippetsReducer, initialState);

  function setCodeSnippets(snippets: TCodeSnippets) {
    dispatch({
      type: 'SET_CODE_SNIPPETS',
      payload: snippets
    });
  }

  function addCodeSnippet(snippet: TCodeSnippet) {
    dispatch({
      type: 'SET_CODE_SNIPPET',
      payload: snippet
    });
  }

  function updateCodeSnippet(snippet: TCodeSnippet) {
    dispatch({
      type: 'SET_CODE_SNIPPET',
      payload: snippet
    });
  }

  function removeCodeSnippet(snippet: TCodeSnippet) {
    dispatch({
      type: 'RM_CODE_SNIPPET',
      payload: snippet.id
    });
  }

  function getCodeSnippet(snippetId: string) {
    return state[snippetId];
  }

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('load-local-store');

    window.electron.ipcRenderer.on('load-local-store',
      (args: any) => { setCodeSnippets(args); }
    );

    window.electron.ipcRenderer.on('save',
      (args: any) => { console.log(args); }
    );

    // add auto save here
  }, []);

  return(
    <CodeSnippetsContext.Provider
      value = {{
        codeSnippets: state,
        addCodeSnippet,
        updateCodeSnippet,
        removeCodeSnippet,
        setCodeSnippets,
        getCodeSnippet
      }}
    > 
      {props.children} 
    </CodeSnippetsContext.Provider>
  )
}