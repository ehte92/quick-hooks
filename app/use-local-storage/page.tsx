'use client';

import React, { useState } from 'react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import { Button } from '@/components/ui/button';
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
import useLocalStorage from '@/hooks/useLocalStorage';

const LocalStorageComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [storedValue, setStoredValue] = useLocalStorage('myValue', '');

  // Save input to local storage and clear input field
  const handleSave = () => {
    setStoredValue(input);
    setInput('');
  };

  // Clear the stored value in local storage
  const handleClear = () => {
    setStoredValue('');
    window.localStorage.removeItem('myValue');
  };

  const code = `
import { useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

const LocalStorageComponent = () => {
  const [input, setInput] = useState('');
  const [storedValue, setStoredValue] = useLocalStorage('myValue', '');

  const handleSave = () => {
    setStoredValue(input);
    setInput('');
  };

  const handleClear = () => {
    setStoredValue('');
    window.localStorage.removeItem('myValue');
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)
        placeholder="Type something..."
      />
      <button onClick={handleSave}>Save to Local Storage</button>
      <button onClick={handleClear}>Clear Local Storage</button>
      <div>{storedValue || "No value saved yet!"}</div>
    </div>
  );
};

export default LocalStorageComponent;
        `;

  return (
    <LayoutPage title="useLocalStorage">
      <p className="mt-1 mb-4 text-lg">
        This hook facilitates storing, retrieving, and synchronizing data with
        the browser's localStorage.
      </p>

      <h2 className="text-2xl font-bold">Parameters and Return Values</h2>
      <Table className="table-auto w-full my-4 text-lg shadow-light dark:shadow-dark">
        <TableHeader>
          <TableRow>
            <TableHead className="border px-4 py-2">Parameter</TableHead>
            <TableHead className="border px-4 py-2">Type</TableHead>
            <TableHead className="border px-4 py-2">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border px-4 py-2">key</TableCell>
            <TableCell className="border px-4 py-2">string</TableCell>
            <TableCell className="border px-4 py-2">
              The key under which the value is stored in localStorage.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">initialValue</TableCell>
            <TableCell className="border px-4 py-2">any</TableCell>
            <TableCell className="border px-4 py-2">
              The initial value to use if there is no item in localStorage under
              the key.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="mb-4">
        <div className="flex items-center">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something..."
            className="p-2 mr-2 text-lg shadow-light dark:shadow-dark"
          />
          <Button onClick={handleSave} className="mr-2">
            Save to Local Storage
          </Button>
          <Button onClick={handleClear} variant="destructive">
            Clear Local Storage
          </Button>
        </div>
        <div className="text-lg mt-4">
          <strong>Stored Value:</strong> {storedValue || 'No value saved yet!'}
        </div>
      </div>

      <Heading className="mt-6">Example Usage</Heading>
      <CodeBlock code={code} />
    </LayoutPage>
  );
};

export default LocalStorageComponent;
