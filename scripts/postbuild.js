const fs = require('fs');
const path = require('path');

// Next.js 静态导出的输出目录
const outDir = path.join(process.cwd(), 'out');

// 确保 out 目录存在
if (!fs.existsSync(outDir)) {
  console.warn('⚠️  out directory not found, skipping postbuild tasks');
  process.exit(0);
}

// 1. 创建 .nojekyll 文件，告诉 GitHub Pages 不要使用 Jekyll 处理
const nojekyllPath = path.join(outDir, '.nojekyll');
fs.writeFileSync(nojekyllPath, '', 'utf8');
console.log('✅ Created .nojekyll file in out directory');

// 2. 生成 raw 路由的 .md 文件
// URL 格式：/raw/coding/js-expert.md
// GitHub Pages 会自动设置正确的 Content-Type
console.log('📝 Generating raw route .md files...');

const contentDir = path.join(process.cwd(), 'content');
const rawOutDir = path.join(outDir, 'raw');

// 递归读取所有 markdown 文件
function readMarkdownFilesRecursively(dir, baseDir = dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const subFiles = readMarkdownFilesRecursively(fullPath, baseDir);
      files.push(...subFiles);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath);
      const slug = relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
      files.push({
        filePath: fullPath,
        slug: slug,
      });
    }
  }
  
  return files;
}

// 处理所有 raw 路由文件
if (fs.existsSync(contentDir)) {
  const categories = fs.readdirSync(contentDir).filter((file) => {
    return fs.statSync(path.join(contentDir, file)).isDirectory();
  });
  
  categories.forEach((category) => {
    const categoryPath = path.join(contentDir, category);
    const markdownFiles = readMarkdownFilesRecursively(categoryPath, contentDir);
    
    markdownFiles.forEach(({ filePath, slug }) => {
      // 读取原始文件内容
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // 构建输出路径：将 slug 转换为 URL 编码的路径，并添加 .md 后缀
      // URL 格式：/raw/coding/js-expert.md
      const slugParts = slug.split('/').map(segment => encodeURIComponent(segment));
      const mdPath = path.join(rawOutDir, ...slugParts) + '.md';
      
      // 确保目录存在
      const mdDir = path.dirname(mdPath);
      if (!fs.existsSync(mdDir)) {
        fs.mkdirSync(mdDir, { recursive: true });
      }
      
      // 写入 .md 文件
      // GitHub Pages 会自动设置 Content-Type（可能是 text/plain 或 text/markdown）
      // 浏览器可以显示内容，模型也可以直接使用
      fs.writeFileSync(mdPath, fileContent, 'utf8');
      console.log(`  ✓ Generated ${slug}.md`);
    });
  });
  
  console.log('✅ Generated all raw route .md files');
} else {
  console.log('⚠️  content directory not found, skipping raw route generation');
}

// 3. 处理标签页面的双重编码问题
// GitHub Pages 可能会对 URL 进行再次编码，导致双重编码
// 我们需要为标签页面创建双重编码的路径副本
console.log('🔧 Fixing tag page paths for GitHub Pages...');

const tagsDir = path.join(outDir, 'tags');
if (fs.existsSync(tagsDir)) {
  // 递归处理所有标签目录
  function processTagDirectories(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // 检查目录名是否包含编码字符（%）
        if (entry.name.includes('%')) {
          // 对目录名进行双重编码（将 % 编码为 %25）
          const doubleEncodedName = entry.name.replace(/%/g, '%25');
          const doubleEncodedPath = path.join(dir, doubleEncodedName);
          
          // 如果双重编码的路径不存在，创建它
          if (!fs.existsSync(doubleEncodedPath)) {
            // 复制整个目录
            copyDirectoryRecursive(fullPath, doubleEncodedPath);
            console.log(`  ✓ Created double-encoded path: ${entry.name} -> ${doubleEncodedName}`);
          }
        }
        
        // 递归处理子目录
        processTagDirectories(fullPath);
      }
    }
  }
  
  // 递归复制目录
  function copyDirectoryRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDirectoryRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  processTagDirectories(tagsDir);
  console.log('✅ Fixed tag page paths for GitHub Pages');
} else {
  console.log('⚠️  tags directory not found, skipping tag path fix');
}

