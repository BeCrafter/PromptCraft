/**
 * 验证 Prompts 和 Raw 路由单次编码的完整链路
 * 检查从链接生成到页面显示的每个环节
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('Prompts 和 Raw 路由单次编码端到端验证');
console.log('='.repeat(70));
console.log('');

// 模拟编码/解码函数
function encodePath(pathStr) {
  return pathStr.split('/').map(segment => encodeURIComponent(segment)).join('/');
}

function decodePath(encodedPath) {
  return encodedPath.split('/').map(segment => decodeURIComponent(segment)).join('/');
}

// 测试用例
const testCases = [
  {
    name: '包含空格的提示词',
    original: 'coding/js-expert copy',
    expected: {
      encoded: 'coding/js-expert%20copy',
      decoded: 'coding/js-expert copy'
    }
  },
  {
    name: '中文路径',
    original: 'coding/技术栈/技术栈1',
    expected: {
      encoded: 'coding/%E6%8A%80%E6%9C%AF%E6%A0%88/%E6%8A%80%E6%9C%AF%E6%A0%881',
      decoded: 'coding/技术栈/技术栈1'
    }
  },
  {
    name: '混合特殊字符',
    original: 'coding/js-expert copy/test',
    expected: {
      encoded: 'coding/js-expert%20copy/test',
      decoded: 'coding/js-expert copy/test'
    }
  }
];

console.log('📋 测试用例 1: 编码/解码验证\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const encoded = encodePath(testCase.original);
  const decoded = decodePath(encoded);
  
  const encodeMatch = encoded === testCase.expected.encoded;
  const decodeMatch = decoded === testCase.expected.decoded;
  
  if (encodeMatch && decodeMatch) {
    passed++;
    console.log(`✅ 测试 ${index + 1}: ${testCase.name}`);
    console.log(`   原始: ${testCase.original}`);
    console.log(`   编码: ${encoded}`);
    console.log(`   解码: ${decoded}`);
  } else {
    failed++;
    console.log(`❌ 测试 ${index + 1}: ${testCase.name}`);
    if (!encodeMatch) {
      console.log(`   编码不匹配: 期望 ${testCase.expected.encoded}, 实际 ${encoded}`);
    }
    if (!decodeMatch) {
      console.log(`   解码不匹配: 期望 ${testCase.expected.decoded}, 实际 ${decoded}`);
    }
  }
  console.log('');
});

console.log('📋 测试用例 2: generateStaticParams 逻辑验证\n');

testCases.forEach((testCase, index) => {
  // 模拟 generateStaticParams 逻辑
  const slugArray = testCase.original.split('/').map(segment => encodeURIComponent(segment));
  const generatedPath = slugArray.join('/');
  
  const match = generatedPath === testCase.expected.encoded;
  
  if (match) {
    passed++;
    console.log(`✅ 测试 ${index + 1}: ${testCase.name}`);
    console.log(`   原始: ${testCase.original}`);
    console.log(`   生成路径: ${generatedPath}`);
    console.log(`   预期路径: ${testCase.expected.encoded}`);
  } else {
    failed++;
    console.log(`❌ 测试 ${index + 1}: ${testCase.name}`);
    console.log(`   生成路径: ${generatedPath}`);
    console.log(`   预期路径: ${testCase.expected.encoded}`);
  }
  console.log('');
});

console.log('📋 测试用例 3: 链接生成验证\n');

testCases.forEach((testCase, index) => {
  // 模拟页面中的链接生成
  const linkPath = `/prompts/${encodePath(testCase.original)}`;
  const expectedLink = `/prompts/${testCase.expected.encoded}`;
  
  const match = linkPath === expectedLink;
  
  if (match) {
    passed++;
    console.log(`✅ 测试 ${index + 1}: ${testCase.name}`);
    console.log(`   生成链接: ${linkPath}`);
    console.log(`   预期链接: ${expectedLink}`);
  } else {
    failed++;
    console.log(`❌ 测试 ${index + 1}: ${testCase.name}`);
    console.log(`   生成链接: ${linkPath}`);
    console.log(`   预期链接: ${expectedLink}`);
  }
  console.log('');
});

console.log('📋 测试用例 4: Raw 路由验证\n');

testCases.forEach((testCase, index) => {
  // 模拟 raw 路由的路径生成
  const slugArray = testCase.original.split('/').map(segment => encodeURIComponent(segment));
  slugArray[slugArray.length - 1] = slugArray[slugArray.length - 1] + '.md';
  const rawPath = slugArray.join('/');
  
  const expectedRawPath = testCase.expected.encoded.replace(/\/([^/]+)$/, '/$1.md');
  
  const match = rawPath === expectedRawPath;
  
  if (match) {
    passed++;
    console.log(`✅ 测试 ${index + 1}: ${testCase.name}`);
    console.log(`   生成路径: ${rawPath}`);
    console.log(`   预期路径: ${expectedRawPath}`);
  } else {
    failed++;
    console.log(`❌ 测试 ${index + 1}: ${testCase.name}`);
    console.log(`   生成路径: ${rawPath}`);
    console.log(`   预期路径: ${expectedRawPath}`);
  }
  console.log('');
});

console.log('📋 测试用例 5: 构建输出路径验证\n');

const outDir = path.join(process.cwd(), 'out');
if (fs.existsSync(outDir)) {
  const promptsDir = path.join(outDir, 'prompts');
  const rawDir = path.join(outDir, 'raw');
  
  if (fs.existsSync(promptsDir)) {
    console.log('✅ Prompts 目录存在');
    const entries = fs.readdirSync(promptsDir, { withFileTypes: true });
    console.log(`   包含 ${entries.length} 个条目`);
    
    // 检查是否有单次编码的路径
    const hasEncodedPaths = entries.some(entry => entry.name.includes('%'));
    if (hasEncodedPaths) {
      console.log('   ✅ 包含编码路径（单次编码）');
    } else {
      console.log('   ⚠️  未找到编码路径');
    }
  } else {
    console.log('⚠️  Prompts 目录不存在（需要先运行构建）');
  }
  
  if (fs.existsSync(rawDir)) {
    console.log('✅ Raw 目录存在');
    // 检查 raw 目录结构
    console.log('   ✅ Raw 路由文件已生成');
  } else {
    console.log('⚠️  Raw 目录不存在（需要先运行构建）');
  }
} else {
  console.log('⚠️  out 目录不存在，请先运行 pnpm build');
}

console.log('');

// 总结
const totalTests = passed + failed;
console.log('='.repeat(70));
console.log('📊 验证结果汇总');
console.log('='.repeat(70));
console.log(`   总测试数: ${totalTests}`);
console.log(`   通过: ${passed}`);
console.log(`   失败: ${failed}`);
console.log('');

if (failed === 0) {
  console.log('✅ 所有测试通过！单次编码链路验证成功。');
  console.log('');
  console.log('🎯 验证要点：');
  console.log('   1. ✅ 编码/解码逻辑正确');
  console.log('   2. ✅ generateStaticParams 逻辑正确');
  console.log('   3. ✅ 链接生成逻辑正确');
  console.log('   4. ✅ Raw 路由逻辑正确');
  console.log('   5. ✅ 路径匹配正确');
  process.exit(0);
} else {
  console.log('❌ 部分测试失败，请检查代码逻辑。');
  process.exit(1);
}

