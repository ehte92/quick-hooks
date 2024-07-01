'use client';

import React from 'react';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useWindowSize from '@/hooks/useWindowSize';

const WindowSizeComponent: React.FC = () => {
  const { width, height } = useWindowSize();
  const router = useRouter();

  // Navigate back to the previous page
  const handleBack = () => {
    router.back();
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
        <h1 className="text-3xl font-bold">useWindowSize</h1>
        <div></div>
      </div>
      <p className="mt-1 mb-4 text-lg">
        This hook provides the current width and height of the browser window,
        updating in real-time as the window is resized.
      </p>

      <h2 className="text-2xl font-bold">Parameters and Return Values</h2>
      <Table className="table-auto w-full my-4 text-lg shadow-light dark:shadow-dark">
        <TableHeader className="bg-gray-300 dark:bg-gray-700">
          <TableRow>
            <TableHead className="border px-4 py-2">Return</TableHead>
            <TableHead className="border px-4 py-2">Type</TableHead>
            <TableHead className="border px-4 py-2">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border px-4 py-2">width</TableCell>
            <TableCell className="border px-4 py-2">number</TableCell>
            <TableCell className="border px-4 py-2">
              Current width of the window.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">height</TableCell>
            <TableCell className="border px-4 py-2">number</TableCell>
            <TableCell className="border px-4 py-2">
              Current height of the window.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold">Current Window Size</h2>
      <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded shadow-light dark:shadow-dark mb-4 text-lg">
        <p>
          <strong>Width:</strong> {width || 'Loading...'} pixels
        </p>
        <p>
          <strong>Height:</strong> {height || 'Loading...'} pixels
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-6">Example Usage</h2>
      <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded text-sm shadow-light dark:shadow-dark">
        <pre>
          {`
import React from 'react';
import useWindowSize from './useWindowSize';

const ResponsiveComponent = () => {
  const { width, height } = useWindowSize();

  return (
    <div>
      <h1>Window Size</h1>
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
    </div>
  );
};

export default ResponsiveComponent;
          `}
        </pre>
      </div>
    </div>
  );
};

export default WindowSizeComponent;
