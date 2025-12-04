import { getAllPrompts, getPromptBySlug } from "@/lib/prompts";
import { NextResponse } from "next/server";
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
  // 解码 slug，支持中文、空格、表情等特殊字符
  const slug = Array.isArray(resolvedParams.slug) 
    ? resolvedParams.slug.map(segment => decodeURIComponent(segment)).join('/')
    : decodeURIComponent(resolvedParams.slug);
  
  const prompt = getPromptBySlug(slug);

  if (!prompt || !prompt.filePath) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 读取原始文件内容
  const filePath = path.join(process.cwd(), prompt.filePath);
  
  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, "utf8");

  // 返回纯文本响应，设置正确的 Content-Type
  return new NextResponse(fileContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

