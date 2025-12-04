"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn, doubleEncodePath, doubleEncodeURIComponent } from "@/lib/utils";
import { Prompt } from "@/lib/prompts";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(initialPrompts, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "tags", weight: 0.3 },
        { name: "slug", weight: 0.2 },
        { name: "description", weight: 0.1 },
        { name: "content", weight: 0.1 },
      ],
      threshold: 0.15,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [initialPrompts]);

  const filteredPrompts = useMemo(() => {
    let results = initialPrompts;

    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery);
      results = fuseResults.map(result => result.item);
    }

    if (activeCategory !== "all") {
      results = results.filter((p) => p.category === activeCategory);
    }

    return results;
  }, [searchQuery, activeCategory, initialPrompts, fuse]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-white hidden md:block">Explore Prompts</h2>
        
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-500 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            name="search"
            id="search-input"
            data-lpignore="true"
            data-form-type="other"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className="block w-full pl-10 pr-10 py-2.5 border border-neutral-800 rounded-xl leading-5 bg-neutral-900 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:bg-neutral-950 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 sm:text-sm"
            placeholder="Search prompts, tags, or keywords..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim() && activeCategory !== "all") {
                setActiveCategory("all");
              }
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <h2 className="text-xl font-bold mb-6 text-neutral-200 px-4 hidden md:block">
            Categories
          </h2>
          <nav className="space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "w-auto md:w-full text-left px-4 py-2 rounded-lg transition-colors relative flex-shrink-0 whitespace-nowrap",
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

        <main className="flex-1 min-h-[500px]">
            {filteredPrompts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                    <Search className="h-12 w-12 mb-4 opacity-20" />
                    <p>No prompts found matching your criteria.</p>
                    {searchQuery && (
                        <button 
                            onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                            className="mt-4 text-blue-400 hover:underline text-sm"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
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
                            <Link 
                              href={`/prompts/${doubleEncodePath(prompt.slug)}`} 
                              className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                            
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
                                    <Link key={tag} href={`/tags/${doubleEncodeURIComponent(tag)}`} className="text-xs text-neutral-500 hover:text-blue-400 transition-colors hover:underline">
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
            )}
        </main>
      </div>
    </div>
  );
};
