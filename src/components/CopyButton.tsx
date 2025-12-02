"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "icon" | "button";
  label?: string;
}

export const CopyButton = ({ 
  text, 
  className, 
  variant = "icon",
  label = "Copy Prompt" 
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!text) {
        console.warn("CopyButton: No text to copy");
        return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback...", err);
      // 传统的 fallback 方案
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleCopy}
        type="button"
        className={cn(
          "relative z-50 px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer",
          copied
            ? "bg-green-500 text-white ring-2 ring-green-500 ring-offset-2 ring-offset-black"
            : "bg-white text-black hover:bg-neutral-100",
          className
        )}
      >
        {copied ? <Check size={16} strokeWidth={3} /> : <Copy size={16} strokeWidth={2.5} />}
        {copied ? "Copied!" : label}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={cn(
        "relative z-50 p-2 rounded-md transition-all duration-200 flex items-center gap-2 text-xs font-medium border cursor-pointer",
        copied
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-white",
        className
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};
