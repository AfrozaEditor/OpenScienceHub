import { useState } from 'react';
import './TruncatedText.css';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  showCopyButton?: boolean;
}

export const TruncatedText = ({ 
  text, 
  maxLength = 60,
  className = '',
  showCopyButton = true
}: TruncatedTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate 
    ? text 
    : `${text.substring(0, maxLength)}...`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!shouldTruncate) {
    return (
      <span className={className}>
        {text}
        {showCopyButton && (
          <button
            className="copy-text-button"
            onClick={handleCopy}
            type="button"
            aria-label="Copy text"
            title="Copy to clipboard"
          >
            {copied ? '✓' : '📋'}
          </button>
        )}
      </span>
    );
  }

  return (
    <div className={`truncated-text ${className}`}>
      <span className="truncated-content">{displayText}</span>
      <div className="truncated-actions">
        <button
          className="truncate-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
          aria-label={isExpanded ? 'Show less' : 'Show more'}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
        {showCopyButton && (
          <button
            className="copy-text-button"
            onClick={handleCopy}
            type="button"
            aria-label="Copy text"
            title="Copy to clipboard"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        )}
      </div>
    </div>
  );
};
