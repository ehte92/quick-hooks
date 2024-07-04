'use client';

import React, { useState } from 'react';

import { SearchIcon, X } from 'lucide-react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
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
import useDebounce from '@/hooks/useDebounce';

const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  const code = `const debouncedValue = useDebounce(inputValue, delay);`;

  return (
    <LayoutPage title="useDebounce">
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

      <Heading>Example</Heading>
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

      <Heading className="mt-6">Example Usage</Heading>
      <CodeBlock code={code} />
    </LayoutPage>
  );
};

export default SearchComponent;
