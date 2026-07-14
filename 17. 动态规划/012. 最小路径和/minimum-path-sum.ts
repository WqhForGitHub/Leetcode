// ============================================================
// 012. 最小路径和
// ============================================================
// LeetCode 64. Minimum Path Sum
// 给定一个 m×n 的非负整数网格，从左上角到右下角，每次只能向下或向右移动，
// 求路径上的数字之和最小的值。
// 时间复杂度 O(mn)，空间复杂度 O(mn) 或 O(1)

// 方法1：动态规划 - 二维数组（推荐）
// dp[i][j] 表示从 (0,0) 到 (i,j) 的最小路径和
// 状态转移：dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function minPathSum(grid: number[][]): number {
  const m: number = grid.length;
  const n: number = grid[0].length;

  // dp[i][j] 表示到达 (i,j) 的最小路径和
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));

  dp[0][0] = grid[0][0];
  // 初始化第一列：只能从上方来
  for (let i: number = 1; i < m; i++) {
    dp[i][0] = dp[i - 1][0] + grid[i][0];
  }
  // 初始化第一行：只能从左方来
  for (let j: number = 1; j < n; j++) {
    dp[0][j] = dp[0][j - 1] + grid[0][j];
  }

  // 填充 dp 表
  for (let i: number = 1; i < m; i++) {
    for (let j: number = 1; j < n; j++) {
      // 取上方和左方的较小值加上当前格子值
      dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  return dp[m - 1][n - 1];
}

// 方法2：原地修改 grid（空间优化）
// 直接在 grid 上修改，grid[i][j] 表示从 (0,0) 到 (i,j) 的最小路径和
// 时间复杂度 O(mn)，空间复杂度 O(1)
function minPathSum2(grid: number[][]): number {
  const m: number = grid.length;
  const n: number = grid[0].length;

  // 初始化第一列
  for (let i: number = 1; i < m; i++) {
    grid[i][0] += grid[i - 1][0];
  }
  // 初始化第一行
  for (let j: number = 1; j < n; j++) {
    grid[0][j] += grid[0][j - 1];
  }

  // 原地更新
  for (let i: number = 1; i < m; i++) {
    for (let j: number = 1; j < n; j++) {
      grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
    }
  }

  return grid[m - 1][n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 012. 最小路径和 =====");
console.log(
  minPathSum([
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ]),
); // 期望结果: 7
console.log(
  minPathSum([
    [1, 2, 3],
    [4, 5, 6],
  ]),
); // 期望结果: 12
console.log(minPathSum([[1]])); // 期望结果: 1
console.log(
  minPathSum2([
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
  ]),
); // 期望结果: 7
console.log(
  minPathSum2([
    [1, 2, 3],
    [4, 5, 6],
  ]),
); // 期望结果: 12

export {};
