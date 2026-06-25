// ============================================================
// 32. 岛屿的周长
// ============================================================
// LeetCode 463. Island Perimeter
// 给定二维网格地图 grid，1 表示陆地，0 表示水域。网格中只有一个岛屿，求其周长。
// 时间复杂度：O(m*n)，空间复杂度：O(1)

// 方法1：遍历统计-每个陆地格子的边如果是边界或水域则计入周长（推荐）
function islandPerimeter(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let perimeter = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) {
        // 检查四个方向：上、下、左、右
        // 若相邻为边界或水域，则该边计入周长
        if (i === 0 || grid[i - 1][j] === 0) perimeter++; // 上
        if (i === rows - 1 || grid[i + 1][j] === 0) perimeter++; // 下
        if (j === 0 || grid[i][j - 1] === 0) perimeter++; // 左
        if (j === cols - 1 || grid[i][j + 1] === 0) perimeter++; // 右
      }
    }
  }

  return perimeter;
}

// 方法2：公式法-周长=4*陆地数-2*相邻陆地边数
function islandPerimeterFormula(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let land = 0; // 陆地格子数
  let border = 0; // 相邻陆地边数（每对相邻算 1，会分别从两个格子各统计一次）

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) {
        land++;
        // 只需检查右和下，避免重复统计
        if (j + 1 < cols && grid[i][j + 1] === 1) border++;
        if (i + 1 < rows && grid[i + 1][j] === 1) border++;
      }
    }
  }

  // 每个陆地贡献 4 条边，每对相邻陆地共享 2 条边（被消除）
  return 4 * land - 2 * border;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 32. 岛屿的周长 =====");
console.log(
  "描述:",
  islandPerimeter([
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
  ]),
); // 期望结果: 16
console.log("描述:", islandPerimeter([[1]])); // 期望结果: 4
console.log("描述:", islandPerimeter([[1, 0]])); // 期望结果: 4
console.log(
  "描述:",
  islandPerimeterFormula([
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
  ]),
); // 期望结果: 16

export {};
