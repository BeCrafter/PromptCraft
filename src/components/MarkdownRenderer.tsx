"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Mermaid } from "@/components/Mermaid";
import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/utils";

// @ts-ignore
export const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="w-full max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const isInline = !match;
            const codeContent = String(children).replace(/\n$/, "");

            if (isInline) {
              return (
                <code className="bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }

            if (language === "mermaid") {
              return <Mermaid chart={codeContent} />;
            }

            return (
              <div className="relative group my-6 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-neutral-950 border-b border-neutral-800">
                  <span className="text-xs text-neutral-500 font-mono">{language || 'text'}</span>
                  <CopyButton text={codeContent} />
                </div>
                <div className="p-4 overflow-x-auto">
                  <code className={cn("font-mono text-sm text-neutral-300 block", className)} {...props}>
                    {children}
                  </code>
                </div>
              </div>
            );
          },
          h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4 text-white border-b border-neutral-800 pb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3 text-white">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-7 text-neutral-300">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-neutral-300 ml-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-neutral-300 ml-4">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          a: ({ href, children }) => <a href={href} className="text-blue-400 hover:text-blue-300 underline transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-neutral-400 bg-neutral-900/30 py-3 pr-3 rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => <div className="overflow-x-auto my-6"><table className="min-w-full border-collapse border border-neutral-800 text-left">{children}</table></div>,
          thead: ({ children }) => <thead className="bg-neutral-900 text-neutral-200">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-neutral-800">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-neutral-900/50 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="p-3 border-b border-neutral-700 font-semibold text-sm">{children}</th>,
          td: ({ children }) => <td className="p-3 text-sm text-neutral-300">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

