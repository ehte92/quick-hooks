import React from 'react';

import { cn } from '@/lib/utils';

interface HeadingProps {
  className?: string;
  children: React.ReactNode;
}

const Heading = ({ children, className }: HeadingProps) => {
  return <h2 className={cn('text-2xl font-bold', className)}>{children}</h2>;
};

export default Heading;
