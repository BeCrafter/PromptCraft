import { getAllPrompts, getPromptBySlug, getAdjacentPrompts } from "@/lib/prompts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CopyButton } from "@/components/CopyButton";

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
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 relative">
           <Link href="/prompts" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors mb-8 inline-block">
              ← Back to Gallery
           </Link>
           
           <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
               <div className="flex-1">
                   <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                        {prompt.category}
                      </span>
                      {prompt.tags.map(tag => (
                          <Link key={tag} href={`/tags/${tag}`} className="text-xs text-neutral-500 hover:text-blue-400 transition-colors">#{tag}</Link>
                      ))}
                   </div>
                   <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                     {prompt.title}
                   </h1>
                   <p className="mt-6 text-lg text-neutral-400 max-w-2xl">
                     {prompt.description}
                   </p>
               </div>
               
               {/* 全文复制按钮 */}
               <div className="flex-shrink-0">
                   <CopyButton text={prompt.content} variant="button" label="Copy Full Prompt" />
               </div>
           </div>
        </div>

        {/* Content Render Area */}
        <div className="w-full mb-16">
            <MarkdownRenderer content={prompt.content} />
        </div>

        {/* Usage Guide */}
        <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 p-8 mb-12">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                How to use this prompt
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-sm text-neutral-400">
                <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold border border-neutral-700">1</div>
                    <div className="font-semibold text-neutral-200 text-base">Copy & Paste</div>
                    <p>Click the "Copy Full Prompt" button at the top to get the raw markdown content ready for your AI tool.</p>
                </div>
                <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold border border-neutral-700">2</div>
                    <div className="font-semibold text-neutral-200 text-base">Fill Placeholders</div>
                    <p>Look for bracketed text like <code className="text-blue-400 bg-blue-400/10 px-1 py-0.5 rounded border border-blue-500/20">[Subject]</code> within the prompt and replace them with your specific details.</p>
                </div>
                <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold border border-neutral-700">3</div>
                    <div className="font-semibold text-neutral-200 text-base">Execute</div>
                    <p>Paste the customized prompt into ChatGPT, Claude, or Midjourney to generate your desired result.</p>
                </div>
            </div>
        </div>

        {/* Prev/Next Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {prev ? (
              <Link 
                href={`/prompts/${encodeURIComponent(prev.slug)}`}
                className="group p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900 hover:border-neutral-700 transition-all text-left"
              >
                <div className="text-xs text-neutral-500 mb-2 uppercase tracking-wider group-hover:text-blue-400 transition-colors">← Previous</div>
                <div className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">{prev.title}</div>
              </Link>
            ) : (
              <div /> 
            )}

            {next && (
              <Link 
                href={`/prompts/${encodeURIComponent(next.slug)}`}
                className="group p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900 hover:border-neutral-700 transition-all text-right"
              >
                <div className="text-xs text-neutral-500 mb-2 uppercase tracking-wider group-hover:text-blue-400 transition-colors">Next →</div>
                <div className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">{next.title}</div>
              </Link>
            )}
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-neutral-900 flex justify-between items-center text-neutral-500 text-sm">
            <p>Author: {prompt.author || "BeCrafter Team"}</p>
            <p>License: MIT</p>
        </div>
      </div>
    </div>
  );
}
