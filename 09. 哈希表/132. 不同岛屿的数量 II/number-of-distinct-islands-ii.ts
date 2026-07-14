// ============================================================
// 132. 不同岛屿的数量 II
// ============================================================
// LeetCode 711. Number of Distinct Islands II
// 给定 0/1 矩阵，统计不同形状岛屿数。形状相同包括旋转和翻转后能重合。
// 时间复杂度：O(m*n * L * log L)，L 为岛屿大小；空间复杂度：O(m*n)

function numDistinctIslands2(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const visited = new Array(m).fill(0).map(() => new Array(n).fill(false));
  const shapes = new Set<string>();

  // DFS 收集岛屿所有单元格坐标
  const dfs = (i: number, j: number, cells: [number, number][]): void => {
    if (i < 0 || i >= m || j < 0 || j >= n) return;
    if (grid[i][j] === 0 || visited[i][j]) return;
    visited[i][j] = true;
    cells.push([i, j]);
    dfs(i - 1, j, cells);
    dfs(i + 1, j, cells);
    dfs(i, j - 1, cells);
    dfs(i, j + 1, cells);
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        const cells: [number, number][] = [];
        dfs(i, j, cells);
        // 计算 8 种变换的规范形式，取最小作为唯一签名
        const sig = canonical(cells);
        shapes.add(sig);
      }
    }
  }
  return shapes.size;
}

// 对岛屿坐标的 8 种变换（4 旋转 × 2 翻转）取字典序最小签名
function canonical(cells: [number, number][]): string {
  const transforms: [number, number][][] = [];
  // 8 种变换：(x,y), (x,-y), (-x,y), (-x,-y), (y,x), (y,-x), (-y,x), (-y,-x)
  const ops = [
    (x: number, y: number): [number, number] => [x, y],
    (x: number, y: number): [number, number] => [x, -y],
    (x: number, y: number): [number, number] => [-x, y],
    (x: number, y: number): [number, number] => [-x, -y],
    (x: number, y: number): [number, number] => [y, x],
    (x: number, y: number): [number, number] => [y, -x],
    (x: number, y: number): [number, number] => [-y, x],
    (x: number, y: number): [number, number] => [-y, -x],
  ];

  let best: string | null = null;
  for (const op of ops) {
    const transformed = cells.map(([x, y]) => op(x, y));
    // 平移到原点：减去最小 x、最小 y
    const minX = Math.min(...transformed.map((c) => c[0]));
    const minY = Math.min(...transformed.map((c) => c[1]));
    const normalized = transformed
      .map(([x, y]) => [x - minX, y - minY] as [number, number])
      .sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
    const key = JSON.stringify(normalized);
    if (best === null || key < best) {
      best = key;
    }
  }
  return best!;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 132. 不同岛屿的数量 II =====");
console.log(
  numDistinctIslands2([
    [1, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 1],
  ]),
); // 期望: 1 (两个岛屿互为旋转)
console.log(
  numDistinctIslands2([
    [1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 1],
  ]),
); // 期望: 2

export {};
