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
      // 获取 basePath（从当前路径中提取）
      // 例如：如果当前路径是 /PromptCraft/prompts/...，basePath 是 /PromptCraft
      // 如果当前路径是 /prompts/...，basePath 是空字符串
      const pathname = window.location.pathname;
      let basePath = '';
      
      // 提取 basePath：检查路径的第一个段是否是已知路由
      // 已知路由：prompts, author, tags, raw
      const pathSegments = pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        const firstSegment = pathSegments[0];
        // 如果第一个段不是已知路由，说明它是 basePath
        if (!['prompts', 'author', 'tags', 'raw'].includes(firstSegment)) {
          basePath = `/${firstSegment}`;
        }
      }
      
      // 构建原始文件访问 URL（添加 .md 后缀）
      // 例如: /raw/coding/技术栈/技术栈1/.../novel-writer.md
      // 或: /PromptCraft/raw/coding/技术栈/技术栈1/.../novel-writer.md
      const encodedSlug = slug.split('/').map(segment => encodeURIComponent(segment)).join('/');
      const url = `${window.location.origin}${basePath}/raw/${encodedSlug}.md`;
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

