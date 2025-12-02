import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 如果部署到自定义域名或根路径，请注释掉下面两行
  // 如果部署到 GitHub Pages 的子目录（如 username.github.io/repo-name），请取消注释并修改为 repo 名
  // basePath: "/prompts",
  // assetPrefix: "/prompts/",
};

export default nextConfig;
