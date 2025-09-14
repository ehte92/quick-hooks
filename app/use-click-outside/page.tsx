'use client';

import React, { useState } from 'react';

import { X, Settings, Search, User, Bell, Menu, Filter, MoreVertical, Calendar, MessageCircle } from 'lucide-react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useClickOutside from '@/hooks/useClickOutside';

export default function UseClickOutsidePage() {
  // Demo 1: Modal/Dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useClickOutside<HTMLDivElement>(() => {
    setIsModalOpen(false);
  });

  // Demo 2: Dropdown Menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsDropdownOpen(false);
  });

  // Demo 3: Search Autocomplete
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useClickOutside<HTMLDivElement>(() => {
    setIsSearchOpen(false);
  });

  // Demo 4: Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useClickOutside<HTMLDivElement>(() => {
    setIsSidebarOpen(false);
  });

  // Demo 5: Context Menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const contextMenuRef = useClickOutside<HTMLDivElement>(() => {
    setContextMenu(null);
  });

  const searchResults = [
    'React Hook useClickOutside',
    'React Hook useHover',
    'React Hook useToggle',
    'React Hook useCounter',
    'React Hook useCopyToClipboard',
  ];

  const basicUsageCode = `import useClickOutside from '@/hooks/useClickOutside';

function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div ref={ref} className="bg-white p-6 rounded-lg">
            <h2>Modal Content</h2>
            <p>Click outside to close</p>
          </div>
        </div>
      )}
    </>
  );
}`;

  const dropdownCode = `function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded"
      >
        Menu ▼
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg">
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Logout</a>
        </div>
      )}
    </div>
  );
}`;

  const searchCode = `function SearchWithAutocomplete() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(e.target.value.length > 0);
        }}
        onFocus={() => setIsOpen(query.length > 0)}
        placeholder="Search..."
      />
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-b shadow-lg">
          {results.map((result, index) => (
            <div key={index} className="px-4 py-2 hover:bg-gray-100">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`;

  return (
    <LayoutPage title="useClickOutside">
      <p className="mt-1 mb-4 text-lg">
        A versatile hook for detecting clicks outside a specific element. Essential for modals,
        dropdowns, tooltips, and any UI that needs to close when clicking outside.
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
            <TableCell>Function to call when clicking outside the element</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">Generic T</TableCell>
            <TableCell className="font-mono">extends HTMLElement</TableCell>
            <TableCell>The type of HTML element to monitor (defaults to HTMLDivElement)</TableCell>
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
            <TableCell className="font-mono">ref</TableCell>
            <TableCell className="font-mono">RefObject&lt;T&gt;</TableCell>
            <TableCell>Ref to attach to the DOM element you want to monitor</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Interactive Demo */}
      <Heading className="mb-4">
        Interactive Demo
      </Heading>

      <div className="grid gap-6 mb-8">
        {/* Demo 1: Modal/Dialog */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <X className="w-5 h-5" />
              Modal Dialog
            </CardTitle>
            <CardDescription>
              Click outside the modal to close it automatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => setIsModalOpen(true)} className="px-6 py-3">
                Open Modal
              </Button>

              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div
                    ref={modalRef}
                    className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-light dark:shadow-dark max-w-md w-full mx-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">Modal Title</h3>
                      <Button
                        onClick={() => setIsModalOpen(false)}
                        variant="neutral"
                        size="sm"
                        className="p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      This modal will close when you click outside of it, or use the X button.
                      Try clicking anywhere in the background!
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="neutral" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsModalOpen(false)}>
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Demo 2: Dropdown Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoreVertical className="w-5 h-5" />
              Dropdown Menu
            </CardTitle>
            <CardDescription>
              User menu with options - closes when clicking outside
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="relative" ref={dropdownRef}>
                <Button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  variant="neutral"
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  User Menu
                  <MoreVertical className="w-4 h-4" />
                </Button>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-light dark:shadow-dark py-2 z-10">
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <User className="w-4 h-4 mr-3" />
                      View Profile
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Bell className="w-4 h-4 mr-3" />
                      Notifications
                    </a>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                      <X className="w-4 h-4 mr-3" />
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 3: Search Autocomplete */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Autocomplete
            </CardTitle>
            <CardDescription>
              Search with suggestions that disappear when clicking outside
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="relative" ref={searchRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(e.target.value.length > 0);
                    }}
                    onFocus={() => setIsSearchOpen(searchQuery.length > 0)}
                    placeholder="Search hooks..."
                    className="pl-10"
                  />
                </div>

                {isSearchOpen && searchQuery && (
                  <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-lg shadow-light dark:shadow-dark py-2 z-10">
                    {searchResults
                      .filter(result => result.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 5)
                      .map((result, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setSearchQuery(result);
                            setIsSearchOpen(false);
                          }}
                        >
                          <Search className="w-3 h-3 mr-2 inline" />
                          {result}
                        </div>
                      ))}
                    {searchResults.filter(result =>
                      result.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 4: Mobile Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="w-5 h-5" />
              Mobile Sidebar
            </CardTitle>
            <CardDescription>
              Slide-out navigation that closes when tapping outside
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2">
                <Menu className="w-4 h-4" />
                Open Sidebar
              </Button>

              {/* Overlay */}
              {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
                  {/* Sidebar */}
                  <div
                    ref={sidebarRef}
                    className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-light dark:shadow-dark transform transition-transform z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Navigation</h3>
                        <Button
                          onClick={() => setIsSidebarOpen(false)}
                          variant="neutral"
                          size="sm"
                          className="p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <nav className="p-4 space-y-2">
                      <a href="#" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <User className="w-5 h-5 mr-3" />
                        Profile
                      </a>
                      <a href="#" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Calendar className="w-5 h-5 mr-3" />
                        Calendar
                      </a>
                      <a href="#" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <MessageCircle className="w-5 h-5 mr-3" />
                        Messages
                      </a>
                      <a href="#" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Settings className="w-5 h-5 mr-3" />
                        Settings
                      </a>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Demo 5: Context Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Context Menu
            </CardTitle>
            <CardDescription>
              Right-click context menu that disappears when clicking elsewhere
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center cursor-context-menu relative"
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY });
              }}
            >
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Right-click anywhere in this area<br />
                to open context menu
              </p>

              {contextMenu && (
                <div
                  ref={contextMenuRef}
                  className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-light dark:shadow-dark py-2 z-50"
                  style={{
                    left: contextMenu.x,
                    top: contextMenu.y,
                  }}
                >
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <User className="w-4 h-4 mr-2 inline" />
                    View Details
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Settings className="w-4 h-4 mr-2 inline" />
                    Edit Properties
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                    <X className="w-4 h-4 mr-2 inline" />
                    Delete
                  </button>
                </div>
              )}
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
            Basic Modal
          </Heading>
          <CodeBlock code={basicUsageCode} />
        </div>

        <div>
          <Heading className="mb-2">
            Dropdown Menu
          </Heading>
          <CodeBlock code={dropdownCode} />
        </div>

        <div>
          <Heading className="mb-2">
            Search Autocomplete
          </Heading>
          <CodeBlock code={searchCode} />
        </div>
      </div>

      {/* Features */}
      <Heading className="mb-4">
        Features
      </Heading>
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li>🎯 Detects clicks outside specified elements with high precision</li>
        <li>🔧 TypeScript support with generic HTML element types</li>
        <li>🧹 Automatic event listener cleanup on unmount</li>
        <li>⚡ Uses mousedown events for immediate response</li>
        <li>🎨 Perfect for modals, dropdowns, tooltips, and overlays</li>
        <li>📱 Works with nested elements and event bubbling</li>
        <li>🪶 Lightweight with no external dependencies</li>
        <li>🔄 Handles callback changes efficiently</li>
      </ul>
    </LayoutPage>
  );
}