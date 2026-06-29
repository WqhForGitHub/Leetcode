// ============================================================
// 141. 矩阵查询可获得的最大分数
// ============================================================
// LeetCode 2503. Maximum Number of Points From Grid Queries
// 对每个查询值 q，从(0,0)开始BFS，只能访问值<q的格子，求能访问的格子数。
// 时间复杂度：O(q log q + mn log(mn))，空间复杂度：O(mn + q)

// 方法1：排序查询 + 最小堆 BFS
function maxPoints(grid: number[][], queries: number[]): number[] {
  const m = grid.length;
  const n = grid[0].length;
  const qLen = queries.length;
  const indexedQueries: Array<[number, number]> = queries.map((q, i) => [q, i]);
  indexedQueries.sort((a, b) => a[0] - b[0]);
  const result: number[] = new Array(qLen).fill(0);
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  // 最小堆 [value, r, c]
  const heap: Array<[number, number, number]> = [[grid[0][0], 0, 0]];
  visited[0][0] = true;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let count = 0;
  for (const [q, qi] of indexedQueries) {
    while (heap.length > 0 && heap[0][0] < q) {
      const [, r, c] = heap[0];
      heap[0] = heap[heap.length - 1];
      heap.pop();
      siftDown(heap, 0);
      count++;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
          visited[nr][nc] = true;
          heap.push([grid[nr][nc], nr, nc]);
          siftUp(heap, heap.length - 1);
        }
      }
    }
    result[qi] = count;
  }
  return result;

  function siftUp(h: Array<[number, number, number]>, i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[i][0] < h[p][0]) {
        [h[i], h[p]] = [h[p], h[i]];
        i = p;
      } else break;
    }
  }
  function siftDown(h: Array<[number, number, number]>, i: number): void {
    const len = h.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < len && h[l][0] < h[s][0]) s = l;
      if (r < len && h[r][0] < h[s][0]) s = r;
      if (s !== i) {
        [h[i], h[s]] = [h[s], h[i]];
        i = s;
      } else break;
    }
  }
}

// 方法2：离线 + 并查集
function maxPointsUF(grid: number[][], queries: number[]): number[] {
  const m = grid.length;
  const n = grid[0].length;
  const cells: Array<[number, number, number]> = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      cells.push([grid[i][j], i, j]);
    }
  }
  cells.sort((a, b) => a[0] - b[0]);
  const indexedQueries: Array<[number, number]> = queries.map((q, i) => [q, i]);
  indexedQueries.sort((a, b) => a[0] - b[0]);
  const result: number[] = new Array(queries.length).fill(0);
  const parent: number[] = new Array(m * n).fill(-1);
  const rank: number[] = new Array(m * n).fill(0);
  const find = (x: number): number => {
    while (parent[x] !== -1) x = parent[x];
    return x;
  };
  const union = (x: number, y: number): void => {
    const px = find(x),
      py = find(y);
    if (px === py) return;
    if (rank[px] < rank[py]) {
      parent[px] = py;
      rank[py] += rank[px];
    } else {
      parent[py] = px;
      rank[px] += rank[py];
    }
  };
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let idx = 0;
  rank[0] = 1;
  for (const [q, qi] of indexedQueries) {
    while (idx < cells.length && cells[idx][0] < q) {
      const [, r, c] = cells[idx];
      const flat = r * n + c;
      if (rank[flat] === 0) rank[flat] = 1;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] < q) {
          const nflat = nr * n + nc;
          if (rank[nflat] > 0) union(flat, nflat);
        }
      }
      idx++;
    }
    if (grid[0][0] < q) result[qi] = rank[find(0)];
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 141. 矩阵查询可获得的最大分数 =====");
console.log(
  "堆:",
  maxPoints(
    [
      [1, 2, 3],
      [2, 5, 7],
      [3, 5, 1],
    ],
    [5, 6, 2],
  ),
); // 期望 [5,8,1]
console.log(
  "堆:",
  maxPoints(
    [
      [5, 2, 1],
      [1, 1, 2],
    ],
    [3],
  ),
); // 期望 [0]

export {};
