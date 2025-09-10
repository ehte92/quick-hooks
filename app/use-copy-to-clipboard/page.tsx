'use client';

import React, { useState } from 'react';

import { Copy, Check, Link, Code, Mail, CreditCard, User } from 'lucide-react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import useCopyToClipboard from '@/hooks/useCopyToClipboard';

export default function UseCopyToClipboardPage() {
  const { copiedText, copy, isSupported } = useCopyToClipboard();
  
  // Demo states
  const [customText, setCustomText] = useState('Hello, World!');
  
  // Sample data for different copy scenarios
  const sampleData = {
    url: 'https://example.com/shared-link',
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, ST 12345',
    creditCard: '**** **** **** 1234',
    apiKey: 'demo_api_key_12345',
    code: `import useCopyToClipboard from '@/hooks/useCopyToClipboard';

function MyComponent() {
  const { copy } = useCopyToClipboard();
  
  return (
    <button onClick={() => copy('Hello!')}>
      Copy Text
    </button>
  );
}`,
  };

  const copyWithFeedback = async (text: string, label?: string) => {
    const success = await copy(text);
    if (success && label) {
      // Visual feedback is handled by the copiedText state
    }
  };

  const basicUsageCode = `import useCopyToClipboard from '@/hooks/useCopyToClipboard';

function Component() {
  const { copiedText, copy, isSupported } = useCopyToClipboard();
  
  const handleCopy = async () => {
    const success = await copy('Text to copy');
    if (success) {
      console.log('Copied successfully!');
    }
  };
  
  return (
    <div>
      <button onClick={handleCopy} disabled={!isSupported}>
        Copy Text
      </button>
      {copiedText && <p>Copied: {copiedText}</p>}
    </div>
  );
}`;

  const advancedUsageCode = `// Copy with toast notifications
function ShareButton({ url }: { url: string }) {
  const { copy, copiedText } = useCopyToClipboard();
  
  const handleShare = async () => {
    const success = await copy(url);
    if (success) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };
  
  return (
    <button onClick={handleShare}>
      {copiedText === url ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Share Link
        </>
      )}
    </button>
  );
}`;

  return (
    <LayoutPage title="useCopyToClipboard">
      <p className="mt-1 mb-4 text-lg">
        A powerful hook for copying text to clipboard with fallback support for older browsers.
        Includes clipboard API detection and graceful fallback to document.execCommand.
      </p>

      {/* API Documentation */}
      <Heading className="mb-4">
        API Reference
      </Heading>
      
      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead>Returns</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono">copiedText</TableCell>
            <TableCell className="font-mono">string | null</TableCell>
            <TableCell>The last successfully copied text</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">copy</TableCell>
            <TableCell className="font-mono">(text: string) =&gt; Promise&lt;boolean&gt;</TableCell>
            <TableCell>Function to copy text to clipboard, returns success status</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">isSupported</TableCell>
            <TableCell className="font-mono">boolean</TableCell>
            <TableCell>Whether the browser supports the Clipboard API</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Status Display */}
      <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-800 rounded">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Clipboard API:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              isSupported 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {isSupported ? 'Supported' : 'Using Fallback'}
            </span>
          </div>
          {copiedText && (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="font-semibold">Last Copied:</span>
              <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">
                {copiedText.length > 30 ? `${copiedText.slice(0, 30)}...` : copiedText}
              </code>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Demo */}
      <Heading className="mb-4">
        Interactive Demo
      </Heading>

      <div className="grid gap-6 mb-8">
        {/* Demo 1: Custom Text Copy */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Text Copy</CardTitle>
            <CardDescription>
              Enter any text and copy it to your clipboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-text">Enter text to copy</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter any text..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => copyWithFeedback(customText)}
                    disabled={!customText.trim()}
                  >
                    {copiedText === customText ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 2: Quick Copy Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              Quick Copy Actions
            </CardTitle>
            <CardDescription>
              Common items you might want to copy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded">
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  <span className="text-sm">Share URL</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyWithFeedback(sampleData.url)}
                  variant="neutral"
                >
                  {copiedText === sampleData.url ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email Address</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyWithFeedback(sampleData.email)}
                  variant="neutral"
                >
                  {copiedText === sampleData.email ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Card Number</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyWithFeedback(sampleData.creditCard)}
                  variant="neutral"
                >
                  {copiedText === sampleData.creditCard ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">API Key</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => copyWithFeedback(sampleData.apiKey)}
                  variant="neutral"
                >
                  {copiedText === sampleData.apiKey ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 rounded text-sm">
              💡 Click any copy button to copy the associated text. The button will show a checkmark when copied!
            </div>
          </CardContent>
        </Card>

        {/* Demo 3: Code Copy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Snippet Copy
            </CardTitle>
            <CardDescription>
              Perfect for code documentation and tutorials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{sampleData.code}</code>
                </pre>
                <Button
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyWithFeedback(sampleData.code)}
                  variant="neutral"
                >
                  {copiedText === sampleData.code ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo 4: Long Text Copy */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information Copy</CardTitle>
            <CardDescription>
              Copy formatted contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded font-mono text-sm">
                <div>John Doe</div>
                <div>Software Engineer</div>
                <div>john.doe@company.com</div>
                <div>+1 (555) 123-4567</div>
                <div>123 Tech Street, Silicon Valley, CA 94000</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Contact information ready to copy
                </span>
                <Button onClick={() => copyWithFeedback(sampleData.address)}>
                  {copiedText === sampleData.address ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Address Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Address
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Examples */}
      <Heading className="mb-4">
        Usage Examples
      </Heading>

      <div className="space-y-6">
        <div>
          <Heading className="mb-2">
            Basic Usage
          </Heading>
          <CodeBlock code={basicUsageCode} />
        </div>

        <div>
          <Heading className="mb-2">
            Advanced Usage
          </Heading>
          <CodeBlock code={advancedUsageCode} />
        </div>
      </div>

      {/* Features */}
      <Heading className="mb-4">
        Features
      </Heading>
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li>📋 Modern Clipboard API with automatic fallback to document.execCommand</li>
        <li>✅ Returns success/failure status for proper error handling</li>
        <li>🔍 Clipboard API support detection</li>
        <li>📱 SSR compatible with proper browser detection</li>
        <li>🛡️ Handles empty strings and invalid inputs gracefully</li>
        <li>⚡ Optimized with <code>useCallback</code> for stable function references</li>
        <li>🌐 Cross-browser compatibility with fallback support</li>
        <li>🔧 Full TypeScript support with comprehensive type safety</li>
        <li>🪶 Lightweight - no dependencies</li>
      </ul>
    </LayoutPage>
  );
}
