/**
 * 验证 Next.js 构建时的路径编码与代码匹配情况
 * 检查 generateStaticParams 生成的路径是否与实际构建输出匹配
 */

const fs = require('fs');
const path = require('path');

// 模拟 generateStaticParams 的逻辑
function generateExpectedPaths() {
  const testCases = [
    {
      type: 'prompt',
      original: 'coding/js-expert copy',
      expected: {
        single: ['coding', 'js-expert%20copy'],
        double: ['coding', 'js-expert%2520copy']
      }
    },
    {
      type: 'tag',
      original: '前端',
      expected: {
        single: '%E5%89%8D%E7%AB%AF',
        double: '%25E5%2589%258D%25E7%25AB%25AF'
      }
    },
    {
      type: 'prompt',
      original: 'coding/技术栈/技术栈1',
      expected: {
        single: ['coding', '%E6%8A%80%E6%9C%AF%E6%A0%88', '%E6%8A%80%E6%9C%AF%E6%A0%881'],
        double: ['coding', '%25E6%258A%2580%25E6%259C%25AF%25E6%25A0%2588', '%25E6%258A%2580%25E6%259C%25AF%25E6%25A0%25881']
      }
    }
  ];

  return testCases;
}

// 检查构建输出目录结构
function checkBuildOutput(outDir) {
  console.log('🔍 检查构建输出目录结构...\n');

  if (!fs.existsSync(outDir)) {
    console.log('⚠️  out 目录不存在，请先运行 pnpm build');
    return;
  }

  const testCases = generateExpectedPaths();
  const issues = [];

  testCases.forEach((testCase, index) => {
    console.log(`测试用例 ${index + 1}: ${testCase.type} - ${testCase.original}`);
    
    if (testCase.type === 'prompt') {
      // 检查提示词路径
      const singlePath = path.join(outDir, 'prompts', ...testCase.expected.single);
      const doublePath = path.join(outDir, 'prompts', ...testCase.expected.double);
      
      const singleExists = fs.existsSync(singlePath);
      const doubleExists = fs.existsSync(doublePath);
      
      console.log(`  单次编码路径: ${testCase.expected.single.join('/')}`);
      console.log(`    存在: ${singleExists ? '✅' : '❌'}`);
      
      console.log(`  双重编码路径: ${testCase.expected.double.join('/')}`);
      console.log(`    存在: ${doubleExists ? '✅' : '❌'}`);
      
      if (!singleExists) {
        issues.push({
          type: 'prompt',
          original: testCase.original,
          path: testCase.expected.single.join('/'),
          issue: '单次编码路径不存在'
        });
      }
      
      if (!doubleExists) {
        issues.push({
          type: 'prompt',
          original: testCase.original,
          path: testCase.expected.double.join('/'),
          issue: '双重编码路径不存在'
        });
      }
    } else if (testCase.type === 'tag') {
      // 检查标签路径
      const singlePath = path.join(outDir, 'tags', testCase.expected.single);
      const doublePath = path.join(outDir, 'tags', testCase.expected.double);
      
      const singleExists = fs.existsSync(singlePath);
      const doubleExists = fs.existsSync(doublePath);
      
      console.log(`  单次编码路径: ${testCase.expected.single}`);
      console.log(`    存在: ${singleExists ? '✅' : '❌'}`);
      
      console.log(`  双重编码路径: ${testCase.expected.double}`);
      console.log(`    存在: ${doubleExists ? '✅' : '❌'}`);
      
      if (!singleExists) {
        issues.push({
          type: 'tag',
          original: testCase.original,
          path: testCase.expected.single,
          issue: '单次编码路径不存在'
        });
      }
      
      if (!doubleExists) {
        issues.push({
          type: 'tag',
          original: testCase.original,
          path: testCase.expected.double,
          issue: '双重编码路径不存在'
        });
      }
    }
    
    console.log('');
  });

  // 检查实际构建输出的目录结构
  console.log('📁 实际构建输出的目录结构:');
  const promptsDir = path.join(outDir, 'prompts');
  const tagsDir = path.join(outDir, 'tags');
  
  if (fs.existsSync(promptsDir)) {
    console.log('\n  prompts 目录:');
    const entries = fs.readdirSync(promptsDir, { withFileTypes: true });
    entries.slice(0, 10).forEach(entry => {
      console.log(`    ${entry.isDirectory() ? '[DIR]' : '[FILE]'} ${entry.name}`);
    });
    if (entries.length > 10) {
      console.log(`    ... 还有 ${entries.length - 10} 个条目`);
    }
  }
  
  if (fs.existsSync(tagsDir)) {
    console.log('\n  tags 目录:');
    const entries = fs.readdirSync(tagsDir, { withFileTypes: true });
    entries.slice(0, 10).forEach(entry => {
      console.log(`    ${entry.isDirectory() ? '[DIR]' : '[FILE]'} ${entry.name}`);
    });
    if (entries.length > 10) {
      console.log(`    ... 还有 ${entries.length - 10} 个条目`);
    }
  }

  // 总结
  console.log('\n📊 验证结果:');
  if (issues.length === 0) {
    console.log('✅ 所有路径匹配正确！');
  } else {
    console.log(`❌ 发现 ${issues.length} 个问题:`);
    issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue.type}: ${issue.original}`);
      console.log(`     路径: ${issue.path}`);
      console.log(`     问题: ${issue.issue}`);
    });
  }
}

// 检查 generateStaticParams 的逻辑
function checkGenerateStaticParamsLogic() {
  console.log('🔍 检查 generateStaticParams 逻辑...\n');

  // 模拟提示词路径生成
  const promptSlug = 'coding/js-expert copy';
  const slugArray = promptSlug.split('/').map(segment => encodeURIComponent(segment));
  const doubleEncodedArray = slugArray.map(segment => segment.replace(/%/g, '%25'));

  console.log('提示词路径生成:');
  console.log(`  原始: ${promptSlug}`);
  console.log(`  单次编码: ${slugArray.join('/')}`);
  console.log(`  双重编码: ${doubleEncodedArray.join('/')}`);
  console.log(`  匹配: ${JSON.stringify(slugArray) !== JSON.stringify(doubleEncodedArray) ? '✅' : '❌ (相同，不会生成双重编码)'}\n`);

  // 模拟标签路径生成
  const tag = '前端';
  const encoded = encodeURIComponent(tag);
  const doubleEncoded = encoded.replace(/%/g, '%25');

  console.log('标签路径生成:');
  console.log(`  原始: ${tag}`);
  console.log(`  单次编码: ${encoded}`);
  console.log(`  双重编码: ${doubleEncoded}`);
  console.log(`  匹配: ${doubleEncoded !== encoded ? '✅' : '❌ (相同，不会生成双重编码)'}\n`);
}

// 主函数
const outDir = path.join(process.cwd(), 'out');

console.log('='.repeat(60));
console.log('路径匹配验证工具');
console.log('='.repeat(60));
console.log('');

checkGenerateStaticParamsLogic();
checkBuildOutput(outDir);

console.log('\n' + '='.repeat(60));
console.log('验证完成');
console.log('='.repeat(60));

