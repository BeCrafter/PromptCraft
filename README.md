# PromptCraft - 提示词工坊

<div align="center">

![PromptCraft](https://img.shields.io/badge/PromptCraft-提示词工坊-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**一个优雅、现代的 AI 提示词库展示平台**

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [部署指南](#-部署指南) • [贡献指南](#-贡献指南)

</div>

---

## 📖 项目简介

PromptCraft（提示词工坊）是一个精心设计的 AI 提示词库展示平台，帮助开发者、创作者和 AI 爱好者发现、管理和使用高质量的 AI 提示词。项目采用 Next.js 构建，支持静态导出，可以轻松部署到 GitHub Pages 或其他静态托管服务。

### ✨ 核心特点

- 🎨 **现代化 UI 设计** - 采用深色主题，渐变效果，流畅动画
- 🔍 **强大的搜索功能** - 基于 Fuse.js 的模糊搜索，支持标题、标签、内容等多维度搜索
- 📁 **灵活的文件组织** - 支持多级目录结构，自动递归读取
- 🌏 **国际化支持** - 完美支持中文、空格、表情等特殊字符
- 📝 **Markdown 渲染** - 支持完整的 Markdown 语法，包括 Mermaid 图表
- 🏷️ **标签系统** - 灵活的标签分类和筛选
- 👤 **作者系统** - 展示提示词作者信息和贡献
- 📋 **一键复制** - 快速复制提示词内容和文件路径
- 📱 **响应式设计** - 完美适配桌面端和移动端

## 🚀 功能特性

### 主要功能

- ✅ **提示词库浏览** - 按分类浏览所有提示词
- ✅ **智能搜索** - 实时搜索提示词标题、标签、内容
- ✅ **分类筛选** - 按分类快速筛选提示词
- ✅ **标签导航** - 通过标签发现相关提示词
- ✅ **作者页面** - 查看作者的所有提示词
- ✅ **详情页面** - 完整的提示词详情展示
- ✅ **原始文件访问** - 直接访问 markdown 源文件
- ✅ **多级目录支持** - 支持任意深度的目录嵌套
- ✅ **路径截断显示** - 智能截断长路径，保持文件名完整

### 技术亮点

- 🎯 **静态站点生成** - 构建时生成所有页面，加载速度快
- 🔄 **自动路由生成** - 基于文件结构自动生成路由
- 💾 **Front Matter 解析** - 支持 YAML Front Matter 元数据
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架
- 🎭 **Framer Motion** - 流畅的页面动画效果
- 📊 **Mermaid 图表** - 支持在提示词中嵌入流程图、时序图等

## 🛠️ 技术栈

### 核心框架

- **[Next.js 16](https://nextjs.org/)** - React 全栈框架，App Router
- **[React 19](https://react.dev/)** - UI 库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全

### UI 和样式

- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[Framer Motion](https://www.framer.com/motion/)** - 动画库
- **[Lucide React](https://lucide.dev/)** - 图标库

### 功能库

- **[Fuse.js](https://fusejs.io/)** - 轻量级模糊搜索库
- **[react-markdown](https://github.com/remarkjs/react-markdown)** - Markdown 渲染
- **[gray-matter](https://github.com/jonschlinkert/gray-matter)** - Front Matter 解析
- **[Mermaid](https://mermaid.js.org/)** - 图表渲染
- **[js-yaml](https://github.com/nodeca/js-yaml)** - YAML 解析

## 📦 快速开始

### 环境要求

- Node.js 20+ 
- npm / yarn / pnpm

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `out/` 目录。

## 📁 项目结构

```
prompts/
├── content/                # 提示词内容目录
│   ├── authors.yml         # 作者配置文件
│   ├── coding/             # 编程类提示词
│   ├── writing/            # 写作类提示词
│   └── image-gen/          # 图像生成类提示词
├── public/                 # 静态资源
├── src/
│   ├── app/                # Next.js App Router 页面
│   │   ├── page.tsx        # 首页
│   │   ├── prompts/        # 提示词相关页面
│   │   ├── author/         # 作者页面
│   │   ├── tags/           # 标签页面
│   │   └── raw/            # 原始文件访问
│   ├── components/         # React 组件
│   │   ├── PromptGallery.tsx    # 提示词画廊
│   │   ├── MarkdownRenderer.tsx # Markdown 渲染器
│   │   ├── CopyButton.tsx       # 复制按钮
│   │   └── ...
│   └── lib/                # 工具函数
│       ├── prompts.ts      # 提示词处理逻辑
│       ├── authors.ts      # 作者处理逻辑
│       └── utils.ts        # 工具函数
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 部署配置
└── next.config.ts          # Next.js 配置
```

## 📝 添加提示词

### 文件结构

在 `content/` 目录下创建 markdown 文件，支持多级目录：

```
content/
  └── category/
      └── subcategory/
          └── prompt-name.md
```

### Front Matter 格式

每个提示词文件需要包含 YAML Front Matter：

```yaml
---
title: 提示词标题
description: 提示词描述
tags: [标签1, 标签2, 标签3]
author: 作者名称
---
```

### 示例

创建 `content/coding/javascript-expert.md`:

```markdown
---
title: JavaScript Expert
description: Master modern JavaScript with this expert persona.
tags: [JavaScript, React, Node.js]
author: Sean
---

# JavaScript Expert

You are a senior JavaScript engineer with deep knowledge of:
- ES6+ features
- Asynchronous programming
- Performance optimization

Please explain [Topic] with code examples.
```

### 支持的功能

- ✅ **Markdown 语法** - 完整的 Markdown 支持
- ✅ **代码高亮** - 自动识别代码语言
- ✅ **Mermaid 图表** - 使用 ` ```mermaid ` 代码块
- ✅ **多级目录** - 支持任意深度的目录嵌套
- ✅ **中文路径** - 完美支持中文文件名和目录名

## 👥 作者配置

在 `content/authors.yml` 中配置作者信息：

```yaml
authors:
  - name: Sean
    role: Prompt Architect
    bio: Full-stack developer and AI enthusiast. Specializing in structured prompts and system design.
    social:
      github: sean
      twitter: sean
      website: https://example.com
```

## 🚀 部署指南

### GitHub Pages 部署

项目已配置 GitHub Actions 自动部署，详细步骤请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)。

#### 快速部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 **GitHub Actions**

3. **自动部署**
   - 每次推送到 `main` 分支会自动触发部署
   - 在 Actions 标签页查看部署状态

### 其他部署方式

项目支持静态导出，可以部署到任何静态托管服务：

- Vercel
- Netlify
- Cloudflare Pages
- 自建服务器

## 🎨 自定义配置

### 修改主题颜色

编辑 `tailwind.config.ts` 中的颜色配置。

### 修改站点信息

- 站点标题：修改 `src/app/layout.tsx`
- 首页内容：修改 `src/app/page.tsx`
- SEO 信息：在各页面的 `metadata` 中配置

### 配置 basePath

项目已自动配置 `basePath`，无需手动设置：

- **自动检测**：构建时会自动从 GitHub 环境变量中获取仓库名
- **子目录部署**：如果仓库名不是 `username.github.io`，会自动设置 `basePath` 为 `/repo-name`
- **根路径部署**：如果仓库名是 `username.github.io`，`basePath` 为空，部署到根路径

**手动配置**（如果需要）：
可以通过环境变量 `NEXT_PUBLIC_BASE_PATH` 手动设置。

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献内容

- 🐛 修复 Bug
- ✨ 添加新功能
- 📝 改进文档
- 🎨 优化 UI/UX
- 🔍 添加更多提示词

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 优秀的 React 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Fuse.js](https://fusejs.io/) - 强大的搜索库
- 所有贡献者和提示词作者

## 📞 联系方式

- 项目地址：https://github.com/YOUR_USERNAME/prompts
- 问题反馈：https://github.com/YOUR_USERNAME/prompts/issues

---

<div align="center">

**PromptCraft - 提示词工坊**

让 AI 提示词触手可及 ✨

Made with ❤️ by the PromptCraft Team

</div>
