// ============================================================
// 097. 矩阵中最长的连续 1 线段
// ============================================================
// LeetCode 562. Longest Line of Consecutive One in Matrix
// 给定 m×n 二进制矩阵，返回最长连续 1 线段的长度
// （水平/垂直/对角/反对角）。
// 时间复杂度：O(mn)，空间复杂度：O(mn)

// 方法1：DP 四方向（推荐）
// 对每个方向分别做DP
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function longestLine(mat: number[][]): number {
  const m: number = mat.length;
  if (m === 0) return 0;
  const n: number = mat[0].length;
  let result: number = 0;

  // 4个方向的DP
  // horizontal[i][j]: 以 (i,j) 结尾的水平连续1长度
  // vertical[i][j]: 以 (i,j) 结尾的垂直连续1长度
  // diagonal[i][j]: 以 (i,j) 结尾的对角线(左上->右下)连续1长度
  // antiDiagonal[i][j]: 以 (i,j) 结尾的反对角线(右上->左下)连续1长度
  const horizontal: number[][] = [];
  const vertical: number[][] = [];
  const diagonal: number[][] = [];
  const antiDiagonal: number[][] = [];

  for (let i: number = 0; i < m; i++) {
    horizontal.push(new Array(n).fill(0));
    vertical.push(new Array(n).fill(0));
    diagonal.push(new Array(n).fill(0));
    antiDiagonal.push(new Array(n).fill(0));
  }

  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      if (mat[i][j] === 0) continue;

      // 水平：左边连续1 + 1
      horizontal[i][j] = (j > 0 ? horizontal[i][j - 1] : 0) + 1;
      result = Math.max(result, horizontal[i][j]);

      // 垂直：上边连续1 + 1
      vertical[i][j] = (i > 0 ? vertical[i - 1][j] : 0) + 1;
      result = Math.max(result, vertical[i][j]);

      // 对角线（左上 -> 右下）
      diagonal[i][j] = (i > 0 && j > 0 ? diagonal[i - 1][j - 1] : 0) + 1;
      result = Math.max(result, diagonal[i][j]);

      // 反对角线（右上 -> 左下）
      antiDiagonal[i][j] = (i > 0 && j < n - 1 ? antiDiagonal[i - 1][j + 1] : 0) + 1;
      result = Math.max(result, antiDiagonal[i][j]);
    }
  }

  return result;
}

// 方法2：DP 空间优化
// 只用一维数组做水平和对角线
// 时间复杂度 O(mn)，空间复杂度 O(n)
function longestLineOptimized(mat: number[][]): number {
  const m: number = mat.length;
  if (m === 0) return 0;
  const n: number = mat[0].length;
  let result: number = 0;

  // dp[j] 表示当前行水平方向以 j 结尾的连续1长度
  const dp: number[] = new Array(n).fill(0);
  // 垂直方向
  const vertical: number[] = new Array(n).fill(0);
  // 对角线方向（需要 prev 数组保存上一行的对角线值）
  const diag: number[] = new Array(n).fill(0);
  const antiDiag: number[] = new Array(n).fill(0);

  for (let i: number = 0; i < m; i++) {
    const prevDiag: number[] = [...diag];
    const prevAntiDiag: number[] = [...antiDiag];

    for (let j: number = 0; j < n; j++) {
      if (mat[i][j] === 0) {
        dp[j] = 0;
        vertical[j] = 0;
        diag[j] = 0;
        antiDiag[j] = 0;
        continue;
      }
      dp[j] = (j > 0 ? dp[j - 1] : 0) + 1;
      vertical[j] = vertical[j] + 1;
      diag[j] = (j > 0 ? prevDiag[j - 1] : 0) + 1;
      antiDiag[j] = (j < n - 1 ? prevAntiDiag[j + 1] : 0) + 1;

      result = Math.max(result, dp[j], vertical[j], diag[j], antiDiag[j]);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 097. 矩阵中最长的连续 1 线段 =====");
console.log(
  longestLine([
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 1],
  ]),
); // 期望结果: 3
console.log(
  longestLine([
    [1, 1, 1, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 1],
  ]),
); // 期望结果: 4
console.log(longestLine([[1]])); // 期望结果: 1
console.log("--- 方法2测试 ---");
console.log(
  longestLineOptimized([
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 1],
  ]),
); // 期望结果: 3

export {};
