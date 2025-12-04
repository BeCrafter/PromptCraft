import type { NextConfig } from "next";

// 从环境变量获取仓库名，如果不存在则使用默认值
// 在 GitHub Actions 中，GITHUB_REPOSITORY 格式为 "owner/repo-name"
// 对于 GitHub Pages，如果是子目录部署，basePath 应该是 "/repo-name"
const getBasePath = () => {
  // 如果设置了 NEXT_PUBLIC_BASE_PATH，使用它
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  
  // 在 GitHub Actions 中，从 GITHUB_REPOSITORY 提取仓库名
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
    // 如果是 username.github.io，则不需要 basePath
    if (repoName && !repoName.includes('.github.io')) {
      return `/${repoName}`;
    }
  }
  
  // 默认情况下，如果没有设置，返回空字符串（根路径部署）
  // 如果需要子目录部署，可以通过环境变量设置
  return '';
};

const basePath = getBasePath();

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 自动检测 basePath，支持 GitHub Pages 子目录部署
  // 如果部署到根路径（username.github.io），basePath 为空
  // 如果部署到子目录（username.github.io/repo-name），basePath 为 "/repo-name"
  ...(basePath && {
    basePath: basePath,
    assetPrefix: `${basePath}/`,
  }),
};

export default nextConfig;
