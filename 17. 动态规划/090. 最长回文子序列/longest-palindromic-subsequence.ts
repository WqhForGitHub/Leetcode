// ============================================================
// 090. 最长回文子序列
// ============================================================
// LeetCode 516. Longest Palindromic Subsequence
// 给定字符串 s，返回最长回文子序列的长度。
// 时间复杂度：O(n^2)

// 方法1：动态规划（推荐）
// dp[i][j] = s[i..j] 的最长回文子序列长度
// 状态转移：
//   - 若 s[i] == s[j]：dp[i][j] = dp[i+1][j-1] + 2（两端字符加入回文）
//   - 若 s[i] != s[j]：dp[i][j] = max(dp[i+1][j], dp[i][j-1])（去掉一端取较大值）
// 时间复杂度 O(n^2)，空间复杂度 O(n^2)
function longestPalindromeSubseq(s: string): number {
  const n: number = s.length;
  if (n <= 1) return n;

  // dp[i][j] = s[i..j] 的最长回文子序列长度
  const dp: number[][] = new Array(n);
  for (let i: number = 0; i < n; i++) {
    dp[i] = new Array(n).fill(0);
    dp[i][i] = 1; // 单个字符本身就是回文，长度为 1
  }

  // 从后往前遍历 i，保证 dp[i+1][...] 已计算
  // 从前往后遍历 j（j > i），保证 dp[...][j-1] 已计算
  for (let i: number = n - 2; i >= 0; i--) {
    for (let j: number = i + 1; j < n; j++) {
      if (s[i] === s[j]) {
        // 两端字符相同，可以同时加入回文子序列两端
        // dp[i+1][j-1] 是内部子串的最长回文子序列长度
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        // 两端字符不同，取去掉左端或去掉右端的最大值
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[0][n - 1];
}

// 方法2：最长公共子序列（LCS）
// s 的最长回文子序列 = s 与 reverse(s) 的最长公共子序列
// 使用一维滚动数组优化空间
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function longestPalindromeSubseqLCS(s: string): number {
  const n: number = s.length;
  if (n <= 1) return n;

  // 反转字符串
  const reversed: string = s.split("").reverse().join("");

  // dp[j] = s[0..i-1] 和 reversed[0..j-1] 的 LCS 长度（滚动数组）
  const dp: number[] = new Array(n + 1).fill(0);

  for (let i: number = 1; i <= n; i++) {
    let prev: number = 0; // 记录上一行的 dp[j-1]，即 dp[i-1][j-1]
    for (let j: number = 1; j <= n; j++) {
      const temp: number = dp[j]; // 保存当前行的旧值（即 dp[i-1][j]），供下一轮 j 使用
      if (s[i - 1] === reversed[j - 1]) {
        // 字符匹配，LCS 长度 +1
        dp[j] = prev + 1;
      } else {
        // 字符不匹配，取上方或左方的较大值
        dp[j] = Math.max(dp[j], dp[j - 1]);
      }
      prev = temp; // 更新 prev 为旧的 dp[i-1][j]，供下一轮作为 dp[i-1][j-1]
    }
  }

  return dp[n];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 090. 最长回文子序列 =====");
console.log(longestPalindromeSubseq("bbbab")); // 期望结果: 4
console.log(longestPalindromeSubseq("cbbd")); // 期望结果: 2
console.log(longestPalindromeSubseq("a")); // 期望结果: 1
console.log(longestPalindromeSubseqLCS("bbbab")); // 期望结果: 4
console.log(longestPalindromeSubseq("abcba")); // 期望结果: 5

export {};
