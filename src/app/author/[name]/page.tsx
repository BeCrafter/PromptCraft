import { getAllAuthors, getPromptsByAuthor } from "@/lib/prompts";
import { getAuthorProfile } from "@/lib/authors";
import Link from "next/link";
import { notFound } from "next/navigation";
import { User, ArrowLeft, Layers, Hash, Sparkles, Trophy } from "lucide-react";
import type { Metadata } from "next";

/**
 * 安全地解码可能被编码或双重编码的作者名称参数
 * 处理 GitHub Pages 可能导致的编码问题
 */
function safeDecodeName(encodedName: string): string {
  try {
    // 如果参数不包含 %，说明没有被编码，直接返回
    if (!encodedName.includes('%')) {
      return encodedName;
    }
    
    // 先尝试解码一次
    let decoded = decodeURIComponent(encodedName);
    
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
    return encodedName;
  }
}

export async function generateStaticParams() {
  const authors = getAllAuthors();
  const params: Array<{ name: string }> = [];
  
  authors.forEach((author) => {
    const encoded = encodeURIComponent(author);
    // 添加单次编码的路径
    params.push({ name: encoded });
    
    // 添加双重编码的路径（将 % 编码为 %25），用于 GitHub Pages
    const doubleEncoded = encoded.replace(/%/g, '%25');
    if (doubleEncoded !== encoded) {
      params.push({ name: doubleEncoded });
    }
  });
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const name = safeDecodeName(resolvedParams.name);
  const prompts = getPromptsByAuthor(name);
  const profile = getAuthorProfile(name);

  if (prompts.length === 0) {
    return {
      title: "作者未找到",
    };
  }

  const description = `${profile.name} 在 PromptCraft（提示词工坊）贡献了 ${prompts.length} 个高质量AI提示词。${profile.bio || ''}`;

  return {
    title: `${profile.name} - 作者页面`,
    description,
    keywords: [
      profile.name,
      "PromptCraft",
      "提示词工坊",
      "AI提示词作者",
      ...prompts.map(p => p.category),
    ],
    openGraph: {
      title: `${profile.name} | PromptCraft - 提示词工坊`,
      description,
      type: "profile",
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  const name = safeDecodeName(resolvedParams.name);
  const prompts = getPromptsByAuthor(name);
  const profile = getAuthorProfile(name);

  if (prompts.length === 0) {
    return notFound();
  }

  // 计算统计数据
  const totalPrompts = prompts.length;
  const categories = [...new Set(prompts.map(p => p.category))];
  const topCategory = categories.sort((a, b) => 
    prompts.filter(p => p.category === b).length - prompts.filter(p => p.category === a).length
  )[0];
  const totalTags = new Set(prompts.flatMap(p => p.tags)).size;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 pb-20">
      {/* 1. Decorative Top Banner */}
      <div className="h-64 w-full bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-neutral-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-32">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
           <Link href="/prompts" className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-sm text-neutral-300 hover:text-white hover:bg-white/10 transition-all group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Library
           </Link>
           <Link href="/" className="text-sm text-neutral-500 hover:text-blue-400 transition-colors">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">PromptCraft</span>
           </Link>
        </div>

        {/* 2. Profile Header Card */}
        <div className="bg-[#0D0D0D] border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
                {/* Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1 shadow-xl ring-4 ring-black flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        <span className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-400">
                            {profile.name[0].toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-white">{profile.name}</h1>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                            {profile.role}
                        </span>
                    </div>
                    <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed">
                        {profile.bio}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6 md:border-l border-neutral-800 md:pl-8 w-full md:w-auto mt-6 md:mt-0">
                    <div className="text-center md:text-left">
                        <div className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                            {totalPrompts} <Sparkles className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1">Prompts</div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                            {totalTags} <Hash className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1">Tags</div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                            1 <Trophy className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1">Rank</div>
                    </div>
                </div>
            </div>
        </div>

        {/* 3. Content Section */}
        <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Layers className="w-6 h-6 text-neutral-400" />
                    Contributions
                </h2>
                <div className="text-sm text-neutral-500">
                    Top Category: <span className="text-blue-400 font-medium capitalize">{topCategory || 'N/A'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
                <Link 
                  href={`/prompts/${prompt.slug.split('/').map(segment => encodeURIComponent(segment)).join('/')}`} 
                  key={prompt.slug} 
                  className="block group h-full"
                >
                <div className="h-full p-6 rounded-2xl bg-[#0D0D0D] border border-neutral-800 hover:border-neutral-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-blue-900/10 flex flex-col relative overflow-hidden">
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700 uppercase tracking-wider group-hover:bg-neutral-700 transition-colors">
                        {prompt.category}
                    </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-neutral-100 group-hover:text-blue-400 transition-colors relative z-10">
                    {prompt.title}
                    </h3>
                    <p className="text-sm text-neutral-400 line-clamp-3 mb-4 relative z-10">
                    {prompt.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                    {prompt.tags.map(t => (
                        <span key={t} className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">#{t}</span>
                    ))}
                    </div>
                </div>
                </Link>
            ))}
            </div>
        </div>

      </div>
    </div>
  );
}
