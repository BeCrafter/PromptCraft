import { getAllPrompts, getAllCategories } from "@/lib/prompts";
import { PromptGallery } from "@/components/PromptGallery";
import type { Metadata } from "next";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "提示词库 - 探索所有提示词",
  description: "浏览 PromptCraft（提示词工坊）的完整提示词集合。按分类、标签搜索高质量的AI提示词，包括编程、写作、图像生成等各类提示词。",
  keywords: ["提示词库", "AI提示词集合", "编程提示词", "写作提示词", "ChatGPT提示词", "PromptCraft"],
  openGraph: {
    title: "提示词库 | PromptCraft - 提示词工坊",
    description: "浏览完整的AI提示词集合，按分类和标签搜索高质量提示词",
  },
};

export default function PromptsPage() {
  const prompts = getAllPrompts();
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            PromptCraft
          </span>
          <span className="text-white ml-2">提示词工坊</span>
        </h1>
        <p className="text-neutral-400">探索精心策划的AI提示词集合</p>
      </div>
      <PromptGallery initialPrompts={prompts} categories={categories} />
    </div>
  );
}
