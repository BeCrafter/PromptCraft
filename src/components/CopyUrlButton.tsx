"use client";
import { useState, useEffect } from "react";
import { CopyButton } from "./CopyButton";
import { doubleEncodePath } from "@/lib/utils";

interface CopyUrlButtonProps {
  slug: string;
  className?: string;
}

export const CopyUrlButton = ({ slug, className }: CopyUrlButtonProps) => {
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    // 在客户端获取完整 URL
    if (typeof window !== "undefined") {
      // 对多级路径的每个段进行双重 URL 编码，以支持中文、空格、表情等特殊字符，并兼容 GitHub Pages
      const encodedSlug = doubleEncodePath(slug);
      const url = `${window.location.origin}/prompts/${encodedSlug}`;
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

