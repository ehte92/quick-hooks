import React from 'react';

import BackButton from './ui/back-button';

interface LayoutPageProps {
  title: string;
  children: React.ReactNode;
}

const LayoutPage = ({ title, children }: LayoutPageProps) => {
  return (
    <div className="container mx-auto rounded-base bg-bg dark:bg-darkBg p-4 font-mono text-text dark:text-darkText border shadow-light dark:shadow-dark my-4">
      <div className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-3xl font-bold">{title}</h1>
        <div></div>
      </div>
      {children}
    </div>
  );
};

export default LayoutPage;
