import { getAllTags, getPromptsByTag } from "@/lib/prompts";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { doubleEncodeURIComponent } from "@/lib/utils";

/**
 * 安全地解码可能被编码或双重编码的标签参数
 * 处理 GitHub Pages 可能导致的编码问题
 */
function safeDecodeTag(encodedTag: string): string {
  try {
    // 如果参数不包含 %，说明没有被编码，直接返回
    if (!encodedTag.includes('%')) {
      return encodedTag;
    }
    
    // 先尝试解码一次
    let decoded = decodeURIComponent(encodedTag);
    
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
    return encodedTag;
  }
}

export async function generateStaticParams() {
  const tags = getAllTags();
  // 生成两种路径：单次编码和双重编码
  // 这样可以同时支持本地开发（单次编码）和 GitHub Pages（可能双重编码）
  const params: Array<{ tag: string }> = [];
  
  tags.forEach((tag) => {
    const encoded = encodeURIComponent(tag);
    // 添加单次编码的路径
    params.push({ tag: encoded });
    
    // 添加双重编码的路径（将 % 编码为 %25），用于 GitHub Pages
    const doubleEncoded = encoded.replace(/%/g, '%25');
    if (doubleEncoded !== encoded) {
      params.push({ tag: doubleEncoded });
    }
  });
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = safeDecodeTag(resolvedParams.tag);
  const prompts = getPromptsByTag(tag);

  if (prompts.length === 0) {
    return {
      title: "标签未找到",
    };
  }

  const description = `在 PromptCraft（提示词工坊）浏览标签为 "${tag}" 的 ${prompts.length} 个高质量AI提示词。`;

  return {
    title: `#${tag} - 标签页面`,
    description,
    keywords: [
      tag,
      "PromptCraft",
      "提示词工坊",
      "AI提示词",
      "标签",
      ...prompts.map(p => p.category),
    ],
    openGraph: {
      title: `#${tag} | PromptCraft - 提示词工坊`,
      description,
    },
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const resolvedParams = await params;
  const tag = safeDecodeTag(resolvedParams.tag);
  const prompts = getPromptsByTag(tag);

  if (prompts.length === 0) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
           <div className="flex items-center justify-between mb-6">
             <Link href="/prompts" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors inline-block">
                ← Back to All Prompts
             </Link>
             <Link href="/" className="text-sm text-neutral-500 hover:text-blue-400 transition-colors">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">PromptCraft</span>
             </Link>
           </div>
           <h1 className="text-4xl font-bold flex items-center gap-3">
             <span className="text-blue-500">#</span>
             {tag}
             <span className="text-lg font-normal text-neutral-500 ml-2">({prompts.length} prompts)</span>
           </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Link 
              href={`/prompts/${prompt.slug.split('/').map(segment => encodeURIComponent(segment)).join('/')}`} 
              key={prompt.slug} 
              className="block group h-full"
            >
              <div className="h-full p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors group-hover:bg-neutral-800/50 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <span className="px-2 py-1 rounded text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700 uppercase tracking-wider">
                      {prompt.category}
                   </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-neutral-100 group-hover:text-blue-400 transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-sm text-neutral-400 line-clamp-3 mb-4">
                  {prompt.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {prompt.tags.map(t => (
                      <Link key={t} href={`/tags/${doubleEncodeURIComponent(t)}`} className={`text-xs ${t.toLowerCase() === tag.toLowerCase() ? 'text-blue-400 font-bold' : 'text-neutral-500'}`}>#{t}</Link>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
