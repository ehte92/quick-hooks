'use client';

import React from 'react';

import { Star, Heart, ShoppingCart, Info, User, Settings, Home, ChevronDown } from 'lucide-react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/ui/heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useHover from '@/hooks/useHover';

export default function UseHoverPage() {
  // Demo 1: Tooltip hover
  const [tooltipRef, isTooltipHovered] = useHover<HTMLButtonElement>();

  // Demo 2: Card hover effects
  const [card1Ref, isCard1Hovered] = useHover<HTMLDivElement>();
  const [card2Ref, isCard2Hovered] = useHover<HTMLDivElement>();
  const [card3Ref, isCard3Hovered] = useHover<HTMLDivElement>();

  // Demo 3: Navigation menu hover
  const [nav1Ref, isNav1Hovered] = useHover<HTMLLIElement>();
  const [nav2Ref, isNav2Hovered] = useHover<HTMLLIElement>();
  const [nav3Ref, isNav3Hovered] = useHover<HTMLLIElement>();

  // Demo 4: Image hover overlay
  const [imageRef, isImageHovered] = useHover<HTMLDivElement>();

  // Demo 5: Interactive button states
  const [primaryBtnRef, isPrimaryBtnHovered] = useHover<HTMLButtonElement>();
  const [secondaryBtnRef, isSecondaryBtnHovered] = useHover<HTMLButtonElement>();

  const basicUsageCode = `import useHover from '@/hooks/useHover';

function Component() {
  const [ref, isHovered] = useHover<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={\`p-4 transition-colors \${
        isHovered ? 'bg-blue-100' : 'bg-gray-100'
      }\`}
    >
      {isHovered ? 'Hovered!' : 'Hover me'}
    </div>
  );
}`;

  const tooltipCode = `function TooltipButton() {
  const [ref, isHovered] = useHover<HTMLButtonElement>();

  return (
    <div className="relative">
      <button ref={ref} className="px-4 py-2 bg-blue-500 text-white rounded">
        Hover for tooltip
      </button>
      {isHovered && (
        <div className="absolute top-full mt-2 px-2 py-1 bg-gray-800 text-white text-sm rounded">
          This is a tooltip!
        </div>
      )}
    </div>
  );
}`;

  const cardHoverCode = `function HoverCard() {
  const [ref, isHovered] = useHover<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={\`p-6 border rounded-lg transition-all duration-200 \${
        isHovered
          ? 'shadow-lg scale-105 border-blue-500'
          : 'shadow-md border-gray-200'
      }\`}
    >
      <h3 className="font-semibold">Hover Card</h3>
      <p className="text-gray-600">
        {isHovered ? 'Thanks for hovering!' : 'Hover me for effects'}
      </p>
    </div>
  );
}`;

  return (
    <LayoutPage title="useHover">
      <p className="mt-1 mb-4 text-lg">
        A performant hook for detecting hover state on DOM elements using callback refs.
        Perfect for tooltips, interactive cards, navigation menus, and hover effects.
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
            <TableCell className="font-mono">Generic T</TableCell>
            <TableCell className="font-mono">extends HTMLElement</TableCell>
            <TableCell className="font-mono">HTMLDivElement</TableCell>
            <TableCell>The type of HTML element to attach hover listeners to</TableCell>
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
            <TableCell className="font-mono">[0] ref</TableCell>
            <TableCell className="font-mono">(node: T | null) =&gt; void</TableCell>
            <TableCell>Callback ref to attach to the DOM element</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">[1] isHovered</TableCell>
            <TableCell className="font-mono">boolean</TableCell>
            <TableCell>Current hover state of the element</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Interactive Demo */}
      <Heading className="mb-4">
        Interactive Demo
      </Heading>

      <div className="grid gap-6 mb-8">
        {/* Demo 1: Tooltip Example */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Tooltip on Hover
            </CardTitle>
            <CardDescription>
              Show contextual information when hovering over elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="relative">
                <Button
                  ref={tooltipRef}
                  variant="neutral"
                  className="px-6 py-3"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Hover for info
                </Button>
                {isTooltipHovered && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10 whitespace-nowrap">
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    This is a helpful tooltip! ✨
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 2: Card Hover Effects */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Cards</CardTitle>
            <CardDescription>
              Cards with hover animations and state changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div
                ref={card1Ref}
                className={`p-6 border rounded-lg transition-all duration-200 cursor-pointer ${
                  isCard1Hovered
                    ? 'shadow-light dark:shadow-dark scale-105 border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'shadow-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <Star className={`w-8 h-8 mb-3 transition-colors ${
                  isCard1Hovered ? 'text-yellow-500' : 'text-gray-400'
                }`} />
                <h3 className="font-semibold mb-2">Premium Plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isCard1Hovered ? '🚀 Great choice!' : 'Best for professionals'}
                </p>
              </div>

              <div
                ref={card2Ref}
                className={`p-6 border rounded-lg transition-all duration-200 cursor-pointer ${
                  isCard2Hovered
                    ? 'shadow-light dark:shadow-dark scale-105 border-green-500 bg-green-50 dark:bg-green-950'
                    : 'shadow-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <Heart className={`w-8 h-8 mb-3 transition-colors ${
                  isCard2Hovered ? 'text-red-500' : 'text-gray-400'
                }`} />
                <h3 className="font-semibold mb-2">Popular</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isCard2Hovered ? '❤️ Most loved!' : 'Recommended option'}
                </p>
              </div>

              <div
                ref={card3Ref}
                className={`p-6 border rounded-lg transition-all duration-200 cursor-pointer ${
                  isCard3Hovered
                    ? 'shadow-light dark:shadow-dark scale-105 border-purple-500 bg-purple-50 dark:bg-purple-950'
                    : 'shadow-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <ShoppingCart className={`w-8 h-8 mb-3 transition-colors ${
                  isCard3Hovered ? 'text-purple-500' : 'text-gray-400'
                }`} />
                <h3 className="font-semibold mb-2">Enterprise</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isCard3Hovered ? '🏢 Perfect fit!' : 'For large teams'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 3: Navigation Menu Hover */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Menu</CardTitle>
            <CardDescription>
              Interactive navigation with hover states and dropdowns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <nav className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <ul className="flex space-x-1">
                <li ref={nav1Ref} className="relative">
                  <a
                    href="#"
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      isNav1Hovered
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </a>
                  {isNav1Hovered && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-10">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Analytics</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Recent</a>
                    </div>
                  )}
                </li>
                <li ref={nav2Ref} className="relative">
                  <a
                    href="#"
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      isNav2Hovered
                        ? 'bg-green-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </a>
                  {isNav2Hovered && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-10">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">View Profile</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Edit Profile</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Preferences</a>
                    </div>
                  )}
                </li>
                <li ref={nav3Ref}>
                  <a
                    href="#"
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      isNav3Hovered
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </CardContent>
        </Card>

        {/* Demo 4: Image Hover Overlay */}
        <Card>
          <CardHeader>
            <CardTitle>Image Hover Overlay</CardTitle>
            <CardDescription>
              Interactive image with overlay content on hover
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div
                ref={imageRef}
                className="relative w-80 h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-lg overflow-hidden cursor-pointer shadow-lg"
              >
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300 ${
                  isImageHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold mb-2">Beautiful Gradient</h3>
                    <p className="text-sm mb-4">Hover to see details</p>
                    <div className="space-x-2">
                      <Button size="sm" variant="neutral" className="bg-white text-gray-900 hover:bg-gray-100">
                        View
                      </Button>
                      <Button size="sm" variant="neutral" className="bg-transparent border border-white text-white hover:bg-white hover:text-gray-900">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
                <div className={`absolute bottom-4 left-4 text-white transition-opacity duration-300 ${
                  isImageHovered ? 'opacity-0' : 'opacity-100'
                }`}>
                  <p className="text-sm">Hover for actions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 5: Interactive Button States */}
        <Card>
          <CardHeader>
            <CardTitle>Dynamic Button States</CardTitle>
            <CardDescription>
              Buttons that change appearance and content based on hover state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4">
              <Button
                ref={primaryBtnRef}
                className={`px-6 py-3 transition-all duration-200 ${
                  isPrimaryBtnHovered
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-105 shadow-lg'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <Star className="w-4 h-4 mr-2" />
                {isPrimaryBtnHovered ? 'Click me now!' : 'Primary Action'}
              </Button>

              <Button
                ref={secondaryBtnRef}
                variant="neutral"
                className={`px-6 py-3 transition-all duration-200 border-2 ${
                  isSecondaryBtnHovered
                    ? 'border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 scale-105'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 transition-colors ${
                  isSecondaryBtnHovered ? 'text-red-500' : 'text-gray-500'
                }`} />
                {isSecondaryBtnHovered ? 'Much better!' : 'Secondary'}
              </Button>
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
            Tooltip Implementation
          </Heading>
          <CodeBlock code={tooltipCode} />
        </div>

        <div>
          <Heading className="mb-2">
            Interactive Card
          </Heading>
          <CodeBlock code={cardHoverCode} />
        </div>
      </div>

      {/* Features */}
      <Heading className="mb-4">
        Features
      </Heading>
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li>🎯 Uses callback refs for reliable event listener attachment</li>
        <li>⚡ Optimized with <code>useCallback</code> for stable function references</li>
        <li>🔧 TypeScript support with generic HTML element types</li>
        <li>🧹 Automatic cleanup when component unmounts</li>
        <li>📱 SSR compatible - no window dependencies</li>
        <li>🪶 Lightweight - no external dependencies</li>
        <li>🎨 Perfect for tooltips, cards, menus, and interactive UI</li>
      </ul>
    </LayoutPage>
  );
}