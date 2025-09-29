"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useState } from "react";

interface CodeBlockProps {
  language: string;
  value: string;
  title?: string;
}

export default function CodeBlock({ language, value, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="my-6 rounded-lg border border-slate-700 overflow-hidden bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          {title && (
            <span className="text-sm font-medium text-slate-300">{title}</span>
          )}
          <span className="text-xs text-slate-400 uppercase tracking-wide font-mono">
            {language}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          showLineNumbers
          lineNumberStyle={{
            color: '#64748b',
            paddingRight: '1rem',
            fontSize: '12px',
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}