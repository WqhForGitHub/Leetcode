// ============================================================
// 087. 自定义字符串排序
// ============================================================
// LeetCode 791. Custom Sort String
// 给定自定义顺序字符串 order 和字符串 s，按 order 的顺序对 s 排序。
// order 中未出现的字符可放在末尾任意顺序。

// 方法1：自定义比较器 + 排序（推荐，O(n log n)）
// 思路：建立 order 中每个字符到其位置的映射，用此映射作为排序键。
function customSortString(order: string, s: string): string {
  // 建立 order 中字符到优先级的映射
  const orderMap: Map<string, number> = new Map();
  for (let i = 0; i < order.length; i++) {
    orderMap.set(order[i], i);
  }

  // 不在 order 中的字符优先级设为 order.length（排到最后）
  const getPriority = (c: string): number => {
    return orderMap.has(c) ? orderMap.get(c)! : order.length;
  };

  const chars = s.split("");
  chars.sort((a, b) => getPriority(a) - getPriority(b));

  return chars.join("");
}

// 方法2：计数排序（O(n)）
// 思路：统计 s 中每个字符的出现次数，按 order 顺序输出，
//       最后输出 order 中未出现的字符。
function customSortString2(order: string, s: string): string {
  // 统计 s 中每个字符出现次数
  const count: Map<string, number> = new Map();
  for (const c of s) {
    count.set(c, (count.get(c) || 0) + 1);
  }

  const result: string[] = [];

  // 按 order 顺序输出
  for (const c of order) {
    if (count.has(c)) {
      const cnt = count.get(c)!;
      for (let i = 0; i < cnt; i++) {
        result.push(c);
      }
      count.delete(c);
    }
  }

  // 输出 order 中未出现的字符（保持原有顺序或任意顺序）
  for (const [c, cnt] of count) {
    for (let i = 0; i < cnt; i++) {
      result.push(c);
    }
  }

  return result.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 087. 自定义字符串排序 =====");

console.log("测试1:", customSortString("cba", "abcd")); // 期望: "cbad"
console.log("测试2:", customSortString("cbafg", "abcd")); // 期望: "cbad"
console.log("测试3:", customSortString("kqep", "pekeq")); // 期望: "kqeep" 或类似

console.log("方法2测试1:", customSortString2("cba", "abcd")); // 期望: "cbad"
console.log("方法2测试2:", customSortString2("cbafg", "abcd")); // 期望: "cbad"
console.log("方法2测试3:", customSortString2("kqep", "pekeq")); // 期望: "kqeep" 或类似

export {};
