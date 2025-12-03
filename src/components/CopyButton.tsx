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
          "relative z-50 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer overflow-hidden group",
          copied
            ? "text-green-400 shadow-lg shadow-green-500/30"
            : "text-neutral-200 hover:text-white active:scale-[0.98]",
          className
        )}
      >
        {/* 背景层 */}
        <div className={cn(
          "absolute inset-0 rounded-lg transition-all duration-300",
          copied
            ? "bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-500/20"
            : "bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 group-hover:from-neutral-800 group-hover:to-neutral-800"
        )}></div>
        
        {/* 边框 - 默认状态 */}
        {!copied && (
          <>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neutral-700/60 to-neutral-600/60 opacity-60 group-hover:opacity-0 transition-opacity duration-300"></div>
            <div className="absolute inset-[1px] rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"></div>
            <div className="absolute inset-[1px] rounded-lg border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        )}
        
        {/* 边框 - 复制成功状态 */}
        {copied && (
          <>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/50 via-emerald-500/50 to-green-500/50 animate-pulse"></div>
            <div className="absolute inset-[1px] rounded-lg border border-green-500/60"></div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-sm"></div>
          </>
        )}
        
        {/* 内容 */}
        <span className="relative z-10 flex items-center gap-1.5">
          {copied ? <Check size={14} strokeWidth={2.5} className="text-green-400" /> : <Copy size={14} strokeWidth={2} />}
          <span className="text-xs">{copied ? "Copied" : label}</span>
        </span>
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
