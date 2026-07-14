// ============================================================
// 100. 两个字符串的删除操作
// ============================================================
// LeetCode 583. Delete Operation for Two Strings
// 给定两个单词，每次删一个字符，使两词相同的最少操作数。
// 时间复杂度：O(mn)，空间复杂度：O(n)

// 方法1：DP 求 LCS（推荐）
// 答案 = m + n - 2 * LCS(word1, word2)
// dp[j] 表示 word1 和 word2[0..j) 的 LCS 长度
// 时间复杂度 O(mn)，空间复杂度 O(n)
function minDistance(word1: string, word2: string): number {
  const m: number = word1.length;
  const n: number = word2.length;

  // dp[j] 表示 word1 和 word2[0..j) 的 LCS 长度
  const dp: number[] = new Array(n + 1).fill(0);

  for (let i: number = 1; i <= m; i++) {
    const prev: number[] = [...dp];
    dp[0] = 0;
    for (let j: number = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[j] = prev[j - 1] + 1;
      } else {
        dp[j] = Math.max(prev[j], dp[j - 1]);
      }
    }
  }

  const lcs: number = dp[n];
  return m + n - 2 * lcs;
}

// 方法2：DP 直接求最少删除数
// dp[i][j] = 使 word1[0..i) 和 word2[0..j) 相同的最少删除数
// 时间复杂度 O(mn)，空间复杂度 O(n)
function minDistanceDirect(word1: string, word2: string): number {
  const m: number = word1.length;
  const n: number = word2.length;

  // dp[j] 表示使 word1 和 word2[0..j) 相同的最少删除数
  const dp: number[] = new Array(n + 1);
  for (let j: number = 0; j <= n; j++) {
    dp[j] = j; // word1 为空，需删除 word2 的 j 个字符
  }

  for (let i: number = 1; i <= m; i++) {
    const prev: number[] = [...dp];
    dp[0] = i; // word2 为空，需删除 word1 的 i 个字符
    for (let j: number = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[j] = prev[j - 1]; // 字符相同，无需删除
      } else {
        // 删除 word1[i-1] 或删除 word2[j-1]
        dp[j] = Math.min(prev[j], dp[j - 1]) + 1;
      }
    }
  }

  return dp[n];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 100. 两个字符串的删除操作 =====");
console.log(minDistance("sea", "eat")); // 期望结果: 2
console.log(minDistance("leetcode", "etco")); // 期望结果: 4
console.log(minDistance("", "")); // 期望结果: 0
console.log(minDistance("a", "b")); // 期望结果: 2
console.log("--- 方法2测试 ---");
console.log(minDistanceDirect("sea", "eat")); // 期望结果: 2
console.log(minDistanceDirect("leetcode", "etco")); // 期望结果: 4
console.log(minDistanceDirect("", "")); // 期望结果: 0

export {};
