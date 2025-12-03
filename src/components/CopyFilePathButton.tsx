"use client";
import { useState, useEffect } from "react";
import { CopyButton } from "./CopyButton";

interface CopyFilePathButtonProps {
  slug: string;
  className?: string;
}

export const CopyFilePathButton = ({ slug, className }: CopyFilePathButtonProps) => {
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    // 在客户端获取完整 URL
    if (typeof window !== "undefined") {
      // 构建原始文件访问 URL
      // 例如: /raw/coding/技术栈/技术栈1/.../novel-writer
      const encodedSlug = slug.split('/').map(segment => encodeURIComponent(segment)).join('/');
      const url = `${window.location.origin}/raw/${encodedSlug}`;
      setFileUrl(url);
    }
  }, [slug]);

  if (!fileUrl) {
    return null;
  }

  return (
    <CopyButton 
      text={fileUrl} 
      variant="button" 
      label="Copy Path" 
      className={className} 
    />
  );
};

