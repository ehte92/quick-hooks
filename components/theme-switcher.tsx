'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Button
        size="icon"
        className="fixed right-10 top-10 z-50"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        <Sun className="stroke-text hidden h-6 w-6 w500:h-4 w500:w-4 dark:inline" />
        <Moon className="stroke-text inline h-6 w-6 w500:h-4 w500:w-4 dark:hidden" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}
