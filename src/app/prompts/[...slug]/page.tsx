import { getAllPrompts, getPromptBySlug, getAdjacentPrompts } from "@/lib/prompts";
import { getAuthorProfile } from "@/lib/authors";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CopyButton } from "@/components/CopyButton";
import { CopyFilePathButton } from "@/components/CopyFilePathButton";
import { ArrowLeft, Tag, User, Layers, BookOpen, ChevronLeft, ChevronRight, Link as LinkIcon } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const prompts = getAllPrompts();
  return prompts.map((prompt) => {
    // 将 "coding/技术栈/技术栈1/..." 转换为 ["coding", "技术栈", "技术栈1", ...]
    // 在静态导出模式下，需要对每个路径段进行 URL 编码，以支持特殊字符
    const slugArray = prompt.slug.split('/').map(segment => encodeURIComponent(segment));
    return {
      slug: slugArray,
    };
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  // 将数组拼接回字符串，如 ["coding", "js-expert%20copy"] -> "coding/js-expert copy"
  // 对每个路径段进行 URL 解码，以支持中文、空格、表情等特殊字符
  const slug = Array.isArray(resolvedParams.slug) 
    ? resolvedParams.slug.map(segment => decodeURIComponent(segment)).join('/')
    : decodeURIComponent(resolvedParams.slug);
  const prompt = getPromptBySlug(slug);

  if (!prompt) {
    return {
      title: "提示词未找到",
    };
  }

  const description = prompt.description || `在 PromptCraft（提示词工坊）查看 ${prompt.title} 提示词。高质量AI提示词，专业制作，生产就绪。`;
  const keywords = [
    prompt.title,
    ...prompt.tags,
    prompt.category,
    "PromptCraft",
    "提示词工坊",
    "AI提示词",
    "ChatGPT提示词"
  ];

  return {
    title: `${prompt.title} - 提示词详情`,
    description,
    keywords,
    openGraph: {
      title: `${prompt.title} | PromptCraft - 提示词工坊`,
      description,
      type: "article",
      tags: prompt.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${prompt.title} | PromptCraft`,
      description,
    },
  };
}

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  // 将数组拼接回字符串，如 ["coding", "js-expert%20copy"] -> "coding/js-expert copy"
  // 对每个路径段进行 URL 解码，以支持中文、空格、表情等特殊字符
  const slug = Array.isArray(resolvedParams.slug) 
    ? resolvedParams.slug.map(segment => decodeURIComponent(segment)).join('/')
    : decodeURIComponent(resolvedParams.slug);
  const prompt = getPromptBySlug(slug);

  if (!prompt) {
    return notFound();
  }

  const { prev, next } = getAdjacentPrompts(slug);
  const authorProfile = getAuthorProfile(prompt.author || "BeCrafter Team");

  // 格式化路径显示：分离路径和文件名，长路径时截断中间部分
  const formatPathForDisplay = (fullPath: string) => {
    const parts = fullPath.split('/');
    if (parts.length <= 1) {
      return { pathParts: [], fileName: parts[0] || fullPath };
    }
    const fileName = parts[parts.length - 1];
    const pathParts = parts.slice(0, -1);
    return { pathParts, fileName };
  };

  const { pathParts, fileName } = formatPathForDisplay(prompt.slug);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Background Grid Texture */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10">
        
        {/* Breadcrumb / Back */}
        <div className="mb-8 flex items-center justify-between">
           <Link href="/prompts" className="inline-flex items-center text-sm text-neutral-500 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Library
           </Link>
           <Link href="/" className="text-sm text-neutral-500 hover:text-blue-400 transition-colors">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">PromptCraft</span>
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Main Content (8/12) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header Section (Title & Desc) */}
            <div>
               <div 
                 className="flex items-center gap-2 mb-6 min-w-0 w-full overflow-hidden relative"
                 style={{
                  paddingBottom: '0.8rem',
                   /*padding: '0.8rem 0',
                   background: 'linear-gradient(to right, #000000 0%, #716cf71f 50%, #000000 100%)'*/
                 }}
               >
                  {/* 渐变底部边框：中间粗高亮，两头细且暗 */}
                  <div 
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      height: '1px',
                      background: 'linear-gradient(to right, transparent 0%, #1a1a1a 15%, #262626 30%, #404040 50%, #262626 70%, #1a1a1a 85%, transparent 100%)',
                      boxShadow: '0 0 4px rgba(113, 108, 247, 0.4), 0 0 8px rgba(113, 108, 247, 0.2)'
                    }}
                  ></div>
                  {/* 中间高亮层 */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                    style={{
                      width: '40%',
                      height: '2px',
                      background: 'linear-gradient(to right, transparent, #716cf7, transparent)',
                      opacity: 0.6
                    }}
                  ></div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                    <Layers className="w-3 h-3" />
                    {prompt.category}
                  </span>
                  <span className="text-neutral-600 flex-shrink-0">/</span>
                  {/* 路径部分（可截断） */}
                  {pathParts.length > 0 && (
                    <span className="text-neutral-400 text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                      {pathParts.join('/')}
                    </span>
                  )}
                  {pathParts.length > 0 && (
                    <span className="text-neutral-600 flex-shrink-0">/</span>
                  )}
                  {/* 文件名（不截断） */}
                  <span className="text-neutral-400 text-sm font-mono flex-shrink-0 whitespace-nowrap">
                    {fileName}
                  </span>
               </div>
               <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                 {prompt.title}
               </h1>
               <p className="text-lg text-neutral-400 leading-relaxed border-l-2 border-neutral-800 pl-4">
                 {prompt.description}
               </p>
            </div>

            {/* The "IDE" Window */}
            <div className="rounded-xl overflow-hidden bg-[#0D0D0D] border border-neutral-800 shadow-2xl ring-1 ring-white/5">
                {/* Window Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#171717] border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="text-xs font-mono text-neutral-500">prompt.md</div>
                    <div className="w-10" /> {/* Spacer for balance */}
                </div>
                
                {/* Content Body */}
                <div className="p-6 md:p-8 min-h-[300px]">
                    <MarkdownRenderer content={prompt.content} />
                </div>
            </div>

            {/* Prev/Next Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-neutral-900">
                {prev ? (
                  <Link 
                    href={`/prompts/${prev.slug.split('/').map(segment => encodeURIComponent(segment)).join('/')}`}
                    className="group p-4 rounded-lg border border-neutral-800 bg-neutral-900/20 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all"
                  >
                    <div className="text-xs text-neutral-500 mb-1 flex items-center gap-1">
                        <ChevronLeft className="w-3 h-3" /> Previous
                    </div>
                    <div className="font-medium text-neutral-200 group-hover:text-white truncate">{prev.title}</div>
                  </Link>
                ) : <div />}

                {next && (
                  <Link 
                    href={`/prompts/${next.slug.split('/').map(segment => encodeURIComponent(segment)).join('/')}`}
                    className="group p-4 rounded-lg border border-neutral-800 bg-neutral-900/20 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all text-right"
                  >
                    <div className="text-xs text-neutral-500 mb-1 flex items-center justify-end gap-1">
                        Next <ChevronRight className="w-3 h-3" />
                    </div>
                    <div className="font-medium text-neutral-200 group-hover:text-white truncate">{next.title}</div>
                  </Link>
                )}
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar (4/12) */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
                
                {/* Metadata Card - 优化顶部边框，使其与左侧更协调 */}
                <div className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-800 border-t-neutral-800/50">
                    {/* Author Section with Config Data */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-green-400" />
                            Author
                        </h3>
                        <Link href={`/author/${encodeURIComponent(authorProfile.name)}`} className="group block">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold ring-2 ring-black group-hover:ring-blue-500 transition-all">
                                    {authorProfile.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                        {authorProfile.name}
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                        {authorProfile.role}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-400 line-clamp-2 group-hover:text-neutral-300 transition-colors">
                                {authorProfile.bio}
                            </p>
                        </Link>
                    </div>

                    {/* Tags Section */}
                    <div className="pt-6 border-t border-neutral-800 mb-6">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-purple-400" />
                            Tags
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-0">
                            {prompt.tags.map(tag => (
                                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="px-2.5 py-1 rounded-md text-xs bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors border border-neutral-700/50">
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="pt-6 border-t border-neutral-800">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-400" />
                            Actions
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <CopyButton 
                                text={prompt.content} 
                                variant="button" 
                                label="Copy Prompt" 
                                className="flex-1 justify-center min-w-0 text-xs px-3 py-1.5" 
                            />
                            {prompt.filePath && (
                                <CopyFilePathButton 
                                    slug={slug} 
                                    className="flex-1 justify-center min-w-0 text-xs px-3 py-1.5" 
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Usage Guide Mini */}
                <div className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-800">
                     <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-yellow-400" />
                        Quick Guide
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-xs text-neutral-400">
                            <span className="flex-shrink-0 w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-300 font-mono">1</span>
                            <span>Copy the prompt code.</span>
                        </li>
                        <li className="flex gap-3 text-xs text-neutral-400">
                            <span className="flex-shrink-0 w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-300 font-mono">2</span>
                            <span>Look for <span className="text-blue-400">[placeholders]</span> and fill them.</span>
                        </li>
                        <li className="flex gap-3 text-xs text-neutral-400">
                            <span className="flex-shrink-0 w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-neutral-300 font-mono">3</span>
                            <span>Run in your AI model.</span>
                        </li>
                    </ul>
                </div>

            </div>
          </div>

        </div>

        {/* Footer simple */}
        <div className="mt-20 pt-8 border-t border-neutral-900 text-center text-neutral-600 text-sm">
            © 2025 <span className="text-blue-400">PromptCraft</span> - 提示词工坊. Open Source Intelligence.
        </div>
      </div>
    </div>
  );
}

