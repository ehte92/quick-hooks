'use client';

import React, { useState, useRef, useEffect } from 'react';

import {
  MousePointer,
  Keyboard,
  Move,
  Volume2,
  Maximize2,
  Navigation,
  Zap,
  Target,
  Activity
} from 'lucide-react';

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
import useEventListener from '@/hooks/useEventListener';

export default function UseEventListenerPage() {
  // Demo 1: Mouse Position Tracking
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseTracking, setIsMouseTracking] = useState(true);

  useEventListener(
    'mousemove',
    (e: MouseEvent) => {
      if (isMouseTracking) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    },
    typeof window !== 'undefined' ? document : null
  );

  // Demo 2: Keyboard Shortcuts
  const [keyLog, setKeyLog] = useState<string[]>([]);
  const [lastKey, setLastKey] = useState<string>('');

  useEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const keyInfo = `${e.key} ${e.ctrlKey ? '+ Ctrl' : ''} ${e.shiftKey ? '+ Shift' : ''} ${e.altKey ? '+ Alt' : ''}`.trim();
      setLastKey(keyInfo);
      setKeyLog(prev => [keyInfo, ...prev].slice(0, 10));

      // Handle specific shortcuts
      if (e.key === 'Escape') {
        setKeyLog([]);
        setLastKey('');
      }
    },
    typeof window !== 'undefined' ? document : null
  );

  // Demo 3: Element-Specific Events
  const elementRef = useRef<HTMLDivElement>(null);
  const [elementEvents, setElementEvents] = useState<string[]>([]);

  const addElementEvent = (eventType: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setElementEvents(prev => [`${timestamp}: ${eventType}`, ...prev].slice(0, 8));
  };

  useEventListener('mouseenter', () => addElementEvent('Mouse entered'), elementRef);
  useEventListener('mouseleave', () => addElementEvent('Mouse left'), elementRef);
  useEventListener('click', () => addElementEvent('Clicked'), elementRef);
  useEventListener('dblclick', () => addElementEvent('Double clicked'), elementRef);

  // Demo 4: Window Events
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [scrollY, setScrollY] = useState(0);

  useEventListener('resize', () => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEventListener('scroll', () => {
    if (typeof window !== 'undefined') {
      setScrollY(window.scrollY);
    }
  });

  // Demo 5: Form Events with Dynamic Element
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formEvents, setFormEvents] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const logFormEvent = (event: string, field?: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const message = field ? `${event} on ${field}` : event;
    setFormEvents(prev => [`${timestamp}: ${message}`, ...prev].slice(0, 6));
  };

  useEventListener('submit', (e: Event) => {
    e.preventDefault();
    logFormEvent('Form submitted');
  }, formRef);

  useEventListener('reset', () => {
    logFormEvent('Form reset');
    setFormData({ name: '', email: '', message: '' });
  }, formRef);

  // Demo 6: Custom Drag and Drop
  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });
  const dragRef = useRef<HTMLDivElement>(null);

  useEventListener('mousedown', (e: MouseEvent) => {
    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
  }, dragRef);

  useEventListener('mousemove', (e: MouseEvent) => {
    if (dragState.isDragging) {
      setDragState(prev => ({
        ...prev,
        currentX: e.clientX,
        currentY: e.clientY,
      }));
    }
  });

  useEventListener('mouseup', () => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  });

  return (
    <LayoutPage
      title="useEventListener"
    >
      <div className="space-y-6">
        <Heading level={2}>Features</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Universal Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Works with DOM elements, Window, and Document
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Type Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Full TypeScript support with event type inference
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Auto Cleanup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Automatic event listener cleanup on unmount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                SSR Safe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Server-side rendering compatible
              </p>
            </CardContent>
          </Card>
        </div>

        <Heading level={2}>Interactive Examples</Heading>

        {/* Demo 1: Mouse Position Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Global Mouse Position Tracking
            </CardTitle>
            <CardDescription>
              Track mouse position across the entire document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">Position:</span> ({mousePosition.x}, {mousePosition.y})
              </div>
              <Button
                onClick={() => setIsMouseTracking(!isMouseTracking)}
                variant="neutral"
                size="sm"
              >
                {isMouseTracking ? 'Disable' : 'Enable'} Tracking
              </Button>
            </div>

            <div className="relative w-full h-32 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Move your mouse around the page
              </p>
              {isMouseTracking && (
                <div
                  className="absolute w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${(mousePosition.x / (typeof window !== 'undefined' ? window.innerWidth : 1000)) * 100}%`,
                    top: `${((mousePosition.y - (typeof window !== 'undefined' ? window.scrollY : 0)) / (typeof window !== 'undefined' ? window.innerHeight : 1000)) * 100}%`,
                  }}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Demo 2: Keyboard Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Event Monitoring
            </CardTitle>
            <CardDescription>
              Global keyboard event detection with modifiers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Last Key Pressed</Label>
                <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm">
                  {lastKey || 'Press any key...'}
                </div>
              </div>
              <div>
                <Label>Recent Keys (max 10)</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-xs space-y-1 h-24 overflow-y-auto">
                  {keyLog.length === 0 ? (
                    <div className="text-muted-foreground">No keys pressed yet</div>
                  ) : (
                    keyLog.map((key, index) => (
                      <div key={index} className="font-mono">
                        {key}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              💡 Try: Ctrl+Key, Shift+Key, Alt+Key combinations. Press Escape to clear the log.
            </div>
          </CardContent>
        </Card>

        {/* Demo 3: Element-Specific Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Element-Specific Events
            </CardTitle>
            <CardDescription>
              Events attached to a specific DOM element
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div
                  ref={elementRef}
                  className="h-32 bg-gradient-to-br from-green-100 to-blue-100 border-2 border-green-300 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="text-center">
                    <p className="font-medium">Interactive Zone</p>
                    <p className="text-sm text-muted-foreground">
                      Hover, click, or double-click me!
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Label>Element Events</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-xs space-y-1 h-32 overflow-y-auto">
                  {elementEvents.length === 0 ? (
                    <div className="text-muted-foreground">No events yet</div>
                  ) : (
                    elementEvents.map((event, index) => (
                      <div key={index} className="font-mono">
                        {event}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 4: Window Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Maximize2 className="h-5 w-5" />
              Window Events
            </CardTitle>
            <CardDescription>
              Monitor window resize, scroll, and network status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{windowSize.width} × {windowSize.height}</div>
                <div className="text-sm text-muted-foreground">Window Size</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{scrollY}px</div>
                <div className="text-sm text-muted-foreground">Scroll Position</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className={`text-2xl font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </div>
                <div className="text-sm text-muted-foreground">Network Status</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              💡 Try: Resize your window, scroll the page, or go offline to see changes
            </div>
          </CardContent>
        </Card>

        {/* Demo 5: Form Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Form Event Handling
            </CardTitle>
            <CardDescription>
              Monitor form submission and reset events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form ref={formRef} className="space-y-3">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      logFormEvent('Input changed', 'name');
                    }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      logFormEvent('Input changed', 'email');
                    }}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Submit</Button>
                  <Button type="reset" variant="neutral" size="sm">Reset</Button>
                </div>
              </form>

              <div>
                <Label>Form Events</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-xs space-y-1 h-32 overflow-y-auto">
                  {formEvents.length === 0 ? (
                    <div className="text-muted-foreground">No form events yet</div>
                  ) : (
                    formEvents.map((event, index) => (
                      <div key={index} className="font-mono">
                        {event}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 6: Drag and Drop */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Move className="h-5 w-5" />
              Mouse Drag Tracking
            </CardTitle>
            <CardDescription>
              Custom drag implementation using multiple event listeners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div
                  ref={dragRef}
                  className={`h-32 bg-gradient-to-br from-purple-100 to-pink-100 border-2 rounded-lg flex items-center justify-center cursor-move user-select-none ${
                    dragState.isDragging ? 'border-purple-500 scale-105' : 'border-purple-300'
                  } transition-all`}
                >
                  <div className="text-center">
                    <p className="font-medium">Draggable Element</p>
                    <p className="text-sm text-muted-foreground">
                      Click and drag me!
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Drag Status:</strong> {dragState.isDragging ? 'Dragging' : 'Idle'}
                </div>
                <div>
                  <strong>Start Position:</strong> ({dragState.startX}, {dragState.startY})
                </div>
                <div>
                  <strong>Current Position:</strong> ({dragState.currentX}, {dragState.currentY})
                </div>
                <div>
                  <strong>Distance:</strong> {Math.round(
                    Math.sqrt(
                      Math.pow(dragState.currentX - dragState.startX, 2) +
                      Math.pow(dragState.currentY - dragState.startY, 2)
                    )
                  )}px
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Heading level={2}>Usage</Heading>

        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock
              code={`import useEventListener from '@/hooks/useEventListener'
import { useRef } from 'react'

function Component() {
  const elementRef = useRef<HTMLDivElement>(null)

  // Listen to window events
  useEventListener('resize', (event) => {
    if (typeof window !== 'undefined') {
      console.log('Window resized:', window.innerWidth, window.innerHeight)
    }
  })

  // Listen to document events
  useEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      console.log('Escape pressed!')
    }
  }, document)

  // Listen to element events
  useEventListener('click', (event) => {
    console.log('Element clicked!')
  }, elementRef)

  // With options
  useEventListener('scroll', (event) => {
    console.log('Scrolled!')
  }, undefined, { passive: true })

  return <div ref={elementRef}>Click me!</div>
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
                  <TableCell><code>eventName</code></TableCell>
                  <TableCell><code>string</code></TableCell>
                  <TableCell>The event name to listen for</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>handler</code></TableCell>
                  <TableCell><code>(event) =&gt; void</code></TableCell>
                  <TableCell>Function to handle the event</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>element</code></TableCell>
                  <TableCell><code>RefObject | Element | null</code></TableCell>
                  <TableCell>Target element (defaults to window)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>options</code></TableCell>
                  <TableCell><code>boolean | AddEventListenerOptions</code></TableCell>
                  <TableCell>Event listener options (optional)</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Supported Targets</h4>
              <ul className="space-y-1 text-sm">
                <li><strong>Window:</strong> resize, scroll, online, offline, etc.</li>
                <li><strong>Document:</strong> keydown, keyup, click, DOMContentLoaded, etc.</li>
                <li><strong>HTMLElement:</strong> click, mouseenter, focus, input, etc.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutPage>
  );
}