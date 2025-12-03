import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface AuthorProfile {
  name: string;
  role: string;
  bio: string;
  avatar?: string; 
  social?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

interface AuthorsConfig {
  authors: AuthorProfile[];
}

const authorsFilePath = path.join(process.cwd(), "content/authors.yml");

export function getAuthorsData(): AuthorProfile[] {
  try {
    if (!fs.existsSync(authorsFilePath)) {
      console.warn("Authors config file not found:", authorsFilePath);
      return [];
    }
    const fileContents = fs.readFileSync(authorsFilePath, "utf8");
    const data = yaml.load(fileContents) as AuthorsConfig;
    return data.authors || [];
  } catch (error) {
    console.error("Error reading authors config:", error);
    return [];
  }
}

export function getAuthorProfile(name: string): AuthorProfile {
  const authors = getAuthorsData();
  
  // 大小写不敏感查找
  const profile = authors.find(
    (a) => a.name.toLowerCase() === name.toLowerCase()
  );

  if (profile) {
    return profile;
  }

  // 兜底信息
  return {
    name: name,
    role: "Prompt Contributor",
    bio: `A valued contributor to the BeCrafter prompt collection. Explore ${name}'s curated prompts below.`,
  };
}
