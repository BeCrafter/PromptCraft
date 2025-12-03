import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Prompt {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  author?: string;
}

const contentDirectory = path.join(process.cwd(), "content");

export function getAllPrompts(): Prompt[] {
  // 确保 content 目录存在
  if (!fs.existsSync(contentDirectory)) {
    console.warn("Content directory not found at:", contentDirectory);
    return [];
  }

  const categories = fs.readdirSync(contentDirectory).filter((file) => {
    return fs.statSync(path.join(contentDirectory, file)).isDirectory();
  });

  let allPrompts: Prompt[] = [];

  categories.forEach((category) => {
    const categoryPath = path.join(contentDirectory, category);
    const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".md"));

    files.forEach((file) => {
      const filePath = path.join(categoryPath, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      
      // 强制处理 Slug：去后缀 -> 替换空格为横杠
      const slug = file.replace(/\.md$/, "").replace(/\s+/g, '-');

      allPrompts.push({
        slug: slug,
        title: data.title || slug,
        description: data.description || "",
        category: category,
        tags: data.tags || [],
        content: content,
        author: data.author,
      });
    });
  });

  return allPrompts;
}

export function getPromptBySlug(slug: string): Prompt | undefined {
  const allPrompts = getAllPrompts();
  return allPrompts.find((p) => p.slug === slug);
}

export function getAdjacentPrompts(slug: string): { prev?: Prompt; next?: Prompt } {
  const allPrompts = getAllPrompts();
  const index = allPrompts.findIndex((p) => p.slug === slug);

  if (index === -1) return {};

  const prev = index > 0 ? allPrompts[index - 1] : undefined;
  const next = index < allPrompts.length - 1 ? allPrompts[index + 1] : undefined;

  return { prev, next };
}

export function getAllCategories() {
  const prompts = getAllPrompts();
  const categories = new Set(prompts.map(p => p.category));
  return [
    { id: "all", name: "All Prompts" },
    ...Array.from(categories).map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ')
    }))
  ];
}

export function getAllTags(): string[] {
  const prompts = getAllPrompts();
  const tags = new Set<string>();
  prompts.forEach(prompt => {
    prompt.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
}

export function getPromptsByTag(tag: string): Prompt[] {
  const prompts = getAllPrompts();
  const normalizedTag = decodeURIComponent(tag).toLowerCase();
  return prompts.filter(prompt => 
    prompt.tags.some(t => t.toLowerCase() === normalizedTag)
  );
}
