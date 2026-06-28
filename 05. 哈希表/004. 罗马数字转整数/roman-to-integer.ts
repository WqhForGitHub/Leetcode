// ============================================================
// 004. 罗马数字转整数
// ============================================================
// LeetCode 13. Roman to Integer
// 将罗马数字转换为整数。哈希表存储符号值，若当前小于下一个则减去。
// 时间复杂度：O(n)，空间复杂度：O(1)

function romanToInt(s: string): number {
  const symbolValue = new Map<string, number>([
    ["I", 1],
    ["V", 5],
    ["X", 10],
    ["L", 50],
    ["C", 100],
    ["D", 500],
    ["M", 1000],
  ]);
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    const current = symbolValue.get(s[i])!;
    const next = i + 1 < s.length ? symbolValue.get(s[i + 1])! : 0;
    if (current < next) {
      result -= current;
    } else {
      result += current;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 004. 罗马数字转整数 =====");
console.log("测试1:", romanToInt("III")); // 预期: 3
console.log("测试2:", romanToInt("LVIII")); // 预期: 58
console.log("测试3:", romanToInt("MCMXCIV")); // 预期: 1994
console.log("测试4:", romanToInt("MMMDCCXLIX")); // 预期: 3749

export {};
