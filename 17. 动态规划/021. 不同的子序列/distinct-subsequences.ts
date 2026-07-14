// ============================================================
// 021. 不同的子序列
// ============================================================
// LeetCode 115. Distinct Subsequences
// 给定字符串 s 和 t，返回 s 中 t 作为子序列出现的个数。
// 时间复杂度 O(mn)，空间复杂度 O(mn) 或 O(n)

// 方法1：动态规划（推荐）
// dp[i][j] 表示 s[0..i) 中 t[0..j) 出现的次数
// 状态转移：若 s[i-1] == t[j-1]，则 dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
//          若 s[i-1] != t[j-1]，则 dp[i][j] = dp[i-1][j]
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function numDistinct(s: string, t: string): number {
  const m: number = s.length;
  const n: number = t.length;
  // dp[i][j] 表示 s 前 i 个字符中 t 前 j 个字符出现的次数
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

  // 初始化：空字符串 t 在任何 s 中出现 1 次
  for (let i: number = 0; i <= m; i++) {
    dp[i][0] = 1;
  }

  for (let i: number = 1; i <= m; i++) {
    for (let j: number = 1; j <= n; j++) {
      if (s[i - 1] === t[j - 1]) {
        // 当前字符匹配：可以用 s[i-1] 匹配 t[j-1]，也可以不用
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      } else {
        // 当前字符不匹配：只能不用 s[i-1]
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  return dp[m][n];
}

// 方法2：动态规划空间优化（一维数组）
// 利用一维数组滚动更新，从右往左遍历避免覆盖
// 时间复杂度 O(mn)，空间复杂度 O(n)
function numDistinct2(s: string, t: string): number {
  const m: number = s.length;
  const n: number = t.length;
  const dp: number[] = new Array<number>(n + 1).fill(0);
  dp[0] = 1; // 空字符串 t 出现 1 次

  for (let i: number = 1; i <= m; i++) {
    // 从右往左更新，避免覆盖还未使用的值
    for (let j: number = n; j >= 1; j--) {
      if (s[i - 1] === t[j - 1]) {
        dp[j] = dp[j - 1] + dp[j];
      }
    }
  }

  return dp[n];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 021. 不同的子序列 =====");
console.log(numDistinct("rabbbit", "rabbit")); // 期望结果: 3
console.log(numDistinct("babgbag", "bag")); // 期望结果: 5
console.log(numDistinct2("rabbbit", "rabbit")); // 期望结果: 3
console.log(numDistinct2("babgbag", "bag")); // 期望结果: 5
console.log(numDistinct("", "a")); // 期望结果: 0

export {};
