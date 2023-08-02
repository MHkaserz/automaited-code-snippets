import { AiOutlineClose, AiOutlineMinus } from 'react-icons/ai';

import './DraggableHeader.scss';

export default function DraggableHeader() {
  const minimizeWindow = () => {
    window.electron.ipcRenderer.sendMessage('minimize-app');
  };

  const closeWindow = () => {
    window.electron.ipcRenderer.sendMessage('exit-app');
  };

  return (
    <div className='draggable-header'>
      <div className='dragbar-title'>Automaited Code Snippets</div>
      <div className='dragbar-draggable'/>
      <div className='dragbar-actions'>
        <span className='icon-container minus-icon' onClick={() => minimizeWindow()}>
          <AiOutlineMinus fill='var(--prim-def-col-fg)' size={40} />
        </span>
        <span className='icon-container exit-icon' onClick={() => closeWindow()}>
          <AiOutlineClose fill='var(--err)' size={40} />
        </span>
      </div>
    </div>
  );
}