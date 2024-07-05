'use client';

import React, { useEffect, useRef, useState } from 'react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useVisibilityChange from '@/hooks/useVisibilityChange';

const VisibilityChange = () => {
  const isVisible = useVisibilityChange();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isVisible]);

  const code = `
import React, { useEffect, useRef } from 'react';
import useVisibilityChange from './useVisibilityChange';

const VisibilityChange = () => {
  const isVisible = useVisibilityChange();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isVisible) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isVisible]);

  return (
    <video ref={videoRef} controls width="320" height="240">
      <source src="/get_schwifty.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default VisibilityChange;
  `;

  return (
    <LayoutPage title="useVisibilityChange">
      <p className="mt-1 mb-4 text-lg">
        This hook tracks the visibility state of the document. The video below
        will play when the document is visible and pause when it is hidden.
      </p>

      <Heading>Return Value</Heading>
      <Table className="table-auto w-full my-4 text-lg shadow-light dark:shadow-dark">
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
              A boolean indicating whether the document is currently visible.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Heading>Live Example</Heading>
      <div className="relative group w-full max-w-xl mx-auto">
        <video
          ref={videoRef}
          width="640"
          height="360"
          className="shadow-light dark:shadow-dark border rounded-base cursor-pointer"
          onClick={togglePlayPause}
          onMouseLeave={() => videoRef.current?.pause()}
        >
          <source src="/get_schwifty.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={togglePlayPause}
        >
          <Button size="icon">{isPlaying ? '❚❚' : '▶'}</Button>
        </div>
      </div>

      <Heading className="mt-6">Example Usage</Heading>
      <CodeBlock code={code} />
    </LayoutPage>
  );
};

export default VisibilityChange;
