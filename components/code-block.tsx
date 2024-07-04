import React from 'react';

interface CodeBlockProps {
  code: string;
}

const CodeBlock = ({ code }: CodeBlockProps) => {
  return (
    <pre className="bg-main rounded-base p-3 text-sm border shadow-light dark:shadow-dark">
      {code}
    </pre>
  );
};

export default CodeBlock;
