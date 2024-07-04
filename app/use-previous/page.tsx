'use client';

import React, { useState } from 'react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import Heading from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import usePrevious from '@/hooks/usePrevious';

const FavoriteColorComponent: React.FC = () => {
  const [color, setColor] = useState('red');
  const prevColor = usePrevious(color);

  const code = `
import React, { useState } from 'react';
import usePrevious from './usePrevious';

const FavoriteColorComponent = () => {
  const [color, setColor] = useState('red');
  const prevColor = usePrevious(color);

  return (
    <div>
      <select value={color} onChange={(e) => setColor(e.target.value)}>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        ...
      </select>
      <p>Current Color: {color}</p>
      <p>Previous Color: {prevColor}</p>
    </div>
  );
};

export default FavoriteColorComponent;
                `;

  return (
    <LayoutPage title="usePrevious">
      <p className="mt-1 mb-4 text-lg">
        This hook captures the previous value of a variable for comparison with
        its current state.
      </p>

      <Heading>Parameters and Return Values</Heading>
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
            <TableCell className="border px-4 py-2">value</TableCell>
            <TableCell className="border px-4 py-2">any</TableCell>
            <TableCell className="border px-4 py-2">
              The current value you want to track the previous value of.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">Return</TableCell>
            <TableCell className="border px-4 py-2">any</TableCell>
            <TableCell className="border px-4 py-2">
              Returns the previous value of the tracked variable (undefined on
              first render).
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Heading>Live Example</Heading>
      <div
        className={`bg-${color}-500 mb-4 rounded-base border shadow-light dark:shadow-dark p-4`}
      >
        <Select onValueChange={setColor} defaultValue={color}>
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Select your favorite color" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Colors</SelectLabel>
              <SelectItem value="red">
                <span className="h-3 w-3 bg-red-500 rounded-full inline-block mr-2" />
                Red
              </SelectItem>
              <SelectItem value="blue">
                <span className="h-3 w-3 bg-blue-500 rounded-full inline-block mr-2" />
                Blue
              </SelectItem>
              <SelectItem value="green">
                <span className="h-3 w-3 bg-green-500 rounded-full inline-block mr-2" />
                Green
              </SelectItem>
              <SelectItem value="yellow">
                <span className="h-3 w-3 bg-yellow-500 rounded-full inline-block mr-2" />
                Yellow
              </SelectItem>
              <SelectItem value="purple">
                <span className="h-3 w-3 bg-purple-500 rounded-full inline-block mr-2" />
                Purple
              </SelectItem>
              <SelectItem value="orange">
                <span className="h-3 w-3 bg-orange-500 rounded-full inline-block mr-2" />
                Orange
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="mt-4">
          <p className="text-lg">
            <strong>Current Color:</strong> {color}
          </p>
          <p className="text-lg">
            <strong>Previous Color:</strong> {prevColor}
          </p>
        </div>
      </div>

      <Heading className="mt-6">Example Usage</Heading>
      <CodeBlock code={code} />
    </LayoutPage>
  );
};

export default FavoriteColorComponent;
