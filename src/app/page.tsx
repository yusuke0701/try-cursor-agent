'use client';

import { useState, useEffect } from 'react';
import { Theme, themePresets } from './types/theme';
import TodoList from './components/TodoList';

export default function Home() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <main className={`min-h-screen p-8 transition-colors duration-300 ${themePresets[theme].background}`}>
      <div className="flex justify-end mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'light' ? themePresets[theme].themeButtonActive : themePresets[theme].themeButton
            }`}
          >
            ライト
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'dark' ? themePresets[theme].themeButtonActive : themePresets[theme].themeButton
            }`}
          >
            ダーク
          </button>
          <button
            onClick={() => setTheme('blue')}
            className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'blue' ? themePresets[theme].themeButtonActive : themePresets[theme].themeButton
            }`}
          >
            ブルー
          </button>
          <button
            onClick={() => setTheme('green')}
            className={`px-3 py-1 rounded transition-colors duration-200 ${
              theme === 'green' ? themePresets[theme].themeButtonActive : themePresets[theme].themeButton
            }`}
          >
            グリーン
          </button>
        </div>
      </div>
      <TodoList theme={theme} />
    </main>
  );
}
