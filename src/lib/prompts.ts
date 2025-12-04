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
  filePath?: string; // 相对于项目根目录的文件路径，如 "content/coding/技术栈/.../novel-writer.md"
}

const contentDirectory = path.join(process.cwd(), "content");

/**
 * 递归读取目录下的所有 .md 文件
 */
function readMarkdownFilesRecursively(dir: string, baseDir: string = dir): Array<{ filePath: string; relativePath: string }> {
  const files: Array<{ filePath: string; relativePath: string }> = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // 递归读取子目录
      const subFiles = readMarkdownFilesRecursively(fullPath, baseDir);
      files.push(...subFiles);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      // 计算相对于 content 目录的路径
      const relativePath = path.relative(baseDir, fullPath);
      // 将路径分隔符统一为 /，并移除 .md 扩展名
      const slug = relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
      
      files.push({
        filePath: fullPath,
        relativePath: slug,
      });
    }
  }

  return files;
}

export function getAllPrompts(): Prompt[] {
  if (!fs.existsSync(contentDirectory)) {
    console.warn("Content directory not found at:", contentDirectory);
    return [];
  }

  // 获取所有顶级分类目录
  const categories = fs.readdirSync(contentDirectory).filter((file) => {
    return fs.statSync(path.join(contentDirectory, file)).isDirectory();
  });

  let allPrompts: Prompt[] = [];

  // 遍历每个分类目录，递归读取所有 .md 文件
  categories.forEach((category) => {
    const categoryPath = path.join(contentDirectory, category);
    const markdownFiles = readMarkdownFilesRecursively(categoryPath, contentDirectory);

    markdownFiles.forEach(({ filePath, relativePath }) => {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      
      // slug 使用完整的相对路径（相对于 content 目录），保留原始路径结构
      // 例如: "coding/技术栈/技术栈1/技术栈2/.../novel-writer"
      const slug = relativePath;
      
      // 从文件路径中提取文件名（不含扩展名）作为默认标题
      const fileName = path.basename(filePath, '.md');
      
      // 计算相对于项目根目录的文件路径
      const relativeFilePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

      allPrompts.push({
        slug: slug,
        title: data.title || fileName,
        description: data.description || "",
        category: category, // 第一级目录作为分类
        tags: data.tags || [],
        content: content,
        author: data.author,
        filePath: relativeFilePath, // 相对于项目根目录的路径
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
  // tag 参数应该已经是解码后的字符串，直接使用
  const normalizedTag = tag.toLowerCase();
  return prompts.filter(prompt => 
    prompt.tags.some(t => t.toLowerCase() === normalizedTag)
  );
}

export function getAllAuthors(): string[] {
  const prompts = getAllPrompts();
  const authors = new Set<string>();
  prompts.forEach(prompt => {
    if (prompt.author) {
      authors.add(prompt.author);
    }
  });
  return Array.from(authors);
}

export function getPromptsByAuthor(author: string): Prompt[] {
  const prompts = getAllPrompts();
  // author 参数应该已经是解码后的字符串，直接使用
  const normalizedAuthor = author.toLowerCase();
  return prompts.filter(prompt => 
    prompt.author && prompt.author.toLowerCase() === normalizedAuthor
  );
}
