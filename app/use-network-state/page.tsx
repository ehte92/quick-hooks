'use client';

import React from 'react';

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
import useNetworkState from '@/hooks/useNetworkState';

const NetworkStateComponent: React.FC = () => {
  const networkState = useNetworkState();

  const code = `
import React from 'react';
import useNetworkState from './useNetworkState';

const NetworkStateComponent = () => {
    const networkState = useNetworkState();

    return (
        <div>
            <p>Online: {networkState.online ? 'Yes' : 'No'}</p>
            <p>Since: {networkState.since?.toLocaleTimeString()}</p>
            <p>Round-Trip Time: {networkState.rtt ?? 'Unavailable'} ms</p>
            <p>Downlink: {networkState.downlink ?? 'Unavailable'} Mbps</p>
            <p>Effective Network Type: {networkState.effectiveType ?? 'Unavailable'}</p>
        </div>
    );
};

export default NetworkStateComponent;
                `;

  return (
    <LayoutPage title="useNetworkState">
      <p className="mt-1 mb-4 text-lg">
        Monitor and adapt to changes in network conditions. This hook provides
        real-time network status and metrics.
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
            <TableCell className="border px-4 py-2">online</TableCell>
            <TableCell className="border px-4 py-2">boolean</TableCell>
            <TableCell className="border px-4 py-2">
              Whether the browser has an active network connection.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">since</TableCell>
            <TableCell className="border px-4 py-2">Date</TableCell>
            <TableCell className="border px-4 py-2">
              Timestamp of the last network change.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">rtt</TableCell>
            <TableCell className="border px-4 py-2">number</TableCell>
            <TableCell className="border px-4 py-2">
              Estimated round-trip time of the current connection.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">downlink</TableCell>
            <TableCell className="border px-4 py-2">number</TableCell>
            <TableCell className="border px-4 py-2">
              Estimated downlink speed of the current connection in Mbps.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">effectiveType</TableCell>
            <TableCell className="border px-4 py-2">string</TableCell>
            <TableCell className="border px-4 py-2">
              The effective type of the connection (e.g., 'slow-2g', '2g', '3g',
              '4g').
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-2xl font-bold">Network Status</h2>
      <div className="bg-main rounded-base mb-4 text-lg p-3 border shadow-light dark:shadow-dark">
        <p>
          <strong>Online:</strong> {networkState.online ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Since:</strong> {networkState.since?.toLocaleTimeString()}
        </p>
        <p>
          <strong>Round-Trip Time:</strong> {networkState.rtt ?? 'Unavailable'}{' '}
          ms
        </p>
        <p>
          <strong>Downlink:</strong> {networkState.downlink ?? 'Unavailable'}{' '}
          Mbps
        </p>
        <p>
          <strong>Effective Network Type:</strong>{' '}
          {networkState.effectiveType ?? 'Unavailable'}
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-6">Example Usage</h2>
      <CodeBlock code={code} />
    </LayoutPage>
  );
};

export default NetworkStateComponent;
