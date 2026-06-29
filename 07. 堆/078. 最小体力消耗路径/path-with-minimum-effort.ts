// ============================================================
// 078. 最小体力消耗路径
// ============================================================
// LeetCode 1631. Path With Minimum Effort
// 从左上到右下，体力消耗是路径上相邻格高度差最大值，求最小消耗。
// 时间复杂度：O(mn log(mn))，空间复杂度：O(mn)

// 方法1：Dijkstra + 最小堆（推荐）
function minimumEffortPath(heights: number[][]): number {
  const m = heights.length;
  const n = heights[0].length;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const effort: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  effort[0][0] = 0;
  const heap: Array<{ e: number; r: number; c: number }> = [];
  const push = (v: { e: number; r: number; c: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].e < heap[p].e) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { e: number; r: number; c: number } | undefined => {
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
        if (l < heap.length && heap[l].e < heap[s].e) s = l;
        if (r < heap.length && heap[r].e < heap[s].e) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  push({ e: 0, r: 0, c: 0 });
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.r === m - 1 && cur.c === n - 1) return cur.e;
    if (cur.e > effort[cur.r][cur.c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const ne = Math.max(cur.e, Math.abs(heights[nr][nc] - heights[cur.r][cur.c]));
      if (ne < effort[nr][nc]) {
        effort[nr][nc] = ne;
        push({ e: ne, r: nr, c: nc });
      }
    }
  }
  return 0;
}

// 方法2：并查集
function minimumEffortPathUF(heights: number[][]): number {
  const m = heights.length;
  const n = heights[0].length;
  const edges: Array<{ d: number; u: number; v: number }> = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      const idx = r * n + c;
      if (r + 1 < m) edges.push({ d: Math.abs(heights[r][c] - heights[r + 1][c]), u: idx, v: (r + 1) * n + c });
      if (c + 1 < n) edges.push({ d: Math.abs(heights[r][c] - heights[r][c + 1]), u: idx, v: r * n + c + 1 });
    }
  }
  edges.sort((a, b) => a.d - b.d);
  const parent: number[] = new Array(m * n).fill(0).map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  for (const { d, u, v } of edges) {
    parent[find(u)] = find(v);
    if (find(0) === find(m * n - 1)) return d;
  }
  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 078. 最小体力消耗路径 =====");
console.log("Dijkstra:", minimumEffortPath([[1, 2, 2], [3, 8, 2], [5, 3, 5]])); // 期望 2
console.log("并查集:", minimumEffortPathUF([[1, 2, 3], [3, 8, 4], [5, 3, 5]])); // 期望 1

export {};
