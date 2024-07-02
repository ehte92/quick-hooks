'use client';

import React from 'react';

import BackButton from '@/components/ui/back-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const VisibilityComponent: React.FC = () => {
  const [ref1, isVisible1] = useIntersectionObserver({ threshold: 0.1 });
  const [ref2, isVisible2] = useIntersectionObserver({ threshold: 0.5 });
  const [ref3, isVisible3] = useIntersectionObserver({ threshold: 0.9 });

  return (
    <div className="container mx-auto bg-bg dark:bg-darkBg p-4 font-mono text-text dark:text-darkText">
      <div className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-3xl font-bold">useIntersectionObserver</h1>
        <div></div>
      </div>
      <p className="mt-1 mb-4 text-lg">
        This hook allows tracking the visibility of components in the viewport
        using the Intersection Observer API. Scroll to see the elements come
        into view and observe how they react based on different threshold
        settings.
      </p>

      <h2 className="text-2xl font-bold">Parameters</h2>
      <Table className="table-auto w-full my-4 text-lg shadow-light dark:shadow-dark">
        <TableHeader>
          <TableRow>
            <TableHead className="border px-4 py-2">Parameter</TableHead>
            <TableHead className="border px-4 py-2">Type</TableHead>
            <TableHead className="border px-4 py-2">Default</TableHead>
            <TableHead className="border px-4 py-2">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border px-4 py-2">root</TableCell>
            <TableCell className="border px-4 py-2">Element</TableCell>
            <TableCell className="border px-4 py-2">null</TableCell>
            <TableCell className="border px-4 py-2">
              The element that is used as the viewport for checking visibility
              of the target. Defaults to the browser viewport if not specified
              or if null.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">rootMargin</TableCell>
            <TableCell className="border px-4 py-2">string</TableCell>
            <TableCell className="border px-4 py-2">0px</TableCell>
            <TableCell className="border px-4 py-2">
              Margin around the root. Can have values similar to the CSS margin
              property (e.g., "10px 20px 30px 40px"). Defaults to "0px".
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">threshold</TableCell>
            <TableCell className="border px-4 py-2">number</TableCell>
            <TableCell className="border px-4 py-2">1</TableCell>
            <TableCell className="border px-4 py-2">
              Indicates at what percentage of the target's visibility the
              observer's callback should be executed. It can be a single number
              or an array of numbers.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold">Return Values</h2>
      <Table className="table-auto w-full my-4 text-lg shadow-light dark:shadow-dark">
        <TableHeader>
          <TableRow>
            <TableHead className="border px-4 py-2">Return</TableHead>
            <TableHead className="border px-4 py-2">Type</TableHead>
            <TableHead className="border px-4 py-2">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border px-4 py-2">ref</TableCell>
            <TableCell className="border px-4 py-2">React ref object</TableCell>
            <td className="border px-4 py-2">
              A ref to attach to the DOM element and a boolean indicating
              visibility.
            </td>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">isVisible</TableCell>
            <TableCell className="border px-4 py-2">boolean</TableCell>
            <td className="border px-4 py-2">
              A boolean value indicating whether the element is visible in the
              viewport.
            </td>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold">Live Example</h2>
      <div className="flex items-center justify-center">
        <ScrollArea className="h-[400px] w-[550px] text-text border-2 border-border dark:border-darkBorder bg-main p-4 shadow-light dark:shadow-dark">
          <div
            ref={ref1}
            className="h-64 border-2 border-blue-500 mb-8 flex items-center justify-center"
          >
            {isVisible1 ? (
              <p className="text-lg text-blue-500">Visible at 10% threshold!</p>
            ) : (
              <p className="text-lg ">Not Visible</p>
            )}
          </div>
          <div
            ref={ref2}
            className="h-64 border-2 border-accent mb-8 flex items-center justify-center"
          >
            {isVisible2 ? (
              <p className="text-lg text-accent">Visible at 50% threshold!</p>
            ) : (
              <p className="text-lg ">Not Visible</p>
            )}
          </div>
          <div
            ref={ref3}
            className="h-64 border-2 border-destructive mb-8 flex items-center justify-center"
          >
            {isVisible3 ? (
              <p className="text-lg text-destructive">
                Visible at 90% threshold!
              </p>
            ) : (
              <p className="text-lg ">Not Visible</p>
            )}
          </div>
        </ScrollArea>
      </div>

      <h2 className="text-2xl font-bold mt-6">Example Usage</h2>
      <pre className="bg-main p-3 text-sm shadow-light dark:shadow-dark">
        {`
import React from 'react';
import useIntersectionObserver from './useIntersectionObserver';

const VisibilityComponent = () => {
    const [ref, isVisible] = useIntersectionObserver({threshold: 0.5});

    return (
        <div ref={ref}>
            {isVisible ? 'Visible in the viewport!' : 'Scroll to see me!'}
        </div>
    );
};

export default VisibilityComponent;
                `}
      </pre>
    </div>
  );
};

export default VisibilityComponent;
