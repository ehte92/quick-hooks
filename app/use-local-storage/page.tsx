'use client';

import React, { useState } from 'react';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
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
  const router = useRouter();

  // Navigate back to the previous page
  const handleBack = () => {
    router.back();
  };

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

  return (
    <div className="container mx-auto bg-bg dark:bg-darkBg p-4 font-mono text-text dark:text-darkText">
      <div className="flex items-center justify-between">
        <div
          className="bg-main cursor-pointer p-2 border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none"
          onClick={handleBack}
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold">useLocalStorage</h1>
        <div></div>
      </div>
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

      <h2 className="text-2xl font-bold mt-6">Example Usage</h2>
      <pre className="bg-gray-200 dark:bg-gray-800 p-3 rounded text-sm shadow-light dark:shadow-dark">
        {`
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
        `}
      </pre>
    </div>
  );
};

export default LocalStorageComponent;
