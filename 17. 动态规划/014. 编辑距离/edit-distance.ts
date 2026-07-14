// ============================================================
// 014. 编辑距离
// ============================================================
// LeetCode 72. Edit Distance
// 给定两个单词 word1 和 word2，返回将 word1 转换成 word2 所需的最少操作数。
// 操作包括：插入一个字符、删除一个字符、替换一个字符。
// 时间复杂度 O(mn)，空间复杂度 O(mn) 或 O(n)

// 方法1：动态规划（推荐）
// dp[i][j] 表示 word1[0..i) 变成 word2[0..j) 的最少操作数
// 状态转移：
//   若 word1[i-1] == word2[j-1]，则 dp[i][j] = dp[i-1][j-1]（无需操作）
//   否则 dp[i][j] = 1 + min(
//     dp[i-1][j],    // 删除 word1[i-1]
//     dp[i][j-1],    // 在 word1 中插入 word2[j-1]
//     dp[i-1][j-1]   // 替换 word1[i-1] 为 word2[j-1]
//   )
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function minDistance(word1: string, word2: string): number {
  const m: number = word1.length;
  const n: number = word2.length;

  // dp[i][j] 表示 word1 前 i 个字符变成 word2 前 j 个字符的最少操作数
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

  // 初始化：word1 前 i 个字符变成空串需要 i 次删除
  for (let i: number = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  // 初始化：空串变成 word2 前 j 个字符需要 j 次插入
  for (let j: number = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // 填充 dp 表
  for (let i: number = 1; i <= m; i++) {
    for (let j: number = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        // 字符相同，无需操作
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // 取删除、插入、替换三种操作的最小值 + 1
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // 删除
            dp[i][j - 1], // 插入
            dp[i - 1][j - 1], // 替换
          );
      }
    }
  }

  return dp[m][n];
}

// 方法2：递归 + 记忆化
// 递归地从后向前比较，用 memo 缓存结果
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function minDistance2(word1: string, word2: string): number {
  const m: number = word1.length;
  const n: number = word2.length;
  // 记忆化数组，-1 表示未计算
  const memo: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(-1));

  // 递归函数：返回 word1[0..i] 变成 word2[0..j] 的最少操作数
  function helper(i: number, j: number): number {
    // base case：word1 为空，需要插入 j+1 个字符
    if (i < 0) return j + 1;
    // base case：word2 为空，需要删除 i+1 个字符
    if (j < 0) return i + 1;

    if (memo[i][j] !== -1) return memo[i][j];

    let result: number;
    if (word1[i] === word2[j]) {
      // 字符相同，递归比较前面的
      result = helper(i - 1, j - 1);
    } else {
      // 三种操作取最小值
      result =
        1 +
        Math.min(
          helper(i - 1, j), // 删除
          helper(i, j - 1), // 插入
          helper(i - 1, j - 1), // 替换
        );
    }

    memo[i][j] = result;
    return result;
  }

  return helper(m - 1, n - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 014. 编辑距离 =====");
console.log(minDistance("horse", "ros")); // 期望结果: 3
console.log(minDistance("intention", "execution")); // 期望结果: 5
console.log(minDistance("", "")); // 期望结果: 0
console.log(minDistance2("horse", "ros")); // 期望结果: 3
console.log(minDistance2("intention", "execution")); // 期望结果: 5

export {};
