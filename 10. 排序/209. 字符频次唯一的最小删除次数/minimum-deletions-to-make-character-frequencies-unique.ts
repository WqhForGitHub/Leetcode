// ============================================================
// 209. 字符频次唯一的最小删除次数
// ============================================================
// LeetCode 1647. Minimum Deletions to Make Character Frequencies Unique
// 给定字符串 s，删除最少的字符，使得任意两个不同字符的出现次数互不相同。

// 方法1：统计频次 + 降序排序 + 贪心调整（O(n + k log k)，k 为字符种类）
function minDeletions(s: string): number {
  const freq = new Map<string, number>();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }
  const counts = [...freq.values()].sort((a, b) => b - a);
  let deletions = 0;
  let prev = Infinity;
  for (const cnt of counts) {
    if (cnt >= prev) {
      // 当前频次需降到 prev-1（最低为 0）
      const target = Math.max(0, prev - 1);
      deletions += cnt - target;
      prev = target;
    } else {
      prev = cnt;
    }
  }
  return deletions;
}

// 方法2：统计频次 + 集合判重（O(n + k^2)）
// 用集合记录已使用的频次，遇到重复就递减直到唯一或为 0。
function minDeletions2(s: string): number {
  const freq = new Map<string, number>();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }
  const used = new Set<number>();
  let deletions = 0;
  for (const cnt of freq.values()) {
    let c = cnt;
    while (c > 0 && used.has(c)) {
      c--;
      deletions++;
    }
    if (c > 0) used.add(c);
  }
  return deletions;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 209. 字符频次唯一的最小删除次数 =====");
console.log("方法1 'aab':", minDeletions("aab")); // 0
console.log("方法1 'aaabbbcc':", minDeletions("aaabbbcc")); // 2
console.log("方法1 'ceabaacb':", minDeletions("ceabaacb")); // 2
console.log("方法2 'aab':", minDeletions2("aab")); // 0
console.log("方法2 'aaabbbcc':", minDeletions2("aaabbbcc")); // 2
console.log("方法2 'ceabaacb':", minDeletions2("ceabaacb")); // 2

export {};
