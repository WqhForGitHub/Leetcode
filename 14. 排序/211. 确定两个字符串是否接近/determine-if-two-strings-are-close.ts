// ============================================================
// 211. 确定两个字符串是否接近
// ============================================================
// LeetCode 1657. Determine if Two Strings Are Close
// 两种操作：交换任意两个字符的位置；或交换两个字符的全部出现频次。
// 判断 word1 能否经过若干次操作变为 word2。

// 方法1：频次统计 + 排序比较（O(n + k log k)，k 为字符种类）
function closeStrings(word1: string, word2: string): boolean {
  if (word1.length !== word2.length) return false;
  const freq1 = new Map<string, number>();
  const freq2 = new Map<string, number>();
  for (const ch of word1) freq1.set(ch, (freq1.get(ch) ?? 0) + 1);
  for (const ch of word2) freq2.set(ch, (freq2.get(ch) ?? 0) + 1);
  // 字符集合必须相同（操作无法新增/删除字符种类）
  const set1 = new Set(freq1.keys());
  const set2 = new Set(freq2.keys());
  if (set1.size !== set2.size) return false;
  for (const ch of set1) if (!set2.has(ch)) return false;
  // 频次多重集必须相同（频次可整体交换）
  const counts1 = [...freq1.values()].sort((a, b) => a - b);
  const counts2 = [...freq2.values()].sort((a, b) => a - b);
  if (counts1.length !== counts2.length) return false;
  for (let i = 0; i < counts1.length; i++) {
    if (counts1[i] !== counts2[i]) return false;
  }
  return true;
}

// 方法2：频次统计 + 集合/频次分布比较（O(n + k)）
// 用 Map<频次, 该频次出现次数> 比较频次分布是否一致。
function closeStrings2(word1: string, word2: string): boolean {
  if (word1.length !== word2.length) return false;
  const build = (w: string): { chars: Set<string>; fc: Map<number, number> } => {
    const f = new Map<string, number>();
    for (const ch of w) f.set(ch, (f.get(ch) ?? 0) + 1);
    const chars = new Set(f.keys());
    const fc = new Map<number, number>();
    for (const v of f.values()) fc.set(v, (fc.get(v) ?? 0) + 1);
    return { chars, fc };
  };
  const { chars: c1, fc: fc1 } = build(word1);
  const { chars: c2, fc: fc2 } = build(word2);
  if (c1.size !== c2.size) return false;
  for (const ch of c1) if (!c2.has(ch)) return false;
  if (fc1.size !== fc2.size) return false;
  for (const [k, v] of fc1) {
    if (fc2.get(k) !== v) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 211. 确定两个字符串是否接近 =====");
console.log("方法1 'abc','bca':", closeStrings("abc", "bca")); // true
console.log("方法1 'a','aa':", closeStrings("a", "aa")); // false
console.log("方法1 'cabbba','abbccc':", closeStrings("cabbba", "abbccc")); // true
console.log("方法1 'uau','ssx':", closeStrings("uau", "ssx")); // false
console.log("方法2 'abc','bca':", closeStrings2("abc", "bca")); // true
console.log("方法2 'cabbba','abbccc':", closeStrings2("cabbba", "abbccc")); // true
console.log("方法2 'uau','ssx':", closeStrings2("uau", "ssx")); // false

export {};
