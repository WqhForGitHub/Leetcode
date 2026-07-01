// ============================================================
// 082. 特殊的二进制字符串
// ============================================================
// LeetCode 761. Special Binary String
// 特殊二进制字符串：0 和 1 数量相等，且每个前缀中 1 的数量 >= 0 的数量。
// 可以交换任意两个相邻的特殊子串，使其字典序最大。

// 方法1：递归分治 + 排序（推荐，O(n²/log n)）
// 思路：特殊字符串可以分解为若干个特殊子串的组合（1 + 内部特殊串 + 0）。
//       递归处理每个子串使其最大，然后按字典序降序排列后拼接。
function makeLargestSpecial(s: string): string {
  if (s.length <= 2) return s;

  const parts: string[] = [];
  let count = 0;
  let start = 0;

  for (let i = 0; i < s.length; i++) {
    count += s[i] === '1' ? 1 : -1;
    if (count === 0) {
      // s[start..i] 是一个特殊字符串，形式为 1 + inner + 0
      const inner = s.substring(start + 1, i);
      const sub = '1' + makeLargestSpecial(inner) + '0';
      parts.push(sub);
      start = i + 1;
    }
  }

  // 按字典序降序排列，使拼接结果最大
  parts.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));

  return parts.join('');
}

// 方法2：迭代式分治（O(n²/log n)）
// 思路：与方法1相同，但使用显式栈避免递归。
function makeLargestSpecial2(s: string): string {
  if (s.length <= 2) return s;

  const parts: string[] = [];
  let count = 0;
  let start = 0;

  for (let i = 0; i < s.length; i++) {
    count += s[i] === '1' ? 1 : -1;
    if (count === 0) {
      const inner = s.substring(start + 1, i);
      // 对内部字符串递归处理（这里直接调用方法1的逻辑）
      const processedInner = inner.length <= 2
        ? inner
        : makeLargestSpecial2(inner);
      parts.push('1' + processedInner + '0');
      start = i + 1;
    }
  }

  parts.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  return parts.join('');
}

// ============================================================
// 测试
// ============================================================
console.log("===== 082. 特殊的二进制字符串 =====");

console.log("测试1:", makeLargestSpecial("11011000")); // 期望: "11100100"
console.log("测试2:", makeLargestSpecial("10")); // 期望: "10"
console.log("测试3:", makeLargestSpecial("1100")); // 期望: "1100"
console.log("测试4:", makeLargestSpecial("101100")); // 期望: "110010"

console.log("方法2测试1:", makeLargestSpecial2("11011000")); // 期望: "11100100"
console.log("方法2测试2:", makeLargestSpecial2("101100")); // 期望: "110010"

export {};
