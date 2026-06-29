// ============================================================
// 051. 得分最高的路径
// ============================================================
// LeetCode 1102. Path With Maximum Minimum Value
// 从左上到右下，路径得分是经过节点的最小值，求最大得分。
// 时间复杂度：O(mn log(mn))，空间复杂度：O(mn)

// 方法1：最大堆 + Dijkstra
function maximumMinimumPath(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const heap: Array<{ score: number; r: number; c: number }> = [];
  const push = (v: { score: number; r: number; c: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].score > heap[p].score) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { score: number; r: number; c: number } | undefined => {
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].score > heap[s].score) s = l;
        if (r < heap.length && heap[r].score > heap[s].score) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  push({ score: grid[0][0], r: 0, c: 0 });
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.r === m - 1 && cur.c === n - 1) return cur.score;
    if (visited[cur.r][cur.c]) continue;
    visited[cur.r][cur.c] = true;
    for (const [dr, dc] of dirs) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc]) continue;
      push({ score: Math.min(cur.score, grid[nr][nc]), r: nr, c: nc });
    }
  }
  return -1;
}

// 方法2：并查集
function maximumMinimumPathUF(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const cells: Array<{ v: number; idx: number }> = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) cells.push({ v: grid[i][j], idx: i * n + j });
  cells.sort((a, b) => b.v - a.v);
  const parent: number[] = new Array(m * n).fill(-1);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const seen: boolean[] = new Array(m * n).fill(false);
  for (const { v, idx } of cells) {
    parent[idx] = idx;
    seen[idx] = true;
    const r = Math.floor(idx / n);
    const c = idx % n;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || !seen[nr * n + nc]) continue;
      parent[find(idx)] = find(nr * n + nc);
    }
    if (seen[0] && seen[m * n - 1] && find(0) === find(m * n - 1)) return v;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 051. 得分最高的路径 =====");
console.log("堆:", maximumMinimumPath([[5, 4, 5], [1, 2, 6], [7, 4, 3]])); // 期望 4
console.log("并查集:", maximumMinimumPathUF([[1, 2, 3], [4, 5, 6], [7, 8, 9]])); // 期望 7

export {};
