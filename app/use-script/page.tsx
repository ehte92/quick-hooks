'use client';

import React, { useEffect, useRef } from 'react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import Heading from '@/components/ui/heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useScript from '@/hooks/useScript';

const UseScriptExample = () => {
  const status = useScript(
    'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js'
  );
  const canvasRef = useRef(null);

  useEffect(() => {
    if (status === 'ready' && window.p5) {
      new window.p5((p) => {
        p.setup = () => {
          p.createCanvas(400, 400);
          p.background(0);
        };

        p.draw = () => {
          p.fill(255, p.mouseX, p.mouseY, 100);
          p.noStroke();
          p.ellipse(p.mouseX, p.mouseY, 50, 50);
        };
      }, canvasRef.current);
    }
  }, [status]);

  const code = `
import React from 'react';
import useScript from './useScript';

const ExampleComponent = () => {
  const status = useScript('https://cdn.jsdelivr.net/npm/some-library');

  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'ready' && <p>Script loaded and ready to use!</p>}
      {status === 'error' && <p>Error loading script.</p>}
    </div>
  );
};

export default ExampleComponent;
  `;

  return (
    <LayoutPage title="useScript">
      <p className="text-lg mt-2 mb-4">
        This hook dynamically loads external JavaScript scripts and tracks their
        load status.
      </p>

      <Heading>Parameters</Heading>
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
            <TableCell className="border px-4 py-2">src</TableCell>
            <TableCell className="border px-4 py-2">string</TableCell>
            <TableCell className="border px-4 py-2">
              The source URL of the script to load.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Heading>Return Values</Heading>
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
            <TableCell className="border px-4 py-2">status</TableCell>
            <TableCell className="border px-4 py-2">
              'idle' | 'loading' | 'ready' | 'error'
            </TableCell>
            <TableCell className="border px-4 py-2">
              The current status of the script: 'idle', 'loading', 'ready', or
              'error'.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Heading>Live Example</Heading>
      <p className="text-lg">
        This demo loads the p5.js library to dynamically create graphics. Watch
        the animation change as you move your mouse over the canvas.
      </p>
      <Heading>Script Status</Heading>
      <p>Status: {status}</p>
      <div className="border shadow-light dark:shadow-dark flex justify-center mb-2">
        <div ref={canvasRef} />
      </div>

      <Heading>Example Usage</Heading>
      <CodeBlock code={code} />
    </LayoutPage>
  );
};

export default UseScriptExample;
