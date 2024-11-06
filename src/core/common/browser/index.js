export const getBrowser = () => {
    if (typeof browser !== 'undefined') {
      return browser;
    }
  
    if (typeof chrome !== 'undefined') {
      return chrome;
    }

    return null;
  };