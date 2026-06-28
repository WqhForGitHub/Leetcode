// ============================================================
// 127. 不同岛屿的数量
// ============================================================
// LeetCode 694. Number of Distinct Islands
// 给定 0/1 矩阵，1 为陆地。统计不同形状的岛屿数量。
// 岛屿形状相同指平移后完全重合（不考虑旋转、翻转）。
// 时间复杂度：O(m*n)，空间复杂度：O(m*n)

function numDistinctIslands(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const visited = new Array(m)
    .fill(0)
    .map(() => new Array(n).fill(false));
  const shapes = new Set<string>();

  // DFS 探索岛屿，记录相对路径（用方向字符）
  const dfs = (i: number, j: number, dir: string, path: string[]): void => {
    if (i < 0 || i >= m || j < 0 || j >= n) return;
    if (grid[i][j] === 0 || visited[i][j]) return;
    visited[i][j] = true;
    path.push(dir);
    // 四个方向：上、下、左、右，并记录回溯标记
    dfs(i - 1, j, "U", path);
    dfs(i + 1, j, "D", path);
    dfs(i, j - 1, "L", path);
    dfs(i, j + 1, "R", path);
    path.push("B"); // 回溯
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        const path: string[] = [];
        dfs(i, j, "S", path); // S 表示起点
        shapes.add(path.join(""));
      }
    }
  }
  return shapes.size;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 127. 不同岛屿的数量 =====");
// 测试 1
console.log(
  numDistinctIslands([
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
  ]),
); // 期望: 1
// 测试 2
console.log(
  numDistinctIslands([
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
  ]),
); // 期望: 3

export {};
