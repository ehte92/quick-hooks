'use client';

import React from 'react';

import { Compass } from 'lucide-react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useOrientation from '@/hooks/useOrientation';

const OrientationComponent: React.FC = () => {
  const { angle, type } = useOrientation();

  const getRotationStyle = () => {
    return {
      transform: `rotate(${angle}deg)`,
      transition: 'transform 0.3s ease-out',
    };
  };

  const code = `
import React from 'react';
import { Compass } from 'lucide-react';
import useOrientation from './useOrientation';

const OrientationComponent = () => {
    const { angle, type } = useOrientation();

    return (
        <div>
            <h1>Device Orientation</h1>
            <Compass size={48} style={{ transform: \`rotate(\${angle}deg)\` }} />
            <p>Current Angle: {angle}°</p>
            <p>Orientation Type: {type}</p>
        </div>
    );
};

export default OrientationComponent;
                `;

  return (
    <LayoutPage title="useOrientation">
      <p className="mt-1 mb-4 text-lg">
        This example demonstrates how the hook responds to changes in device
        orientation. Rotate your device to see the compass icon rotate.
      </p>

      <h2 className="text-2xl font-bold">Return Values</h2>
      <Table className="table-auto w-full my-4 text-lg shadow-light dark:shadow-dark">
        <TableHeader>
          <TableRow>
            <TableHead className="border px-4 py-2">Property</TableHead>
            <TableHead className="border px-4 py-2">Type</TableHead>
            <TableHead className="border px-4 py-2">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border px-4 py-2">angle</TableCell>
            <TableCell className="border px-4 py-2">number</TableCell>
            <TableCell className="border px-4 py-2">
              The current orientation angle of the device.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">type</TableCell>
            <TableCell className="border px-4 py-2">string</TableCell>
            <TableCell className="border px-4 py-2">
              The current orientation type, such as 'portrait-primary' or
              'landscape-primary'.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold">Live Example</h2>
      <div className="mb-4 text-lg">
        <div className="flex justify-center items-center h-48 w-full bg-main rounded-base p-5 mb-2 border shadow-light dark:shadow-dark">
          <Compass size={48} style={getRotationStyle()} />
        </div>
        <p>
          <strong>Current Angle:</strong> {angle}°
        </p>
        <p>
          <strong>Orientation Type:</strong> {type}
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-6">Example Usage</h2>
      <CodeBlock code={code} />
    </LayoutPage>
  );
};

export default OrientationComponent;
