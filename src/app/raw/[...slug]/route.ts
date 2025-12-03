import { getAllPrompts, getPromptBySlug } from "@/lib/prompts";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const prompts = getAllPrompts();
  return prompts.map((prompt) => {
    // 对每个路径段进行 URL 编码
    const slugArray = prompt.slug.split('/').map(segment => encodeURIComponent(segment));
    return {
      slug: slugArray,
    };
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
  // 解码 slug
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

  // 直接返回原始 markdown 内容，不添加任何 HTML
  return new Response(fileContent, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

