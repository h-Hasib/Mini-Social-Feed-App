// src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEMES, ThemeKey } from "@/constants/colors";

type ThemeContextType = {
  themeName: ThemeKey;
  theme: typeof THEMES[ThemeKey];
  themes: typeof THEMES;
  setThemeName: (k: ThemeKey) => void;
};


const ThemeContext = createContext<ThemeContextType>({
  themeName: "coffee",
  theme: THEMES.coffee,
  themes: THEMES,
  setThemeName: () => {},
});

export const ThemeProvider = ({ children }: any) => {
  const [themeName, setThemeNameState] = useState<ThemeKey>("coffee");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("active_theme");
      if (saved && Object.keys(THEMES).includes(saved)) {
        setThemeNameState(saved as ThemeKey);
      }
    })();
  }, []);

  const setThemeName = async (k: ThemeKey) => {
    if (!THEMES[k]) return;
    setThemeNameState(k);
    await AsyncStorage.setItem("active_theme", k);
  };


  return (
    <ThemeContext.Provider
      value={{ themeName, themes: THEMES, theme: THEMES[themeName], setThemeName }}
    >
      {children}
    </ThemeContext.Provider>

  );
};

export const useTheme = () => useContext(ThemeContext);