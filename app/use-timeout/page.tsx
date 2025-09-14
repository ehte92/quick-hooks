'use client';

import React, { useState } from 'react';

import { Timer, Play, Square, RotateCcw, Clock, Bell, Zap, Coffee, Pause } from 'lucide-react';

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
import useTimeout from '@/hooks/useTimeout';

export default function UseTimeoutPage() {
  // Demo 1: Simple Timer
  const [timerMessage, setTimerMessage] = useState('Timer not started');
  const timer1 = useTimeout(() => {
    setTimerMessage('Timer completed! 🎉');
  }, 3000);

  // Demo 2: Notification System
  const [notifications, setNotifications] = useState<string[]>([]);
  const addNotification = (message: string) => {
    const id = Date.now().toString();
    const notificationText = `${message} (${id})`;
    setNotifications(prev => [...prev, notificationText]);
  };

  const notification1 = useTimeout(() => {
    addNotification('Auto-save completed');
  }, 5000);

  const notification2 = useTimeout(() => {
    addNotification('Session will expire soon');
  }, null);

  // Demo 3: Auto-hide Messages
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('success');

  const autoHide = useTimeout(() => {
    setAlertMessage('');
  }, alertMessage ? 4000 : null);

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
  };

  // Demo 4: Debounced Search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useTimeout(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        const mockResults = [
          `useHover - Related to "${searchTerm}"`,
          `useClickOutside - Related to "${searchTerm}"`,
          `useToggle - Related to "${searchTerm}"`,
          `useTimeout - Related to "${searchTerm}"`,
        ].filter(result =>
          result.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, searchTerm ? 800 : null);

  // Demo 5: Countdown Timer
  const [countdown, setCountdown] = useState(10);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  const countdownTimer = useTimeout(() => {
    if (countdown > 1) {
      setCountdown(prev => prev - 1);
      countdownTimer.reset();
    } else {
      setCountdown(0);
      setIsCountdownActive(false);
      addNotification('Countdown finished!');
    }
  }, isCountdownActive && countdown > 0 ? 1000 : null);

  const startCountdown = () => {
    setCountdown(10);
    setIsCountdownActive(true);
  };

  const stopCountdown = () => {
    setIsCountdownActive(false);
    countdownTimer.stop();
  };

  const basicUsageCode = `import useTimeout from '@/hooks/useTimeout';

function Component() {
  const [message, setMessage] = useState('Waiting...');

  const { start, stop, reset } = useTimeout(() => {
    setMessage('Timeout completed!');
  }, 3000);

  return (
    <div>
      <p>{message}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`;

  const notificationCode = `function AutoNotification() {
  const [notifications, setNotifications] = useState([]);

  const { start, stop } = useTimeout(() => {
    setNotifications(prev => [...prev, 'Auto-save completed']);
  }, 30000); // 30 seconds

  return (
    <div>
      <button onClick={start}>Enable Auto-save</button>
      <button onClick={stop}>Disable Auto-save</button>
      {notifications.map((notif, idx) => (
        <div key={idx}>{notif}</div>
      ))}
    </div>
  );
}`;

  const debounceCode = `function DebouncedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const searchTimeout = useTimeout(() => {
    if (searchTerm) {
      // Perform search API call
      fetchSearchResults(searchTerm).then(setResults);
    } else {
      setResults([]);
    }
  }, searchTerm ? 500 : null);

  const handleSearch = (value) => {
    setSearchTerm(value);
    // Timeout will automatically restart on each change
  };

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {results.map(result => <div key={result.id}>{result.title}</div>)}
    </div>
  );
}`;

  return (
    <LayoutPage title="useTimeout">
      <p className="mt-1 mb-4 text-lg">
        A powerful hook for managing timeouts with automatic cleanup and control functions.
        Perfect for delayed actions, notifications, debouncing, and timed events.
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
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono">callback</TableCell>
            <TableCell className="font-mono">() =&gt; void</TableCell>
            <TableCell>Function to execute after the timeout</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">delay</TableCell>
            <TableCell className="font-mono">number | null</TableCell>
            <TableCell>Delay in milliseconds (null to pause the timeout)</TableCell>
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
            <TableCell className="font-mono">start</TableCell>
            <TableCell className="font-mono">() =&gt; void</TableCell>
            <TableCell>Manually start or restart the timeout</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">stop</TableCell>
            <TableCell className="font-mono">() =&gt; void</TableCell>
            <TableCell>Stop the timeout and prevent callback execution</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">reset</TableCell>
            <TableCell className="font-mono">() =&gt; void</TableCell>
            <TableCell>Reset the timeout (same as calling start)</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Interactive Demo */}
      <Heading className="mb-4">
        Interactive Demo
      </Heading>

      <div className="grid gap-6 mb-8">
        {/* Demo 1: Simple Timer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Basic Timer Control
            </CardTitle>
            <CardDescription>
              Simple timeout with manual start, stop, and reset controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-lg font-semibold">{timerMessage}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Timer will complete in 3 seconds after starting
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => {
                    setTimerMessage('Timer started...');
                    timer1.start();
                  }}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start
                </Button>
                <Button
                  onClick={() => {
                    setTimerMessage('Timer stopped');
                    timer1.stop();
                  }}
                  variant="neutral"
                  className="flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </Button>
                <Button
                  onClick={() => {
                    setTimerMessage('Timer reset and started...');
                    timer1.reset();
                  }}
                  variant="neutral"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 2: Notification System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Auto-Notifications
            </CardTitle>
            <CardDescription>
              Scheduled notifications and alerts with timeout management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="min-h-32 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-semibold mb-2">Notifications:</h4>
                {notifications.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 italic">No notifications yet</p>
                ) : (
                  <div className="space-y-1">
                    {notifications.slice(-5).map((notification, index) => (
                      <div key={index} className="text-sm p-2 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 rounded">
                        <Bell className="w-3 h-3 inline mr-1" />
                        {notification}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => {
                    notification1.start();
                    addNotification('Auto-save scheduled in 5 seconds');
                  }}
                  size="sm"
                >
                  Schedule Auto-save (5s)
                </Button>
                <Button
                  onClick={() => {
                    notification2.start();
                    addNotification('Session warning scheduled in 8 seconds');
                  }}
                  size="sm"
                  variant="neutral"
                >
                  Schedule Session Warning (8s)
                </Button>
                <Button
                  onClick={() => {
                    notification1.stop();
                    notification2.stop();
                  }}
                  size="sm"
                  variant="neutral"
                >
                  Cancel All
                </Button>
                <Button
                  onClick={() => setNotifications([])}
                  size="sm"
                  variant="neutral"
                >
                  Clear Notifications
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 3: Auto-hide Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Auto-Hide Alerts
            </CardTitle>
            <CardDescription>
              Messages that automatically disappear after a few seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertMessage && (
                <div className={`p-3 rounded-lg flex items-center justify-between ${
                  alertType === 'success' ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200' :
                  alertType === 'error' ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200' :
                  'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200'
                }`}>
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    {alertMessage}
                  </span>
                  <Button
                    size="sm"
                    variant="neutral"
                    onClick={() => {
                      setAlertMessage('');
                      autoHide.stop();
                    }}
                    className="text-xs"
                  >
                    ✕
                  </Button>
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => showAlert('Success! Operation completed.', 'success')}
                  size="sm"
                >
                  Show Success
                </Button>
                <Button
                  onClick={() => showAlert('Error! Something went wrong.', 'error')}
                  size="sm"
                  variant="neutral"
                >
                  Show Error
                </Button>
                <Button
                  onClick={() => showAlert('Info: This is an informational message.', 'info')}
                  size="sm"
                  variant="neutral"
                >
                  Show Info
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Messages automatically hide after 4 seconds
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo 4: Debounced Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Debounced Search
            </CardTitle>
            <CardDescription>
              Search that waits for user to stop typing before executing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Search Hooks:</Label>
                <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type to search..."
                  className="mt-1"
                />
              </div>
              <div className="min-h-24 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {isSearching ? (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Search Results:
                    </p>
                    {searchResults.map((result, index) => (
                      <div key={index} className="text-sm p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                        {result}
                      </div>
                    ))}
                  </div>
                ) : searchTerm ? (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    No results found for "{searchTerm}"
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Start typing to search...
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Search executes 800ms after you stop typing
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo 5: Countdown Timer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pause className="w-5 h-5" />
              Countdown Timer
            </CardTitle>
            <CardDescription>
              Recursive timeout for creating countdown functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg">
                <div className={`text-6xl font-bold mb-2 ${
                  countdown <= 3 && isCountdownActive ? 'text-red-500 animate-pulse' : 'text-purple-600 dark:text-purple-300'
                }`}>
                  {countdown}
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {isCountdownActive ? 'Counting down...' : countdown === 0 ? 'Finished!' : 'Ready to start'}
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={startCountdown}
                  disabled={isCountdownActive}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Countdown
                </Button>
                <Button
                  onClick={stopCountdown}
                  disabled={!isCountdownActive}
                  variant="neutral"
                  className="flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </Button>
                <Button
                  onClick={() => {
                    setCountdown(10);
                    setIsCountdownActive(false);
                    countdownTimer.stop();
                  }}
                  variant="neutral"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
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
            Auto-Notifications
          </Heading>
          <CodeBlock code={notificationCode} />
        </div>

        <div>
          <Heading className="mb-2">
            Debounced Search
          </Heading>
          <CodeBlock code={debounceCode} />
        </div>
      </div>

      {/* Features */}
      <Heading className="mb-4">
        Features
      </Heading>
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li>⏰ Precise timeout management with start, stop, and reset controls</li>
        <li>🧹 Automatic cleanup on component unmount</li>
        <li>🔄 Dynamic delay changes restart the timeout automatically</li>
        <li>⚡ Stable function references with <code>useCallback</code></li>
        <li>🎯 Perfect for debouncing, notifications, and timed actions</li>
        <li>🔧 TypeScript support with full type safety</li>
        <li>🪶 Lightweight with no external dependencies</li>
        <li>🛡️ Handles callback changes without restarting timers</li>
      </ul>
    </LayoutPage>
  );
}