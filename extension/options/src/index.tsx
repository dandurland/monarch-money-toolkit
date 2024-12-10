import '@extension/ui/dist/global.css';
import '@src/index.css';
import { createRoot } from 'react-dom/client';
import Options from '@src/options';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }

  const root = createRoot(appContainer);
  root.render(<Options />);
}

init();
