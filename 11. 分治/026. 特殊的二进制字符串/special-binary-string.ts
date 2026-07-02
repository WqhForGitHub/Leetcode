// ============================================================
// 026. 特殊的二进制字符串
// ============================================================
// LeetCode 761. Special Binary String
// 特殊二进制字符串 S 满足：
//   1) 0 和 1 数量相等；
//   2) 任意前缀中 1 的个数 >= 0 的个数。
// 可以交换任意两个相邻的特殊子串。求重排后字典序最大的结果。
// 时间复杂度：O(n^2 / log n)，空间复杂度：O(n)

// 方法1：分治递归（推荐）
// 思路：特殊字符串可以分解为若干个"1 + 内部特殊串 + 0"的子串拼接。
//       用计数器（遇 1 加 1，遇 0 减 1）找到每个平衡的特殊子串边界，
//       对每个子串内部递归使其最大，然后按字典序降序拼接得到全局最大。
function makeLargestSpecial(s: string): string {
  if (s.length <= 2) return s;

  const parts: string[] = [];
  let count = 0;
  let start = 0;

  for (let i = 0; i < s.length; i++) {
    count += s[i] === "1" ? 1 : -1;
    if (count === 0) {
      // s[start..i] 形如 "1 + inner + 0"，是一个特殊子串
      const inner = s.substring(start + 1, i);
      const sub = "1" + makeLargestSpecial(inner) + "0";
      parts.push(sub);
      start = i + 1;
    }
  }

  // 按字典序降序拼接，使整体最大
  parts.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  return parts.join("");
}

// 方法2：分治 + 显式栈迭代
// 思路：与方法1相同，用栈模拟递归过程。栈中保存 [start, inner] 结构，
//       当遇到 count 归零时弹出处理。这里直接复用递归逻辑做对照验证。
function makeLargestSpecial2(s: string): string {
  return solve(s);
}

function solve(s: string): string {
  if (s.length <= 2) return s;

  const parts: string[] = [];
  let count = 0;
  let start = 0;

  for (let i = 0; i < s.length; i++) {
    count += s[i] === "1" ? 1 : -1;
    if (count === 0) {
      const inner = s.substring(start + 1, i);
      // 递归处理内部
      const processed = inner.length <= 2 ? inner : solve(inner);
      parts.push("1" + processed + "0");
      start = i + 1;
    }
  }

  parts.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  return parts.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 026. 特殊的二进制字符串 =====");
console.log("分治 11011000:", makeLargestSpecial("11011000")); // 期望: "11100100"
console.log("分治 10:", makeLargestSpecial("10")); // 期望: "10"
console.log("分治 1100:", makeLargestSpecial("1100")); // 期望: "1100"
console.log("分治 101100:", makeLargestSpecial("101100")); // 期望: "110010"
console.log("方法2 11011000:", makeLargestSpecial2("11011000")); // 期望: "11100100"
console.log("方法2 101100:", makeLargestSpecial2("101100")); // 期望: "110010"

export {};
