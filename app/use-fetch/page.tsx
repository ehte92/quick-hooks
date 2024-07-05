'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Heading from '@/components/ui/heading';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useFetch from '@/hooks/useFetch';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Origin;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Origin {
  name: string;
  url: string;
}

export interface Location {
  name: string;
  url: string;
}

const useFetchPage = () => {
  const [count, setCount] = useState<number>(1);
  const { data, error, loading } = useFetch<Character>(
    `https://rickandmortyapi.com/api/character/${count}`
  );

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const code = `
import React from 'react';
import useFetch from './useFetch';

const Component = () => {
  const { data, error, loading } = useFetch<Character[]>(
    'https://rickandmortyapi.com/api/character'
  );

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(character => (
        <div key={character.id}>
          <h2>{character.name}</h2>
          <img src={character.image} alt={character.name} />
        </div>
      ))}
    </div>
  );
}
  `;

  return (
    <LayoutPage title="useFetch">
      <p className="mt-4 mb-8 text-lg">
        This hook fetches data from a URL with state management and caching. It
        is useful for fetching data from an API and managing the loading state.
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
            <TableCell className="border px-4 py-2">url</TableCell>
            <TableCell className="border px-4 py-2">string</TableCell>
            <TableCell className="border px-4 py-2">
              The URL to fetch data from.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">options</TableCell>
            <TableCell className="border px-4 py-2">object</TableCell>
            <TableCell className="border px-4 py-2">
              Optional configuration options for the fetch request.
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
            <TableCell className="border px-4 py-2">data</TableCell>
            <TableCell className="border px-4 py-2">any | null</TableCell>
            <TableCell className="border px-4 py-2">
              The data returned from the fetch operation, or null if no data.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">error</TableCell>
            <TableCell className="border px-4 py-2">Error | null</TableCell>
            <TableCell className="border px-4 py-2">
              An error object if an error occurred, or null otherwise.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border px-4 py-2">loading</TableCell>
            <TableCell className="border px-4 py-2">boolean</TableCell>
            <TableCell className="border px-4 py-2">
              Indicates whether the request is still in progress.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Heading>Live Example</Heading>
      <div className="container mx-auto p-4 flex justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>
              {loading ? <Skeleton className="h-6 w-24" /> : data?.name}
            </CardTitle>
            <CardDescription>
              {loading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <p>
                  {data?.gender} {data?.species} from {data?.origin.name} (
                  {data?.status})
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-20" />
            ) : (
              <Image
                src={data?.image ?? ''}
                alt={data?.name ?? ''}
                width={300}
                height={300}
                className="w-full h-[300px] mb-2 rounded"
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={() => setCount((prevCount) => prevCount - 1)}
              disabled={count === 1}
            >
              Prev
            </Button>
            <Button
              variant="neutral"
              onClick={() => setCount((prevCount) => prevCount + 1)}
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Heading className="mt-6">Example Usage</Heading>
      <CodeBlock code={code} />
    </LayoutPage>
  );
};

export default useFetchPage;
