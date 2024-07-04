'use client';

import React from 'react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useSessionStorage from '@/hooks/useSessionStorage';

const SessionStorageComponent: React.FC = () => {
  const [username, setUsername] = useSessionStorage<string>(
    'username',
    'Guest'
  );

  const code = `
import React from 'react';
import useSessionStorage from './useSessionStorage';

const SessionStorageComponent = () => {
    const [username, setUsername] = useSessionStorage<string>('username', 'Guest');

    return (
        <div>
            <label htmlFor="username">Username:</label>
            <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <p>Hello, {username}!</p>
        </div>
    );
};

export default SessionStorageComponent;
                `;

  return (
    <LayoutPage title="useSessionStorage">
      <p className="mt-4 mb-8 text-lg">
        This example demonstrates storing and retrieving user data in session
        storage. Change the name and refresh the page to see persistence.
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
            <TableCell className="border px-4 py-2">key</TableCell>
            <TableCell className="border px-4 py-2">string</TableCell>
            <TableCell className="border px-4 py-2">
              The key under which the data is stored in session storage.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">initialValue</TableCell>
            <TableCell className="border px-4 py-2">any</TableCell>
            <TableCell className="border px-4 py-2">
              The initial value for the key, used if no value is already stored.
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
            <TableCell className="border px-4 py-2">storedValue</TableCell>
            <TableCell className="border px-4 py-2">
              [any, (value: any) =&gt; void]
            </TableCell>
            <TableCell className="border px-4 py-2">
              The current value from session storage and a function to update
              it.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Heading>Live Example</Heading>
      <div className="mb-8 text-lg">
        <div className="flex flex-col items-center justify-center p-5 bg-purple-200 dark:bg-purple-800 rounded-lg border shadow-light dark:shadow-dark">
          <Label htmlFor="username" className="text-lg">
            Username:
          </Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 p-2"
          />
          <p className="mt-4">
            Hello, {username}! Refresh the page to test session storage
            persistence.
          </p>
        </div>
      </div>

      <Heading className="mt-6">Example Usage</Heading>
      <CodeBlock code={code} />
    </LayoutPage>
  );
};

export default SessionStorageComponent;
