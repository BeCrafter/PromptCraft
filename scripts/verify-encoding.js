/**
 * 验证编码/解码函数的正确性
 * 测试单次编码、双重编码和边界情况
 */

// 模拟 safeDecodeSegment/safeDecodeTag/safeDecodeName 函数
function safeDecode(encoded: string): string {
  try {
    // 如果参数不包含 %，说明没有被编码，直接返回
    if (!encoded.includes('%')) {
      return encoded;
    }
    
    // 先尝试解码一次
    let decoded = decodeURIComponent(encoded);
    
    // 检查解码后的字符串是否仍然包含编码字符（如 %E5）
    // 如果包含，说明可能被双重编码，尝试再次解码
    if (decoded.includes('%')) {
      try {
        const doubleDecoded = decodeURIComponent(decoded);
        // 如果二次解码成功且结果不同，且不再包含编码字符，使用二次解码的结果
        if (doubleDecoded !== decoded && !doubleDecoded.includes('%')) {
          return doubleDecoded;
        }
        // 如果二次解码后仍然包含编码字符，说明可能是无效的编码，使用第一次解码的结果
        return decoded;
      } catch {
        // 二次解码失败，使用第一次解码的结果
        return decoded;
      }
    }
    
    return decoded;
  } catch {
    // 解码失败，返回原始值
    return encoded;
  }
}

// 测试用例
const testCases = [
  {
    name: '单次编码 - 中文标签',
    input: '%E5%89%8D%E7%AB%AF',
    expected: '前端',
    description: '单次编码的中文字符应该正确解码'
  },
  {
    name: '双重编码 - 中文标签',
    input: '%25E5%2589%258D%25E7%25AB%25AF',
    expected: '前端',
    description: '双重编码的中文字符应该正确解码'
  },
  {
    name: '单次编码 - 空格',
    input: 'js-expert%20copy',
    expected: 'js-expert copy',
    description: '单次编码的空格应该正确解码'
  },
  {
    name: '双重编码 - 空格',
    input: 'js-expert%2520copy',
    expected: 'js-expert copy',
    description: '双重编码的空格应该正确解码'
  },
  {
    name: '未编码字符串',
    input: 'frontend',
    expected: 'frontend',
    description: '未编码的字符串应该原样返回'
  },
  {
    name: '混合编码 - 中文和空格',
    input: '%E5%89%8D%E7%AB%AF%20test',
    expected: '前端 test',
    description: '混合编码应该正确解码'
  },
  {
    name: '边界情况 - 只有%',
    input: '%',
    expected: '%',
    description: '单独的%应该原样返回'
  },
  {
    name: '边界情况 - 无效编码',
    input: '%ZZ',
    expected: '%ZZ',
    description: '无效的编码应该原样返回（decodeURIComponent会抛出错误）'
  }
];

console.log('🧪 开始验证编码/解码函数...\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = safeDecode(testCase.input);
  const success = result === testCase.expected;
  
  if (success) {
    passed++;
    console.log(`✅ 测试 ${index + 1}: ${testCase.name}`);
    console.log(`   输入: ${testCase.input}`);
    console.log(`   输出: ${result}`);
    console.log(`   预期: ${testCase.expected}`);
  } else {
    failed++;
    console.log(`❌ 测试 ${index + 1}: ${testCase.name}`);
    console.log(`   输入: ${testCase.input}`);
    console.log(`   输出: ${result}`);
    console.log(`   预期: ${testCase.expected}`);
    console.log(`   说明: ${testCase.description}`);
  }
  console.log('');
});

console.log('📊 测试结果汇总:');
console.log(`   通过: ${passed}/${testCases.length}`);
console.log(`   失败: ${failed}/${testCases.length}`);

if (failed === 0) {
  console.log('\n✅ 所有测试通过！编码/解码函数工作正常。');
  process.exit(0);
} else {
  console.log('\n❌ 部分测试失败，请检查解码函数实现。');
  process.exit(1);
}

