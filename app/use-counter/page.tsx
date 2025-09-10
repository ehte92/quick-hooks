'use client';

import React from 'react';

import { Minus, Plus, RotateCcw, Target, Volume2, VolumeX } from 'lucide-react';

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
import useCounter from '@/hooks/useCounter';

export default function UseCounterPage() {
  // Demo 1: Basic counter
  const basicCounter = useCounter(0);
  
  // Demo 2: Counter with boundaries
  const boundedCounter = useCounter(5, { min: 0, max: 10 });
  
  // Demo 3: Counter with custom step
  const stepCounter = useCounter(0, { step: 5 });
  
  // Demo 4: Shopping cart quantity
  const cartCounter = useCounter(1, { min: 1, max: 99 });
  
  // Demo 5: Volume control
  const volumeCounter = useCounter(50, { min: 0, max: 100, step: 5 });
  
  // Demo 6: Score counter
  const scoreCounter = useCounter(0, { min: 0 });

  const basicUsageCode = `import useCounter from '@/hooks/useCounter';

function Component() {
  const { count, increment, decrement, reset, set } = useCounter(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
      <button onClick={() => set(10)}>Set to 10</button>
    </div>
  );
}`;

  const advancedUsageCode = `// Counter with boundaries and custom step
function QuantitySelector() {
  const { count, increment, decrement } = useCounter(1, {
    min: 1,    // Minimum quantity is 1
    max: 99,   // Maximum quantity is 99
    step: 1    // Increment/decrement by 1
  });

  return (
    <div className="flex items-center gap-2">
      <button onClick={decrement}>-</button>
      <span className="min-w-[3ch] text-center">{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}

// Volume control with larger steps
function VolumeControl() {
  const { count, increment, decrement, set } = useCounter(50, {
    min: 0,
    max: 100,
    step: 5
  });

  return (
    <div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={count}
        onChange={(e) => set(Number(e.target.value))}
      />
      <div>Volume: {count}%</div>
      <button onClick={() => set(0)}>Mute</button>
    </div>
  );
}`;

  return (
    <LayoutPage title="useCounter">
      <p className="mt-1 mb-4 text-lg">
        A powerful hook for managing numeric state with increment, decrement, boundaries, and custom step controls.
        Perfect for counters, quantity selectors, pagination, and any numeric input controls.
      </p>

      {/* API Documentation */}
      <Heading className="mb-4">
        API Reference
      </Heading>
      
      <Table className="mb-4">
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
            <TableCell className="font-mono">number</TableCell>
            <TableCell className="font-mono">0</TableCell>
            <TableCell>The initial counter value</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">options.min</TableCell>
            <TableCell className="font-mono">number</TableCell>
            <TableCell className="font-mono">undefined</TableCell>
            <TableCell>Minimum allowed value</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">options.max</TableCell>
            <TableCell className="font-mono">number</TableCell>
            <TableCell className="font-mono">undefined</TableCell>
            <TableCell>Maximum allowed value</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">options.step</TableCell>
            <TableCell className="font-mono">number</TableCell>
            <TableCell className="font-mono">1</TableCell>
            <TableCell>Increment/decrement step size</TableCell>
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
            <TableCell className="font-mono">count</TableCell>
            <TableCell className="font-mono">number</TableCell>
            <TableCell>Current counter value</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">increment</TableCell>
            <TableCell className="font-mono">() =&gt; void</TableCell>
            <TableCell>Increment by step (respects max boundary)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">decrement</TableCell>
            <TableCell className="font-mono">() =&gt; void</TableCell>
            <TableCell>Decrement by step (respects min boundary)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">reset</TableCell>
            <TableCell className="font-mono">() =&gt; void</TableCell>
            <TableCell>Reset to initial value</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">set</TableCell>
            <TableCell className="font-mono">(value: number) =&gt; void</TableCell>
            <TableCell>Set specific value (respects min/max boundaries)</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Interactive Demo */}
      <Heading className="mb-4">
        Interactive Demo
      </Heading>

      <div className="grid gap-6 mb-8">
        {/* Demo 1: Basic Counter */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Counter</CardTitle>
            <CardDescription>
              Simple counter with no boundaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-4">
                  {basicCounter.count}
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <Button onClick={basicCounter.decrement} variant="neutral">
                  <Minus className="w-4 h-4" />
                </Button>
                <Button onClick={basicCounter.increment}>
                  <Plus className="w-4 h-4" />
                </Button>
                <Button onClick={basicCounter.reset} variant="neutral">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 2: Bounded Counter */}
        <Card>
          <CardHeader>
            <CardTitle>Bounded Counter (0-10)</CardTitle>
            <CardDescription>
              Counter with minimum and maximum boundaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {boundedCounter.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  Range: 0 - 10
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-200"
                    style={{ width: `${(boundedCounter.count / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <Button 
                  onClick={boundedCounter.decrement} 
                  variant="neutral"
                  disabled={boundedCounter.count === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={boundedCounter.increment}
                  disabled={boundedCounter.count === 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button onClick={boundedCounter.reset} variant="neutral">
                  Reset
                </Button>
              </div>
              <div className="flex justify-center gap-1">
                <Button onClick={() => boundedCounter.set(0)} variant="neutral" size="sm">0</Button>
                <Button onClick={() => boundedCounter.set(5)} variant="neutral" size="sm">5</Button>
                <Button onClick={() => boundedCounter.set(10)} variant="neutral" size="sm">10</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 3: Step Counter */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Step Counter (+/-5)</CardTitle>
            <CardDescription>
              Counter that increments/decrements by 5
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-4">
                  {stepCounter.count}
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <Button onClick={stepCounter.decrement} variant="neutral">
                  <Minus className="w-4 h-4 mr-1" />
                  5
                </Button>
                <Button onClick={stepCounter.increment}>
                  <Plus className="w-4 h-4 mr-1" />
                  5
                </Button>
                <Button onClick={stepCounter.reset} variant="neutral">
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 4: Shopping Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🛒 Shopping Cart Quantity
            </CardTitle>
            <CardDescription>
              Product quantity selector (1-99 items)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded">
                <div>
                  <h4 className="font-medium">Premium Headphones</h4>
                  <p className="text-sm text-muted-foreground">$299.99 each</p>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="quantity" className="text-sm">Qty:</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={cartCounter.decrement} 
                      variant="neutral" 
                      size="sm"
                      disabled={cartCounter.count === 1}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input 
                      id="quantity"
                      type="number" 
                      value={cartCounter.count}
                      onChange={(e) => cartCounter.set(Number(e.target.value) || 1)}
                      className="w-16 text-center"
                      min={1}
                      max={99}
                    />
                    <Button 
                      onClick={cartCounter.increment} 
                      size="sm"
                      disabled={cartCounter.count === 99}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">
                  Total: ${(cartCounter.count * 299.99).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 5: Volume Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {volumeCounter.count === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              Volume Control
            </CardTitle>
            <CardDescription>
              Audio volume with 5-unit steps (0-100%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Volume: {volumeCounter.count}%</Label>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => volumeCounter.set(0)} 
                      variant={volumeCounter.count === 0 ? "default" : "neutral"}
                      size="sm"
                    >
                      <VolumeX className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => volumeCounter.set(100)} 
                      variant={volumeCounter.count === 100 ? "default" : "neutral"}
                      size="sm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Input
                  type="range"
                  value={volumeCounter.count}
                  onChange={(e) => volumeCounter.set(Number(e.target.value))}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between gap-2">
                  <Button 
                    onClick={volumeCounter.decrement} 
                    variant="neutral"
                    disabled={volumeCounter.count === 0}
                  >
                    <Minus className="w-4 h-4 mr-1" />
                    5
                  </Button>
                  <Button 
                    onClick={volumeCounter.increment}
                    disabled={volumeCounter.count === 100}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    5
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 6: Score Counter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Game Score
            </CardTitle>
            <CardDescription>
              Score counter with minimum boundary (no negative scores)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {scoreCounter.count.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">points</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => scoreCounter.set(scoreCounter.count + 10)} variant="neutral">
                  +10
                </Button>
                <Button onClick={() => scoreCounter.set(scoreCounter.count + 50)} variant="neutral">
                  +50
                </Button>
                <Button onClick={() => scoreCounter.set(scoreCounter.count + 100)}>
                  +100
                </Button>
                <Button onClick={() => scoreCounter.set(scoreCounter.count + 500)}>
                  +500
                </Button>
              </div>
              <div className="flex justify-center gap-2">
                <Button onClick={scoreCounter.reset} variant="destructive">
                  New Game
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
        <li>🔢 Full numeric state management with boundaries</li>
        <li>⚡ Increment/decrement with configurable step sizes</li>
        <li>🛡️ Automatic boundary enforcement (min/max values)</li>
        <li>🔄 Reset functionality to return to initial value</li>
        <li>🎯 Direct value setting with boundary validation</li>
        <li>⚡ Optimized with <code>useCallback</code> for stable function references</li>
        <li>📱 SSR compatible</li>
        <li>🔧 Full TypeScript support with type safety</li>
        <li>🪶 Lightweight - no dependencies</li>
      </ul>
    </LayoutPage>
  );
}