"use client";
import { useState, useEffect } from "react";
import { CopyButton } from "./CopyButton";

interface CopyUrlButtonProps {
  slug: string;
  className?: string;
}

export const CopyUrlButton = ({ slug, className }: CopyUrlButtonProps) => {
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    // 在客户端获取完整 URL
    if (typeof window !== "undefined") {
      // 对于包含斜杠的路径，直接使用路径而不是编码整个字符串
      const url = `${window.location.origin}/prompts/${slug}`;
      setFullUrl(url);
    }
  }, [slug]);

  if (!fullUrl) {
    return null;
  }

  return (
    <CopyButton 
      text={fullUrl} 
      variant="button" 
      label="Copy Prompt Link" 
      className={className} 
    />
  );
};

