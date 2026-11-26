import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [stored, setStored] = useLocalStorage('ltw_bongda_theme', 'light');
  const theme = stored === 'dark' ? 'dark' : 'light';

  const toggleTheme = useCallback(
    () => setStored((t) => (t === 'dark' ? 'light' : 'dark')),
    [setStored]
  );

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useTheme phải dùng bên trong ThemeProvider');
  }
  return ctx;
};