import React from 'react';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from './button';

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    // <div
    //   className="bg-main cursor-pointer rounded-base p-2 border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none"
    //   onClick={handleBack}
    // >
    //   <ArrowLeftIcon className="w-6 h-6" />
    // </div>
    <Button size="icon" onClick={handleBack}>
      <ArrowLeftIcon className="w-6 h-6" />
    </Button>
  );
};

export default BackButton;
