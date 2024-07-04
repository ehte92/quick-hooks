'use client';

import React from 'react';

import BackButton from '@/components/ui/back-button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useMediaQuery from '@/hooks/useMediaQuery';

const MediaQueryComponent: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  return (
    <div className="container mx-auto bg-bg dark:bg-darkBg p-4 font-mono text-text dark:text-darkText">
      <div className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-3xl font-bold">useMediaQuery</h1>
        <div></div>
      </div>
      <p className="mt-1 mb-4 text-lg">
        Dynamically respond to media query changes to adapt your UI based on the
        viewport size.
      </p>

      <h2 className="text-2xl font-bold">Parameters</h2>
      <Table className="table-auto w-full my-4 text-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="border px-4 py-2">Parameter</TableHead>
            <TableHead className="border px-4 py-2">Type</TableHead>
            <TableHead className="border px-4 py-2">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border px-4 py-2">query</TableCell>
            <TableCell className="border px-4 py-2">string</TableCell>
            <TableCell className="border px-4 py-2">
              A string representing the CSS media query to listen for changes.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold">Return Values</h2>
      <Table className="table-auto w-full my-4 text-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="border px-4 py-2">Type</TableHead>
            <TableHead className="border px-4 py-2">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border px-4 py-2">boolean</TableCell>
            <TableCell className="border px-4 py-2">
              True if the current document matches the media query, otherwise
              false.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold">Live Example</h2>
      <div className="text-lg p-4">
        <div
          className={`p-4 ${isDesktop ? 'bg-blue-500' : isTablet ? 'bg-green-500' : 'bg-red-500'} transition-all duration-500 shadow-light dark:shadow-dark`}
        >
          <p className="font-bold">
            Current Viewport:{' '}
            {isDesktop
              ? 'Desktop View'
              : isTablet
                ? 'Tablet View'
                : 'Mobile View'}
          </p>
          <p>
            Resize the browser to see the color change based on the current
            viewport size.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-6">Example Usage</h2>
      <pre className="bg-main p-3 text-sm shadow-light dark:shadow-dark">
        {`
import React from 'react';
import useMediaQuery from './useMediaQuery';

const MediaQueryComponent = () => {
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <div>
            <h1>Responsive Test</h1>
            <p>The view is currently: {isDesktop ? 'Desktop' : isTablet ? 'Tablet' : 'Mobile'}</p>
        </div>
    );
};

export default MediaQueryComponent;
                `}
      </pre>
    </div>
  );
};

export default MediaQueryComponent;
