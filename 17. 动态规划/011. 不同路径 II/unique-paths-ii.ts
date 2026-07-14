// ============================================================
// 011. 不同路径 II
// ============================================================
// LeetCode 63. Unique Paths II
// 一个 m×n 的网格，某些位置有障碍物（用1表示），求从左上角到右下角的不同路径数。
// 机器人每次只能向下或向右移动一步。不能经过障碍物格子。
// 时间复杂度 O(mn)，空间复杂度 O(mn) 或 O(n)

// 方法1：动态规划 - 二维数组（推荐）
// dp[i][j] 表示从 (0,0) 到 (i,j) 的不同路径数
// 状态转移：若 obstacleGrid[i][j] == 1（障碍），则 dp[i][j] = 0
//           否则 dp[i][j] = dp[i-1][j] + dp[i][j-1]
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
  const m: number = obstacleGrid.length;
  const n: number = obstacleGrid[0].length;
  // 如果起点或终点是障碍物，直接返回0
  if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) {
    return 0;
  }

  // dp[i][j] 表示到达 (i,j) 的路径数
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));

  // 初始化第一列：遇到障碍物后全为0
  for (let i: number = 0; i < m; i++) {
    if (obstacleGrid[i][0] === 1) break;
    dp[i][0] = 1;
  }
  // 初始化第一行：遇到障碍物后全为0
  for (let j: number = 0; j < n; j++) {
    if (obstacleGrid[0][j] === 1) break;
    dp[0][j] = 1;
  }

  // 填充 dp 表
  for (let i: number = 1; i < m; i++) {
    for (let j: number = 1; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        dp[i][j] = 0; // 障碍物格子路径数为0
      } else {
        // 从上方和左方转移
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
    }
  }

  return dp[m - 1][n - 1];
}

// 方法2：动态规划 - 一维数组空间优化
// 只用一维数组 dp[j]，逐行更新
// dp[j] = obstacle ? 0 : dp[j] + dp[j-1]
// 时间复杂度 O(mn)，空间复杂度 O(n)
function uniquePathsWithObstacles2(obstacleGrid: number[][]): number {
  const m: number = obstacleGrid.length;
  const n: number = obstacleGrid[0].length;
  if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) {
    return 0;
  }

  // 一维 dp 数组，dp[j] 表示当前行到达第 j 列的路径数
  const dp: number[] = new Array<number>(n).fill(0);
  dp[0] = 1; // 起点路径数为1

  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        dp[j] = 0; // 障碍物：路径数置0
      } else if (j > 0) {
        // dp[j]（上方） + dp[j-1]（左方）
        dp[j] = dp[j] + dp[j - 1];
      }
    }
  }

  return dp[n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 011. 不同路径 II =====");
console.log(
  uniquePathsWithObstacles([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]),
); // 期望结果: 2
console.log(
  uniquePathsWithObstacles([
    [0, 1],
    [0, 0],
  ]),
); // 期望结果: 1
console.log(uniquePathsWithObstacles([[1]])); // 期望结果: 0
console.log(uniquePathsWithObstacles([[0, 0]])); // 期望结果: 1
console.log(
  uniquePathsWithObstacles2([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]),
); // 期望结果: 2

export {};
