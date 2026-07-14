// ============================================================
// 020. 交错字符串
// ============================================================
// LeetCode 97. Interleaving String
// 给定字符串 s1、s2、s3，判断 s3 是否由 s1 和 s2 交错组成。
// 交错指：s3 的字符按顺序来自 s1 或 s2，且 s1 和 s2 内部的相对顺序不变。
// 时间复杂度 O(mn)，空间复杂度 O(mn) 或 O(n)

// 方法1：动态规划（推荐）
// dp[i][j] 表示 s1[0..i) 和 s2[0..j) 能否交错组成 s3[0..i+j)
// 状态转移：
//   dp[i][j] = (dp[i-1][j] && s1[i-1] == s3[i+j-1]) ||
//              (dp[i][j-1] && s2[j-1] == s3[i+j-1])
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function isInterleave(s1: string, s2: string, s3: string): boolean {
  const m: number = s1.length;
  const n: number = s2.length;
  // 长度检查
  if (m + n !== s3.length) return false;

  // dp[i][j] 表示 s1 前 i 个字符和 s2 前 j 个字符能否交错组成 s3 前 i+j 个字符
  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    new Array<boolean>(n + 1).fill(false),
  );

  dp[0][0] = true; // 空串 + 空串 = 空串

  // 初始化第一列：只用 s1
  for (let i: number = 1; i <= m; i++) {
    dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
  }
  // 初始化第一行：只用 s2
  for (let j: number = 1; j <= n; j++) {
    dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
  }

  // 填充 dp 表
  for (let i: number = 1; i <= m; i++) {
    for (let j: number = 1; j <= n; j++) {
      // 从 s1 取字符 或 从 s2 取字符
      const fromS1: boolean = dp[i - 1][j] && s1[i - 1] === s3[i + j - 1];
      const fromS2: boolean = dp[i][j - 1] && s2[j - 1] === s3[i + j - 1];
      dp[i][j] = fromS1 || fromS2;
    }
  }

  return dp[m][n];
}

// 方法2：递归 + 记忆化
// 递归地从 s3 的最后一个字符出发，判断它来自 s1 还是 s2
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function isInterleave2(s1: string, s2: string, s3: string): boolean {
  const m: number = s1.length;
  const n: number = s2.length;
  if (m + n !== s3.length) return false;

  // 记忆化：memo[i][j] 存储 s1[i..] 和 s2[j..] 能否交错组成 s3[i+j..]
  // -1: 未计算, 0: false, 1: true
  const memo: Int8Array[] = Array.from({ length: m + 1 }, () => new Int8Array(n + 1).fill(-1));

  function helper(i: number, j: number): boolean {
    // base case：两个串都用完了
    if (i === m && j === n) return true;

    if (memo[i][j] !== -1) return memo[i][j] === 1;

    let result: boolean = false;
    const k: number = i + j; // s3 的当前位置

    // 尝试从 s1 取字符
    if (i < m && s1[i] === s3[k]) {
      if (helper(i + 1, j)) {
        result = true;
      }
    }
    // 尝试从 s2 取字符
    if (!result && j < n && s2[j] === s3[k]) {
      if (helper(i, j + 1)) {
        result = true;
      }
    }

    memo[i][j] = result ? 1 : 0;
    return result;
  }

  return helper(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 020. 交错字符串 =====");
console.log(isInterleave("aabcc", "dbbca", "aadbbcbcac")); // 期望结果: true
console.log(isInterleave("aabcc", "dbbca", "aadbbbaccc")); // 期望结果: false
console.log(isInterleave("", "", "")); // 期望结果: true
console.log(isInterleave2("aabcc", "dbbca", "aadbbcbcac")); // 期望结果: true
console.log(isInterleave2("aabcc", "dbbca", "aadbbbaccc")); // 期望结果: false

export {};
