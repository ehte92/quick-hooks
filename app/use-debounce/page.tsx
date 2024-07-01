'use client';

import React, { useState } from 'react';

import { ArrowLeftIcon, SearchIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
        <div
          className="bg-main cursor-pointer p-2 border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none"
          onClick={handleBack}
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold">useDebounce</h1>
        <div></div>
      </div>
      <p className="mt-1 mb-4 text-lg">
        This hook allows you to delay handling updates until the user has
        stopped typing for a specified interval.
      </p>

      <Table className="table-fixed w-full mb-4 text-lg shadow-light dark:shadow-dark">
        <TableHeader>
          <TableRow>
            <TableHead className="border px-4 py-2">Parameter</TableHead>
            <TableHead className="border px-4 py-2">Description</TableHead>
            <TableHead className="border px-4 py-2">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border px-4 py-2">value</TableCell>
            <TableCell className="border px-4 py-2">
              The value to be debounced.
            </TableCell>
            <TableCell className="border px-4 py-2">any</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">delay</TableCell>
            <TableCell className="border px-4 py-2">
              The delay in milliseconds before the value is updated.
            </TableCell>
            <TableCell className="border px-4 py-2">number</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold">Example</h2>
      <div className="relative my-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type here to search..."
          className="pl-10 pr-10 w-full text-xl shadow-light dark:shadow-dark"
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

      <pre className="bg-gray-200 dark:bg-gray-800 p-3 rounded shadow-light dark:shadow-dark text-sm">
        {`const debouncedValue = useDebounce(inputValue, delay);`}
      </pre>
    </div>
  );
};

export default SearchComponent;
