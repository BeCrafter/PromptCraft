import { getAllPrompts, getPromptBySlug, getAdjacentPrompts } from "@/lib/prompts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CopyButton } from "@/components/CopyButton";
import { ArrowLeft, Tag, User, Layers, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

export async function generateStaticParams() {
  const prompts = getAllPrompts();
  return prompts.map((prompt) => ({
    slug: prompt.slug,
  }));
}

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const prompt = getPromptBySlug(resolvedParams.slug);

  if (!prompt) {
    return notFound();
  }

  const { prev, next } = getAdjacentPrompts(resolvedParams.slug);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Background Grid Texture */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10">
        
        {/* Breadcrumb / Back */}
        <div className="mb-8">
           <Link href="/prompts" className="inline-flex items-center text-sm text-neutral-500 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Library
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Main Content (8/12) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header Section (Title & Desc) */}
            <div>
               <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {prompt.category}
                  </span>
                  <span className="text-neutral-600">/</span>
                  <span className="text-neutral-400 text-sm font-mono">{prompt.slug}</span>
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
                    href={`/prompts/${encodeURIComponent(prev.slug)}`}
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
                    href={`/prompts/${encodeURIComponent(next.slug)}`}
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
            <div className="sticky top-24 space-y-6">
                
                {/* Primary Action Card */}
                <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        Actions
                    </h3>
                    <CopyButton text={prompt.content} variant="button" label="Copy Full Prompt" className="w-full justify-center py-3" />
                    <p className="text-xs text-center text-neutral-500 mt-3">
                        Click to copy raw markdown format
                    </p>
                </div>

                {/* Metadata Card */}
                <div className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-800">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-purple-400" />
                        Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {prompt.tags.map(tag => (
                            <Link key={tag} href={`/tags/${tag}`} className="px-2.5 py-1 rounded-md text-xs bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors border border-neutral-700/50">
                                #{tag}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-neutral-800">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-green-400" />
                            Author
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                {prompt.author?.[0] || "B"}
                            </div>
                            <div className="text-sm text-neutral-300">
                                {prompt.author || "BeCrafter Team"}
                            </div>
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
            © 2025 BeCrafter Prompts. Open Source Intelligence.
        </div>
      </div>
    </div>
  );
}
