import { getAllPrompts, getPromptBySlug } from "@/lib/prompts";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  const prompts = getAllPrompts();
  return prompts.map((prompt) => {
    // 对每个路径段进行 URL 编码，支持中文、空格、表情等特殊字符
    const slugArray = prompt.slug.split('/').map(segment => encodeURIComponent(segment));
    return {
      slug: slugArray,
    };
  });
}

export default async function RawFilePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  // 解码 slug，支持中文、空格、表情等特殊字符
  const slug = Array.isArray(resolvedParams.slug) 
    ? resolvedParams.slug.map(segment => decodeURIComponent(segment)).join('/')
    : decodeURIComponent(resolvedParams.slug);
  
  const prompt = getPromptBySlug(slug);

  if (!prompt || !prompt.filePath) {
    return notFound();
  }

  // 读取原始文件内容
  const filePath = path.join(process.cwd(), prompt.filePath);
  
  if (!fs.existsSync(filePath)) {
    return notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf8");

  // 转义 HTML 特殊字符，确保 markdown 内容作为纯文本显示
  const escapedContent = fileContent
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // 返回 HTML 页面，渲染 markdown 内容为纯文本
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <title>{path.basename(prompt.filePath)}</title>
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              height: 100%;
            }
            body {
              margin: 0;
              padding: 20px;
              background: #0a0a0a;
              color: #e5e5e5;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New', monospace;
              font-size: 14px;
              line-height: 1.6;
              white-space: pre-wrap;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            @media (max-width: 768px) {
              body {
                padding: 15px;
                font-size: 13px;
              }
            }
          `
        }} />
      </head>
      <body>
        <pre style={{ 
          margin: 0, 
          padding: 0, 
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}>{escapedContent}</pre>
      </body>
    </html>
  );
}

