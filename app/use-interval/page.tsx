'use client';

import React, { useState } from 'react';

import { Timer, Play, Square, RotateCcw, Clock, Activity, Zap, TrendingUp, Pause } from 'lucide-react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useInterval from '@/hooks/useInterval';

export default function UseIntervalPage() {
  // Demo 1: Live Clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const clockInterval = useInterval(() => {
    setCurrentTime(new Date().toLocaleTimeString());
  }, 1000);

  // Demo 2: Data Polling Simulation
  const [apiData, setApiData] = useState({ users: 1250, orders: 85, revenue: 12450 });
  const [pollHistory, setPollHistory] = useState<typeof apiData[]>([]);
  const [pollCount, setPollCount] = useState(0);

  const apiPollingInterval = useInterval(() => {
    if (!apiData) return;

    const cycle = pollCount % 6;
    const userChanges = [2, -1, 3, -2, 1, -3];
    const orderChanges = [1, 2, -1, 3, -2, 1];
    const revenueChanges = [150, -75, 200, -100, 300, -125];

    const newData = {
      users: apiData.users + (userChanges[cycle] ?? 0),
      orders: apiData.orders + (orderChanges[cycle] ?? 0),
      revenue: apiData.revenue + (revenueChanges[cycle] ?? 0),
    };
    setApiData(newData);
    setPollHistory(prev => [...prev.slice(-4), newData]);
    setPollCount(prev => prev + 1);
  }, null);

  // Demo 3: Progress Animation
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const progressInterval = useInterval(() => {
    setProgress(prev => {
      const newProgress = prev + (direction * 2);
      if (newProgress >= 100) {
        setDirection(-1);
        return 100;
      }
      if (newProgress <= 0) {
        setDirection(1);
        return 0;
      }
      return newProgress;
    });
  }, null);

  // Demo 4: Custom Countdown
  const [countdown, setCountdown] = useState(60);
  const [customDelay, setCustomDelay] = useState(1000);
  const countdownInterval = useInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) {
        countdownInterval.stop();
        return 0;
      }
      return prev - 1;
    });
  }, null);

  // Demo 5: Multiple Timers
  const [timers, setTimers] = useState([
    { id: 1, name: 'Timer 1', count: 0, active: false },
    { id: 2, name: 'Timer 2', count: 0, active: false },
    { id: 3, name: 'Timer 3', count: 0, active: false },
  ]);

  // Individual interval hooks for each timer
  useInterval(() => {
    setTimers(prev => prev.map(t => t.id === 1 ? { ...t, count: t.count + 1 } : t));
  }, timers[0]?.active ? 1000 : null);

  useInterval(() => {
    setTimers(prev => prev.map(t => t.id === 2 ? { ...t, count: t.count + 1 } : t));
  }, timers[1]?.active ? 500 : null);

  useInterval(() => {
    setTimers(prev => prev.map(t => t.id === 3 ? { ...t, count: t.count + 1 } : t));
  }, timers[2]?.active ? 2000 : null);

  const toggleTimer = (id: number) => {
    setTimers(prev => prev.map(t =>
      t.id === id ? { ...t, active: !t.active } : t
    ));
  };

  const resetTimer = (id: number) => {
    setTimers(prev => prev.map(t =>
      t.id === id ? { ...t, count: 0, active: false } : t
    ));
  };

  // Handle custom delay changes
  const handleDelayChange = (value: string) => {
    const delay = parseInt(value) || 1000;
    setCustomDelay(delay);
  };

  return (
    <LayoutPage
      title="useInterval"
    >
      <div className="space-y-6">
        <Heading level={2}>Features</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Automatic Cleanup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Intervals are automatically cleared on unmount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Dynamic Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Start, stop, and reset intervals programmatically
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Active State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Track whether the interval is currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Stable References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Function references remain stable across renders
              </p>
            </CardContent>
          </Card>
        </div>

        <Heading level={2}>Interactive Examples</Heading>

        {/* Demo 1: Live Clock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Live Clock
            </CardTitle>
            <CardDescription>
              Real-time clock that updates every second
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentTime}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Status: <span className={clockInterval.isActive ? 'text-green-500' : 'text-red-500'}>
                  {clockInterval.isActive ? 'Running' : 'Stopped'}
                </span>
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={clockInterval.start}
                disabled={clockInterval.isActive}
                variant="neutral"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
              <Button
                onClick={clockInterval.stop}
                disabled={!clockInterval.isActive}
                variant="neutral"
                size="sm"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
              <Button
                onClick={clockInterval.reset}
                variant="neutral"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo 2: Data Polling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              API Data Polling
            </CardTitle>
            <CardDescription>
              Simulate real-time dashboard data updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{apiData.users}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{apiData.orders}</div>
                <div className="text-sm text-muted-foreground">Orders Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">${apiData.revenue}</div>
                <div className="text-sm text-muted-foreground">Revenue</div>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  apiPollingInterval.start();
                  setPollHistory([apiData]);
                }}
                disabled={apiPollingInterval.isActive}
                variant="neutral"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Polling (2s)
              </Button>
              <Button
                onClick={apiPollingInterval.stop}
                disabled={!apiPollingInterval.isActive}
                variant="neutral"
                size="sm"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop Polling
              </Button>
            </div>

            {pollHistory.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Recent Updates</h4>
                <div className="space-y-1 text-xs text-muted-foreground max-h-32 overflow-y-auto">
                  {pollHistory.map((data, index) => (
                    <div key={index} className="flex justify-between">
                      <span>Update {index + 1}:</span>
                      <span>{data.users} users, {data.orders} orders, ${data.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo 3: Progress Animation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Animated Progress
            </CardTitle>
            <CardDescription>
              Smooth progress bar animation using intervals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={progressInterval.start}
                disabled={progressInterval.isActive}
                variant="neutral"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Animate
              </Button>
              <Button
                onClick={progressInterval.stop}
                disabled={!progressInterval.isActive}
                variant="neutral"
                size="sm"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button
                onClick={() => {
                  progressInterval.stop();
                  setProgress(0);
                  setDirection(1);
                }}
                variant="neutral"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo 4: Custom Countdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Custom Countdown Timer
            </CardTitle>
            <CardDescription>
              Configurable countdown with custom intervals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold">
                {countdown.toString().padStart(2, '0')}
              </div>
              <p className="text-sm text-muted-foreground">
                {countdown === 0 ? 'Time\'s up!' : 'seconds remaining'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delay">Update Interval (ms)</Label>
              <Input
                id="delay"
                type="number"
                value={customDelay}
                onChange={(e) => handleDelayChange(e.target.value)}
                placeholder="1000"
                min="100"
                max="5000"
                step="100"
              />
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  countdownInterval.start();
                }}
                disabled={countdownInterval.isActive || countdown === 0}
                variant="neutral"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
              <Button
                onClick={countdownInterval.stop}
                disabled={!countdownInterval.isActive}
                variant="neutral"
                size="sm"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button
                onClick={() => {
                  countdownInterval.stop();
                  setCountdown(60);
                }}
                variant="neutral"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo 5: Multiple Timers */}
        <Card>
          <CardHeader>
            <CardTitle>Multiple Independent Timers</CardTitle>
            <CardDescription>
              Manage multiple intervals with different frequencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timer</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timers.map((timer) => (
                  <TableRow key={timer.id}>
                    <TableCell className="font-medium">{timer.name}</TableCell>
                    <TableCell>{timer.count}</TableCell>
                    <TableCell>
                      {timer.id === 1 ? '1s' : timer.id === 2 ? '0.5s' : '2s'}
                    </TableCell>
                    <TableCell>
                      <span className={timer.active ? 'text-green-500' : 'text-red-500'}>
                        {timer.active ? 'Running' : 'Stopped'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="neutral"
                          onClick={() => toggleTimer(timer.id)}
                        >
                          {timer.active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="neutral"
                          onClick={() => resetTimer(timer.id)}
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Heading level={2}>Usage</Heading>

        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock
              code={`import useInterval from '@/hooks/useInterval'

function Timer() {
  const [count, setCount] = useState(0)

  const { start, stop, reset, isActive } = useInterval(() => {
    setCount(prev => prev + 1)
  }, 1000)

  return (
    <div>
      <p>Count: {count}</p>
      <p>Status: {isActive ? 'Running' : 'Stopped'}</p>

      <button onClick={start} disabled={isActive}>
        Start
      </button>
      <button onClick={stop} disabled={!isActive}>
        Stop
      </button>
      <button onClick={reset}>
        Reset
      </button>
    </div>
  )
}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code>callback</code></TableCell>
                  <TableCell><code>() =&gt; void</code></TableCell>
                  <TableCell>Function to execute on each interval</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>delay</code></TableCell>
                  <TableCell><code>number | null</code></TableCell>
                  <TableCell>Delay in milliseconds (null pauses the interval)</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Returns</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell><code>start</code></TableCell>
                    <TableCell><code>() =&gt; void</code></TableCell>
                    <TableCell>Manually start the interval</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>stop</code></TableCell>
                    <TableCell><code>() =&gt; void</code></TableCell>
                    <TableCell>Stop the interval</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>reset</code></TableCell>
                    <TableCell><code>() =&gt; void</code></TableCell>
                    <TableCell>Reset and restart the interval</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>isActive</code></TableCell>
                    <TableCell><code>boolean</code></TableCell>
                    <TableCell>Whether the interval is currently running</TableCell>
                  </TableRow>
                </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutPage>
  );
}