"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Prompt } from "@/lib/prompts";

interface Category {
  id: string;
  name: string;
}

export const PromptGallery = ({ 
  initialPrompts, 
  categories 
}: { 
  initialPrompts: Prompt[], 
  categories: Category[] 
}) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPrompts =
    activeCategory === "all"
      ? initialPrompts
      : initialPrompts.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-xl font-bold mb-6 text-neutral-200 px-4">
          Categories
        </h2>
        <nav className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "w-full text-left px-4 py-2 rounded-lg transition-colors relative",
                activeCategory === cat.id
                  ? "text-white"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              )}
            >
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-neutral-800 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode='popLayout'>
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div className="group h-full relative">
                  {/* Main Card Link */}
                  <Link href={`/prompts/${encodeURIComponent(prompt.slug)}`} className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  
                  <div className="h-full p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors group-hover:bg-neutral-800/50 flex flex-col pointer-events-none">
                    <div className="flex justify-between items-start mb-4">
                       <span className="px-2 py-1 rounded text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700 uppercase tracking-wider relative z-10">
                          {prompt.category}
                       </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-neutral-100 group-hover:text-blue-400 transition-colors relative z-10">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-neutral-400 line-clamp-3 mb-4 relative z-10">
                      {prompt.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto pointer-events-auto relative z-20">
                      {prompt.tags.map(tag => (
                          <Link key={tag} href={`/tags/${tag}`} className="text-xs text-neutral-500 hover:text-blue-400 transition-colors hover:underline">
                            #{tag}
                          </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};
