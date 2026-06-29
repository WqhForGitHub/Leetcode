// ============================================================
// 036. 水位上升的泳池中游泳
// ============================================================
// LeetCode 778. Swim in Rising Water
// 在 N x N 网格中，水位从 0 上升到 N*N-1，求能从左上到右下的最小时刻。
// 时间复杂度：O(N^2 log N)，空间复杂度：O(N^2)

// 方法1：最小堆 + Dijkstra（推荐）
function swimInWater(grid: number[][]): number {
  const n = grid.length;
  const visited: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  const heap: Array<{ t: number; r: number; c: number }> = [];
  const push = (v: { t: number; r: number; c: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].t < heap[p].t) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { t: number; r: number; c: number } | undefined => {
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
        if (l < heap.length && heap[l].t < heap[s].t) s = l;
        if (r < heap.length && heap[r].t < heap[s].t) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  push({ t: grid[0][0], r: 0, c: 0 });
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.r === n - 1 && cur.c === n - 1) return cur.t;
    if (visited[cur.r][cur.c]) continue;
    visited[cur.r][cur.c] = true;
    for (const [dr, dc] of dirs) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || visited[nr][nc]) continue;
      push({ t: Math.max(cur.t, grid[nr][nc]), r: nr, c: nc });
    }
  }
  return -1;
}

// 方法2：并查集
function swimInWaterUF(grid: number[][]): number {
  const n = grid.length;
  const pos: Array<{ h: number; idx: number }> = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) pos.push({ h: grid[i][j], idx: i * n + j });
  pos.sort((a, b) => a.h - b.h);
  const parent: number[] = new Array(n * n).fill(0).map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (a: number, b: number): void => {
    parent[find(a)] = find(b);
  };
  const seen: boolean[] = new Array(n * n).fill(false);
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const { h, idx } of pos) {
    const r = Math.floor(idx / n);
    const c = idx % n;
    seen[idx] = true;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || !seen[nr * n + nc]) continue;
      union(idx, nr * n + nc);
    }
    if (find(0) === find(n * n - 1)) return h;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 036. 水位上升的泳池中游泳 =====");
console.log("Dijkstra:", swimInWater([[0, 2], [1, 3]])); // 期望 3
console.log("并查集:", swimInWaterUF([[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]])); // 期望 16

export {};
