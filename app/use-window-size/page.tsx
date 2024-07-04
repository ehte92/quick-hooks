'use client';

import React from 'react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import BackButton from '@/components/ui/back-button';
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

  const code = `
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
          `;

  return (
    <LayoutPage title="useWindowSize">
      <p className="mt-1 mb-4 text-lg">
        This hook provides the current width and height of the browser window,
        updating in real-time as the window is resized.
      </p>

      <h2 className="text-2xl font-bold">Parameters and Return Values</h2>
      <Table className="table-auto w-full my-4 text-lg border shadow-light dark:shadow-dark">
        <TableHeader>
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
      <div className="bg-main p-3 rounded-base border shadow-light dark:shadow-dark mb-4 text-lg">
        <p>
          <strong>Width:</strong> {width || 'Loading...'} pixels
        </p>
        <p>
          <strong>Height:</strong> {height || 'Loading...'} pixels
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-6">Example Usage</h2>
      <CodeBlock code={code} />
    </LayoutPage>
  );
};

export default WindowSizeComponent;
