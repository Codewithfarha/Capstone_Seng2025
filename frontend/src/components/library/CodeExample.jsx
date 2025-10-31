import React, { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';

const CodeExample = ({ code, language = 'javascript', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `example.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      {/* Header */}
      {title && (
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <span className="text-gray-300 text-sm font-medium">{title}</span>
        </div>
      )}

      {/* Code Block */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto">
          <code className="text-green-400 font-mono text-sm whitespace-pre">
            {code}
          </code>
        </pre>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            title="Download code"
          >
            <Download className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 flex justify-between items-center">
        <span className="text-gray-400 text-xs uppercase font-semibold">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeExample;
