// ============================================================
// 074. 不同岛屿的数量 II
// ============================================================
// LeetCode 711. Number of Distinct Islands II
// 统计不同岛屿的数量，旋转与翻转（共 8 种刚体变换）视为同一岛屿。

// 方法1：DFS 收集岛屿 + 8 种变换归一化求规范键（O(m*n*8)）
// 思路：对每个岛屿收集所有格子坐标，对其做 8 种旋转/翻转变换，
// 每种变换平移到原点并排序生成字符串键，取字典序最小的作为该岛屿规范键，去重计数。
function numDistinctIslands2(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array<boolean>(n).fill(false));

  const dfs = (r: number, c: number, cells: Array<[number, number]>): void => {
    if (r < 0 || r >= m || c < 0 || c >= n) return;
    if (visited[r][c] || grid[r][c] === 0) return;
    visited[r][c] = true;
    cells.push([r, c]);
    dfs(r + 1, c, cells);
    dfs(r - 1, c, cells);
    dfs(r, c + 1, cells);
    dfs(r, c - 1, cells);
  };

  const transforms: Array<(r: number, c: number) => [number, number]> = [
    (r, c) => [r, c],
    (r, c) => [r, -c],
    (r, c) => [-r, c],
    (r, c) => [-r, -c],
    (r, c) => [c, r],
    (r, c) => [c, -r],
    (r, c) => [-c, r],
    (r, c) => [-c, -r],
  ];

  const normalize = (cells: Array<[number, number]>): string => {
    const candidates: string[] = [];
    for (const tf of transforms) {
      const transformed: Array<[number, number]> = cells.map(([r, c]) => tf(r, c));
      let minR = Infinity;
      let minC = Infinity;
      for (const [r, c] of transformed) {
        if (r < minR) minR = r;
        if (c < minC) minC = c;
      }
      const normalized = transformed
        .map(([r, c]) => [r - minR, c - minC] as [number, number])
        .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      candidates.push(normalized.map(([r, c]) => `${r},${c}`).join(';'));
    }
    candidates.sort();
    return candidates[0];
  };

  const keys = new Set<string>();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        const cells: Array<[number, number]> = [];
        dfs(i, j, cells);
        keys.add(normalize(cells));
      }
    }
  }
  return keys.size;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 074. 不同岛屿的数量 II =====");
console.log("结果:", numDistinctIslands2([
  [1, 1, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 1, 1],
])); // 期望 1
console.log("结果:", numDistinctIslands2([
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
])); // 期望 1
console.log("结果:", numDistinctIslands2([
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
])); // 期望 1（两个单格旋转后相同）

export {};
