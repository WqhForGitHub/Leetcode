// ============================================================
// 038. 最大正方形
// ============================================================
// LeetCode 221. Maximal Square
// 给定 0/1 矩阵，求只包含 1 的最大正方形面积
// 时间复杂度 O(mn)

// 方法1：动态规划（推荐）
// dp[i][j] 表示以(i-1,j-1)为右下角的最大正方形边长
// 状态转移：dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 (if matrix[i-1][j-1]=='1')
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function maximalSquare(matrix: string[][]): number {
  const m: number = matrix.length;
  const n: number = matrix[0].length;
  // dp[i][j] 表示以matrix[i-1][j-1]为右下角的最大正方形边长
  // 多加一行一列作为边界，初始为0
  const dp: number[][] = Array.from({ length: m + 1 }, (): number[] =>
    new Array<number>(n + 1).fill(0),
  );
  let maxSide: number = 0;

  for (let i: number = 1; i <= m; i++) {
    for (let j: number = 1; j <= n; j++) {
      if (matrix[i - 1][j - 1] === "1") {
        // 状态转移：取左、上、左上三个位置的最小值+1
        // 正方形边长受限于三个方向的最短边
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        maxSide = Math.max(maxSide, dp[i][j]);
      }
    }
  }
  return maxSide * maxSide;
}

// 方法2：动态规划-空间优化为一维
// 将dp[i][j]压缩为一维数组，额外用一个变量保存左上角值dp[i-1][j-1]
// 时间复杂度 O(mn)，空间复杂度 O(n)
function maximalSquareOptimized(matrix: string[][]): number {
  const m: number = matrix.length;
  const n: number = matrix[0].length;
  const dp: number[] = new Array<number>(n + 1).fill(0);
  let maxSide: number = 0;
  let prev: number; // 记录dp[i-1][j-1]（左上角值），在每次外层循环开始时赋值

  for (let i: number = 1; i <= m; i++) {
    prev = 0;
    for (let j: number = 1; j <= n; j++) {
      const temp: number = dp[j]; // 保存当前值，下一轮作为prev（左上角）
      if (matrix[i - 1][j - 1] === "1") {
        // dp[j] = min(上方dp[j], 左方dp[j-1], 左上prev) + 1
        dp[j] = Math.min(dp[j], dp[j - 1], prev) + 1;
        maxSide = Math.max(maxSide, dp[j]);
      } else {
        dp[j] = 0;
      }
      prev = temp;
    }
  }
  return maxSide * maxSide;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 038. 最大正方形 =====");
console.log(
  maximalSquare([
    ["1", "0", "1", "0", "0"],
    ["1", "0", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "0", "0", "1", "0"],
  ]),
); // 期望结果: 4
console.log(
  maximalSquareOptimized([
    ["1", "0", "1", "0", "0"],
    ["1", "0", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "0", "0", "1", "0"],
  ]),
); // 期望结果: 4
console.log(maximalSquare([["0"]])); // 期望结果: 0
console.log(maximalSquare([["1"]])); // 期望结果: 1

export {};
