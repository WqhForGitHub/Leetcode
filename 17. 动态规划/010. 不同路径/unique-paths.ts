// ============================================================
// 010. 不同路径
// ============================================================
// LeetCode 62. Unique Paths
// m×n 网格，从左上角到右下角有多少条不同路径，每次只能向下或向右
// 时间复杂度 O(mn)

// 方法1：动态规划（推荐）
// dp[i][j] 表示到达 (i,j) 的路径数
// 状态转移：dp[i][j] = dp[i-1][j] + dp[i][j-1]
// 空间优化为一维数组，dp[j] = dp[j]（上方）+ dp[j-1]（左方）
// 时间复杂度 O(mn)，空间复杂度 O(n)
function uniquePaths(m: number, n: number): number {
  // dp[j] 表示当前行第 j 列的路径数
  const dp: number[] = new Array<number>(n).fill(1);
  for (let i: number = 1; i < m; i++) {
    for (let j: number = 1; j < n; j++) {
      // dp[j] 旧值代表从上方来，dp[j-1] 新值代表从左方来
      dp[j] = dp[j] + dp[j - 1];
    }
  }
  return dp[n - 1];
}

// 方法2：组合数学（可选第二种解法）
// 从 m+n-2 步中选 m-1 步向下（或 n-1 步向右），即 C(m+n-2, m-1)
// 时间复杂度 O(min(m,n))，空间复杂度 O(1)
function uniquePaths2(m: number, n: number): number {
  // 选取较小的作为循环次数
  const small: number = Math.min(m - 1, n - 1);
  const total: number = m + n - 2;
  let result: number = 1;
  // 计算 C(total, small) = total/1 * (total-1)/2 * ... * (total-small+1)/small
  for (let i: number = 0; i < small; i++) {
    result = Math.floor((result * (total - i)) / (i + 1));
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 010. 不同路径 =====");
console.log(uniquePaths(3, 7)); // 期望结果: 28
console.log(uniquePaths(3, 2)); // 期望结果: 3
console.log(uniquePaths(7, 3)); // 期望结果: 28
console.log(uniquePaths2(3, 7)); // 期望结果: 28
console.log(uniquePaths2(3, 2)); // 期望结果: 3

export {};
