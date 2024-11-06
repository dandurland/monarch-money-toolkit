import * as React from 'react';
import { faBug, faCog, faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getBrowser } from "toolkit/core/common/browser";
import { $Actions, $ActionsButton, $Header, $Popup } from './popup.sc';

export function Popup() {

  /*const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.title = `${name} Popup`;
    async function getTheme() {
      const theme = await toolkitStorage.getItem('theme');
      setIsDark(theme === 'dark');
    }

    if (!isDark) {
      getTheme();
  }
  }, []);*/


  const isDark = false;
  const { runtime, tabs } = getBrowser();
  const { version, name } = runtime.getManifest();

  return (
    <$Popup>
      <$Header>Monarch Money Toolkit</$Header>
      <$Actions>
        <$ActionsButton $color={"#32AAF0"} $ghost={isDark} onClick={() => {
          runtime.openOptionsPage();
        }}>
          <FontAwesomeIcon icon={faCog} /> <div>Open Settings</div>
        </$ActionsButton>
      </$Actions>
    </$Popup>
  );
}