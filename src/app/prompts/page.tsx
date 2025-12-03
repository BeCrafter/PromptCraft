import { getAllPrompts, getAllCategories } from "@/lib/prompts";
import { PromptGallery } from "@/components/PromptGallery";

export const dynamic = 'force-static';

export default function PromptsPage() {
  const prompts = getAllPrompts();
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <PromptGallery initialPrompts={prompts} categories={categories} />
    </div>
  );
}
