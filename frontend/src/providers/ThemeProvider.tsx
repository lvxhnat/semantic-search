import * as React from "react";
import {
  createTheme,
  ThemeProvider as ThemeMUIProvider,
} from "@mui/material/styles";
import { FC, useEffect } from "react";
import { ThemeMode } from "../common/types";
import { useThemeStore } from "../store/theme";

interface ThemeProviderProps {
  modeTheme?: ThemeMode;
  children?: React.ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children, modeTheme }) => {
  const { mode, setMode } = useThemeStore();
  const themeMode = modeTheme || "light";
  const theme = createTheme((mode || themeMode) as any);

  useEffect(() => {
    setMode(themeMode);
  }, [setMode, themeMode]);

  return <ThemeMUIProvider theme={theme}>{children}</ThemeMUIProvider>;
};

export default ThemeProvider;
