// ============================================================
// 052. 矩阵中的最长递增路径
// ============================================================
// LeetCode 329. Longest Increasing Path in a Matrix
// 给定一个 m x n 整数矩阵 matrix，找出其中最长递增路径的长度。
// 对于每个单元格，你可以往上、下、左、右四个方向移动。
// 时间复杂度 O(m * n)，空间复杂度 O(m * n)

// 方法1：记忆化 DFS + 动态规划（推荐）
// dp[i][j] 表示从 (i, j) 出发的最长递增路径长度
// 状态转移：dp[i][j] = 1 + max(dp[ni][nj])，其中 (ni, nj) 是相邻且值更大的格子
// 使用记忆化避免重复计算
// 时间复杂度 O(m * n)，空间复杂度 O(m * n)
function longestIncreasingPath(matrix: number[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;

  const m: number = matrix.length;
  const n: number = matrix[0].length;
  // dp[i][j] 记录从 (i, j) 出发的最长递增路径长度
  const dp: number[][] = new Array(m).fill(0).map(() => new Array(n).fill(0));
  // 四个方向：右、左、下、上
  const dirs: number[][] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let result: number = 0;

  // 深度优先搜索，返回从 (i, j) 出发的最长递增路径长度
  function dfs(i: number, j: number): number {
    // 如果已经计算过，直接返回记忆化的结果
    if (dp[i][j] !== 0) return dp[i][j];

    // 至少包含自身，路径长度为 1
    let maxLen: number = 1;

    // 遍历四个方向
    for (let d: number = 0; d < 4; d++) {
      const ni: number = i + dirs[d][0];
      const nj: number = j + dirs[d][1];
      // 相邻格子未越界且值严格更大时，可以移动
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
        // 状态转移：当前路径 = 1 + 相邻格子的最长路径
        maxLen = Math.max(maxLen, dfs(ni, nj) + 1);
      }
    }

    // 记忆化存储
    dp[i][j] = maxLen;
    return maxLen;
  }

  // 从每个格子出发进行 DFS
  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      result = Math.max(result, dfs(i, j));
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 052. 矩阵中的最长递增路径 =====");
console.log(
  longestIncreasingPath([
    [9, 9, 4],
    [6, 6, 8],
    [2, 1, 1],
  ]),
); // 期望结果: 4 (路径 1->2->6->9)
console.log(
  longestIncreasingPath([
    [3, 4, 5],
    [3, 2, 6],
    [2, 2, 1],
  ]),
); // 期望结果: 4 (路径 1->2->3->4 或 1->2->6->5)
console.log(longestIncreasingPath([[1]])); // 期望结果: 1

export {};
