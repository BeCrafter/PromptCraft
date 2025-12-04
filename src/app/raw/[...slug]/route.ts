import { getAllPrompts, getPromptBySlug } from "@/lib/prompts";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-static';
export const revalidate = false;

/**
 * 安全地解码可能被编码或双重编码的路径段
 * 处理 GitHub Pages 可能导致的编码问题
 */
function safeDecodeSegment(encodedSegment: string): string {
  try {
    // 如果参数不包含 %，说明没有被编码，直接返回
    if (!encodedSegment.includes('%')) {
      return encodedSegment;
    }
    
    // 先尝试解码一次
    let decoded = decodeURIComponent(encodedSegment);
    
    // 检查解码后的字符串是否仍然包含编码字符（如 %E5）
    // 如果包含，说明可能被双重编码，尝试再次解码
    if (decoded.includes('%')) {
      try {
        const doubleDecoded = decodeURIComponent(decoded);
        // 如果二次解码成功且结果不同，且不再包含编码字符，使用二次解码的结果
        if (doubleDecoded !== decoded && !doubleDecoded.includes('%')) {
          return doubleDecoded;
        }
        // 如果二次解码后仍然包含编码字符，说明可能是无效的编码，使用第一次解码的结果
        return decoded;
      } catch {
        // 二次解码失败，使用第一次解码的结果
        return decoded;
      }
    }
    
    return decoded;
  } catch {
    // 解码失败，返回原始值
    return encodedSegment;
  }
}

export async function generateStaticParams() {
  const prompts = getAllPrompts();
  // raw 路由只使用单次编码，与 postbuild.js 中的生成逻辑保持一致
  return prompts.map((prompt) => {
    // 对每个路径段进行 URL 编码，支持中文、空格、表情等特殊字符
    // 添加 .md 后缀，URL 格式：/raw/coding/js-expert.md
    const slugArray = prompt.slug.split('/').map(segment => encodeURIComponent(segment));
    // 最后一个路径段添加 .md 后缀
    slugArray[slugArray.length - 1] = slugArray[slugArray.length - 1] + '.md';
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
  // 安全解码 slug，支持中文、空格、表情等特殊字符，并处理可能的双重编码
  let slug = Array.isArray(resolvedParams.slug) 
    ? resolvedParams.slug.map(segment => safeDecodeSegment(segment)).join('/')
    : safeDecodeSegment(resolvedParams.slug);
  
  // 如果 URL 以 .md 结尾，去掉 .md 后缀（用于匹配 prompt slug）
  if (slug.endsWith('.md')) {
    slug = slug.slice(0, -3);
  }
  
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

