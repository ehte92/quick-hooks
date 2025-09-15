import React from 'react';

import { cn } from '@/lib/utils';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
}

const Heading = ({ level = 2, children, className }: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const sizeClasses = {
    1: 'text-4xl font-bold',
    2: 'text-2xl font-bold',
    3: 'text-xl font-bold',
    4: 'text-lg font-bold',
    5: 'text-base font-bold',
    6: 'text-sm font-bold'
  };

  return <Tag className={cn(sizeClasses[level], className)}>{children}</Tag>;
};

export default Heading;
