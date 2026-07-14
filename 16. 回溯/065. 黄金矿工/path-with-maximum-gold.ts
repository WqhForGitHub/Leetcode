// ============================================================
// 065. 黄金矿工
// ============================================================
// LeetCode 1219. Path with Maximum Gold
// 给定网格，每个格子有金子数量。从任一非0格出发，可上下左右移动，
// 不能进入 0 格，不能重复访问。返回最多能采集的金子数。
// 时间复杂度：O(4^(M*N)), 空间复杂度：O(M*N)

// 方法1：DFS 回溯 (从每个非0格子出发) (推荐)
// 对每个起点做 DFS，标记访问，回溯尝试四个方向
// 时间复杂度 O(4^(M*N)), 空间复杂度 O(M*N)
function getMaximumGold(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let best = 0;

  const dfs = (i: number, j: number, cur: number): void => {
    // 累加当前格子金子
    cur += grid[i][j];
    if (cur > best) best = cur;
    // 标记访问：临时置 0
    const tmp = grid[i][j];
    grid[i][j] = 0;
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] !== 0) {
        dfs(ni, nj, cur);
      }
    }
    // 回溯
    grid[i][j] = tmp;
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] !== 0) {
        dfs(i, j, 0);
      }
    }
  }

  return best;
}

// 方法2：DFS + 剪枝
// 在 DFS 中加入剩余可达金子总和的剪枝：若当前 + 剩余 <= best，剪枝
// 时间复杂度 O(4^(M*N)) 平均更优, 空间复杂度 O(M*N)
function getMaximumGold2(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let best = 0;

  // 计算所有非0格子的金子总和，作为上界估计
  let totalGold = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      totalGold += grid[i][j];
    }
  }

  const dfs = (i: number, j: number, cur: number, remaining: number): void => {
    cur += grid[i][j];
    if (cur > best) best = cur;
    // 剪枝：若当前 + 剩余所有金子 <= best，则无法改进
    if (cur + remaining <= best) return;

    const tmp = grid[i][j];
    grid[i][j] = 0;
    const newRemaining = remaining - tmp;
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] !== 0) {
        dfs(ni, nj, cur, newRemaining);
      }
    }
    grid[i][j] = tmp;
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] !== 0) {
        dfs(i, j, 0, totalGold);
      }
    }
  }

  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 065. 黄金矿工 =====");
console.log(
  getMaximumGold([
    [0, 6, 0],
    [5, 8, 7],
    [0, 9, 0],
  ]),
); // 期望结果: 24
console.log(
  getMaximumGold2([
    [0, 6, 0],
    [5, 8, 7],
    [0, 9, 0],
  ]),
); // 期望结果: 24
console.log(
  getMaximumGold([
    [1, 0, 7],
    [2, 0, 6],
    [3, 4, 5],
    [0, 3, 0],
    [4, 0, 0],
  ]),
); // 期望结果: 28

export {};
