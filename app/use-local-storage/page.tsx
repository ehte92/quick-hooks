'use client';

import React, { useState } from 'react';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
        <ArrowLeftIcon
          className="w-6 h-6 text-main cursor-pointer"
          onClick={handleBack}
        />
        <h1 className="text-3xl font-bold">useLocalStorage</h1>
        <div></div>
      </div>
      <p className="mt-1 mb-4 text-lg">
        This hook facilitates storing, retrieving, and synchronizing data with
        the browser's localStorage.
      </p>

      <h2 className="text-2xl font-bold">Parameters and Return Values</h2>
      <table className="table-auto w-full my-4 text-lg">
        <thead className="bg-gray-300 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2">Parameter</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">key</td>
            <td className="border px-4 py-2">string</td>
            <td className="border px-4 py-2">
              The key under which the value is stored in localStorage.
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2">initialValue</td>
            <td className="border px-4 py-2">T</td>
            <td className="border px-4 py-2">
              The initial value to use if there is no item in localStorage under
              the key.
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something..."
            className="border border-border dark:border-darkBorder p-2 mr-2 text-lg"
          />
          <button
            onClick={handleSave}
            className="bg-main dark:bg-accent p-2 text-white mr-2"
          >
            Save to Local Storage
          </button>
          <button
            onClick={handleClear}
            className="bg-destructive dark:bg-destructive p-2 text-white"
          >
            Clear Local Storage
          </button>
        </div>
        <div className="text-lg mt-4">
          <strong>Stored Value:</strong> {storedValue || 'No value saved yet!'}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-6">Example Usage</h2>
      <pre className="bg-gray-200 dark:bg-gray-800 p-3 rounded text-sm">
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
