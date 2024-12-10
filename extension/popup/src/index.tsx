import '@extension/ui/dist/global.css';
import '@src/index.css';
import { createRoot } from 'react-dom/client';
import Popup from '@src/Popup';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(<Popup />);
}

init();
