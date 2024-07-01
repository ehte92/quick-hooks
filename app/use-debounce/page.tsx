'use client';

import React, { useState } from 'react';

// Ensure your path is correct
import { ArrowLeftIcon, SearchIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
// Ensure the icons are correctly imported
import useDebounce from '@/hooks/useDebounce';

const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto bg-bg dark:bg-darkBg pt-10 font-mono text-text dark:text-darkText pb-6 mt-6">
      <div className="flex items-center justify-between">
        <ArrowLeftIcon
          className="w-6 h-6 text-main cursor-pointer"
          onClick={handleBack}
        />
        <h1 className="text-3xl font-bold">useDebounce</h1>
        <div></div>
      </div>
      <p className="mt-1 mb-4 text-lg">
        This hook allows you to delay handling updates until the user has
        stopped typing for a specified interval.
      </p>

      <table className="table-fixed w-full mb-4 text-lg border border-border dark:border-darkBorder">
        <thead>
          <tr className="bg-gray-300 dark:bg-gray-700 border-b border-border dark:border-darkBorder">
            <th className="w-1/4 p-2">Parameter</th>
            <th className="w-1/2 p-2">Description</th>
            <th className="w-1/4 p-2">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border dark:border-darkBorder">
            <td className="p-2">value</td>
            <td className="p-2">The value to be debounced.</td>
            <td className="p-2">any</td>
          </tr>
          <tr className="border-b border-border dark:border-darkBorder">
            <td className="p-2">delay</td>
            <td className="p-2">
              The delay in milliseconds before the value is updated.
            </td>
            <td className="p-2">number</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-bold">Example</h2>
      <div className="relative my-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type here to search..."
          className="pl-10 pr-10 w-full text-xl border border-border dark:border-darkBorder"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl" />
        {searchTerm && (
          <X
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
            onClick={() => setSearchTerm('')}
          />
        )}
      </div>
      <div className="text-lg">
        <strong>Input:</strong> {searchTerm}
      </div>
      <div className="text-lg mb-4">
        <strong>Debounced Input:</strong> {debouncedSearchTerm}
      </div>

      <pre className="bg-gray-200 dark:bg-gray-800 p-3 rounded">
        {`const debouncedValue = useDebounce(inputValue, delay);`}
      </pre>
    </div>
  );
};

export default SearchComponent;
