// ============================================================
// 072. 至少有 K 个重复字符的最长子串
// ============================================================
// LeetCode 395. Longest Substring with At Least K Repeating Characters
// 找最长子串，使得其中每个字符出现次数都 >= k
// 思路：哈希表统计字符频次，分治——遇到出现次数 < k 的字符则以此为分割递归
// 时间复杂度：O(n * 字母数)，空间复杂度：O(字母数)

function longestSubstring(s: string, k: number): number {
  return helper(s, 0, s.length, k);
}

function helper(s: string, start: number, end: number, k: number): number {
  if (end - start < k) return 0;

  // 统计当前区间内各字符频次
  const count: Record<string, number> = {};
  for (let i = start; i < end; i++) {
    count[s[i]] = (count[s[i]] || 0) + 1;
  }

  // 找到第一个出现次数 < k 的字符作为分割点
  for (let i = start; i < end; i++) {
    if (count[s[i]] < k) {
      // 跳过连续的不满足条件的字符
      let j = i + 1;
      while (j < end && count[s[j]] < k) j++;
      // 分治左右两段
      const left = helper(s, start, i, k);
      const right = helper(s, j, end, k);
      return Math.max(left, right);
    }
  }

  // 当前区间所有字符都满足 >= k
  return end - start;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 072. 至少有 K 个重复字符的最长子串 =====");
console.log(longestSubstring("aaabb", 3)); // 期望输出: 3 ("aaa")
console.log(longestSubstring("ababbc", 2)); // 期望输出: 5 ("ababb")
console.log(longestSubstring("aaabbb", 3)); // 期望输出: 6 ("aaabbb")

export {};
