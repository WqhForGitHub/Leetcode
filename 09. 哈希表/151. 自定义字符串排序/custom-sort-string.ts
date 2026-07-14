// ============================================================
// 151. 自定义字符串排序
// ============================================================
// LeetCode 791. Custom Sort String
// 给定排列顺序字符串 order 和字符串 s，按 order 的顺序对 s 中字符排序，
// order 中未出现的字符放末尾，顺序任意。
// 时间复杂度：O(n + m)；空间复杂度：O(n)

function customSortString(order: string, s: string): string {
  // 哈希表：字符 -> 出现次数
  const count = new Map<string, number>();
  for (const ch of s) {
    count.set(ch, (count.get(ch) || 0) + 1);
  }

  let result = "";
  // 按 order 顺序追加
  for (const ch of order) {
    if (count.has(ch)) {
      result += ch.repeat(count.get(ch)!);
      count.delete(ch);
    }
  }
  // 剩余字符追加到末尾
  for (const [ch, c] of count) {
    result += ch.repeat(c);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 151. 自定义字符串排序 =====");
console.log(customSortString("cba", "abcd")); // 期望: "cbad" 或 "cbda" 等
console.log(customSortString("bcafg", "abcd")); // 期望: "bcad"
console.log(customSortString("kqep", "pekeq")); // 期望: "kqeep"

export {};
