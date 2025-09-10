import { useCallback, useState } from 'react';

interface CopyToClipboardReturn {
  copiedText: string | null;
  copy: (text: string) => Promise<boolean>;
  isSupported: boolean;
}

/**
 * Custom hook for copying text to clipboard with fallback support.
 * @returns An object with copied text state, copy function, and clipboard API support status.
 */
function useCopyToClipboard(): CopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  const isSupported = typeof navigator !== 'undefined' && 'clipboard' in navigator;

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!text) {
      return false;
    }

    try {
      if (isSupported) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopiedText(text);
      return true;
    } catch {
      setCopiedText(null);
      return false;
    }
  }, [isSupported]);

  return {
    copiedText,
    copy,
    isSupported,
  };
}

export default useCopyToClipboard;