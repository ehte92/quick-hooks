'use client';

import React, { useState } from 'react';

import { Eye, EyeOff, Moon, Sun, Lock, Unlock } from 'lucide-react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useToggle from '@/hooks/useToggle';

export default function UseTogglePage() {
  // Demo 1: Basic toggle
  const [isVisible, toggleVisible] = useToggle(false);
  
  // Demo 2: Dark mode toggle
  const [isDarkMode, toggleDarkMode, setDarkMode] = useToggle(false);
  
  // Demo 3: Password visibility
  const [showPassword, togglePassword] = useToggle(false);
  const [password, setPassword] = useState('secretpassword');
  
  // Demo 4: Feature flag
  const [isFeatureEnabled, , setFeatureEnabled] = useToggle(false);
  

  const basicUsageCode = `import useToggle from '@/hooks/useToggle';

function Component() {
  const [isToggled, toggle, setValue] = useToggle(false);
  
  return (
    <div>
      <p>Status: {isToggled ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setValue(true)}>Set ON</button>
      <button onClick={() => setValue(false)}>Set OFF</button>
    </div>
  );
}`;

  const advancedUsageCode = `// Dark mode toggle with localStorage persistence
function DarkModeToggle() {
  const [isDark, toggleDark, setDark] = useToggle(
    typeof window !== 'undefined' ? 
    localStorage.getItem('dark-mode') === 'true' : false
  );

  useEffect(() => {
    localStorage.setItem('dark-mode', isDark.toString());
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <button onClick={toggleDark} className="p-2">
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}`;

  return (
    <LayoutPage title="useToggle">
      <p className="mt-1 mb-4 text-lg">
        A simple but essential hook for managing boolean state with toggle functionality.
        Perfect for modals, feature flags, dark mode, and any on/off states.
      </p>

      {/* API Documentation */}
      <Heading className="mb-4">
        API Reference
      </Heading>
      
      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead>Parameter</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono">initialValue</TableCell>
            <TableCell className="font-mono">boolean</TableCell>
            <TableCell className="font-mono">false</TableCell>
            <TableCell>The initial boolean value</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead>Returns</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono">[0] value</TableCell>
            <TableCell className="font-mono">boolean</TableCell>
            <TableCell>Current boolean state</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">[1] toggle</TableCell>
            <TableCell className="font-mono">() =&gt; void</TableCell>
            <TableCell>Function to toggle the current state</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">[2] setValue</TableCell>
            <TableCell className="font-mono">(value?: boolean) =&gt; void</TableCell>
            <TableCell>Function to set specific value or toggle if no argument</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Interactive Demo */}
      <Heading className="mb-4">
        Interactive Demo
      </Heading>

      <div className="grid gap-6 mb-8">
        {/* Demo 1: Basic Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              Basic Toggle
            </CardTitle>
            <CardDescription>
              Simple on/off state management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded">
                Status: <span className="font-bold">{isVisible ? 'VISIBLE' : 'HIDDEN'}</span>
                {isVisible && (
                  <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                    🎉 Content is now visible!
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={toggleVisible}>
                  Toggle ({isVisible ? 'Hide' : 'Show'})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 2: Dark Mode Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Theme Toggle
            </CardTitle>
            <CardDescription>
              Dark/Light mode switching with explicit controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`p-4 rounded transition-colors ${
                isDarkMode ? 'bg-gray-900 text-white' : 'bg-yellow-100 text-gray-900'
              }`}>
                Current theme: <span className="font-bold">{isDarkMode ? 'Dark' : 'Light'}</span>
                <div className="mt-2 text-sm opacity-75">
                  {isDarkMode ? '🌙 Night mode is easy on the eyes' : '☀️ Bright and cheerful!'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={toggleDarkMode} variant="neutral">
                  {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  Toggle Theme
                </Button>
                <Button onClick={() => setDarkMode(true)} variant={isDarkMode ? "default" : "neutral"}>
                  Dark
                </Button>
                <Button onClick={() => setDarkMode(false)} variant={!isDarkMode ? "default" : "neutral"}>
                  Light
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 3: Password Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {showPassword ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              Password Visibility
            </CardTitle>
            <CardDescription>
              Toggle password field visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="neutral"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={togglePassword}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Password is {showPassword ? 'visible' : 'hidden'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo 4: Feature Flag */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Flag</CardTitle>
            <CardDescription>
              Control feature availability with explicit enable/disable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded">
                <div className="flex items-center justify-between">
                  <span>Beta Feature</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    isFeatureEnabled 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {isFeatureEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                {isFeatureEnabled && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 rounded">
                    🚀 Beta feature is now active! You can use advanced functionality.
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setFeatureEnabled(true)} 
                  variant={isFeatureEnabled ? "default" : "neutral"}
                >
                  Enable Feature
                </Button>
                <Button 
                  onClick={() => setFeatureEnabled(false)}
                  variant={!isFeatureEnabled ? "default" : "neutral"}
                >
                  Disable Feature
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Examples */}
      <Heading className="mb-4">
        Usage Examples
      </Heading>

      <div className="space-y-6">
        <div>
          <Heading className="mb-2">
            Basic Usage
          </Heading>
          <CodeBlock code={basicUsageCode} />
        </div>

        <div>
          <Heading className="mb-2">
            Advanced Usage
          </Heading>
          <CodeBlock code={advancedUsageCode} />
        </div>
      </div>

      {/* Features */}
      <Heading className="mb-4">
        Features
      </Heading>
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li>🔄 Simple boolean state toggling</li>
        <li>🎯 Explicit value setting with <code>setValue(boolean)</code></li>
        <li>⚡ Optimized with <code>useCallback</code> for stable function references</li>
        <li>📱 SSR compatible</li>
        <li>🔧 TypeScript support with full type safety</li>
        <li>🪶 Lightweight - no dependencies</li>
      </ul>
    </LayoutPage>
  );
}