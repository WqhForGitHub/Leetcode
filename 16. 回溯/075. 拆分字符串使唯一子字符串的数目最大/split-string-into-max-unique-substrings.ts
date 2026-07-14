// ============================================================
// 075. 拆分字符串使唯一子字符串的数目最大
// ============================================================
// LeetCode 1593. Split a String Into the Max Number of Unique Substrings
// 给定字符串 s，将其拆分为若干非空子字符串，使所有子字符串互不相同，求最大拆分数。
// 时间复杂度：O(n * 2^n)，空间复杂度：O(n^2) 哈希集合存储子串。

// 方法1：回溯+集合 (推荐)
// 从起点 start 枚举所有可能的子串结束位置 end，用集合判重，
// 递归处理剩余部分，到达末尾时更新最大值。
// 时间复杂度：O(n * 2^n)，空间复杂度：O(n^2)
function maxUniqueSplit1(s: string): number {
  let maxCount: number = 0;
  const seen: Set<string> = new Set();

  const backtrack = (start: number): void => {
    if (start === s.length) {
      maxCount = Math.max(maxCount, seen.size);
      return;
    }
    for (let end: number = start + 1; end <= s.length; end++) {
      const sub: string = s.substring(start, end);
      if (seen.has(sub)) continue;
      seen.add(sub);
      backtrack(end);
      seen.delete(sub);
    }
  };

  backtrack(0);
  return maxCount;
}

// 方法2：回溯+剪枝
// 在方法1 基础上加入剪枝：当前已选子串数 + 剩余字符数（理想全部单字符）
// 仍不超过 maxCount 时直接返回。
// 时间复杂度：O(n * 2^n)（剪枝后实际更快），空间复杂度：O(n^2)
function maxUniqueSplit2(s: string): number {
  let maxCount: number = 0;
  const seen: Set<string> = new Set();

  const backtrack = (start: number): void => {
    // 剪枝：即使剩余每个字符都单独成串，也无法超过当前最优
    if (seen.size + (s.length - start) <= maxCount) return;
    if (start === s.length) {
      maxCount = Math.max(maxCount, seen.size);
      return;
    }
    for (let end: number = start + 1; end <= s.length; end++) {
      const sub: string = s.substring(start, end);
      if (seen.has(sub)) continue;
      seen.add(sub);
      backtrack(end);
      seen.delete(sub);
    }
  };

  backtrack(0);
  return maxCount;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 075. 拆分字符串使唯一子字符串的数目最大 =====");
console.log(maxUniqueSplit1("ababccc")); // 期望结果: 5
console.log(maxUniqueSplit1("aaa")); // 期望结果: 2
console.log(maxUniqueSplit1("aba")); // 期望结果: 2
console.log(maxUniqueSplit1("aa")); // 期望结果: 1
console.log(maxUniqueSplit2("ababccc")); // 期望结果: 5
console.log(maxUniqueSplit2("aaa")); // 期望结果: 2
console.log(maxUniqueSplit2("wwwzfvedwfvhsww")); // 期望结果: 11

export {};
