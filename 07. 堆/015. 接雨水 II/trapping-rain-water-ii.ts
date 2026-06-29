// ============================================================
// 015. 接雨水 II
// ============================================================
// LeetCode 407. Trapping Rain Water II
// 给定一个 m x n 的矩阵表示二维高度图，计算能接的雨水总量。
// 时间复杂度：O(mn log(mn))，空间复杂度：O(mn)

// 方法1：最小堆 + BFS 边界扩展（推荐）
function trapRainWater(heightMap: number[][]): number {
  const m = heightMap.length;
  if (m < 3) return 0;
  const n = heightMap[0].length;
  if (n < 3) return 0;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const heap: Array<{ h: number; r: number; c: number }> = [];
  const push = (v: { h: number; r: number; c: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].h < heap[p].h) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { h: number; r: number; c: number } | undefined => {
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
        if (l < heap.length && heap[l].h < heap[s].h) s = l;
        if (r < heap.length && heap[r].h < heap[s].h) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let j = 0; j < n; j++) {
    visited[0][j] = true;
    push({ h: heightMap[0][j], r: 0, c: j });
    visited[m - 1][j] = true;
    push({ h: heightMap[m - 1][j], r: m - 1, c: j });
  }
  for (let i = 1; i < m - 1; i++) {
    visited[i][0] = true;
    push({ h: heightMap[i][0], r: i, c: 0 });
    visited[i][n - 1] = true;
    push({ h: heightMap[i][n - 1], r: i, c: n - 1 });
  }
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let water = 0;
  while (heap.length > 0) {
    const cur = pop()!;
    for (const [dr, dc] of dirs) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc]) continue;
      visited[nr][nc] = true;
      water += Math.max(0, cur.h - heightMap[nr][nc]);
      push({ h: Math.max(cur.h, heightMap[nr][nc]), r: nr, c: nc });
    }
  }
  return water;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 015. 接雨水 II =====");
console.log(
  "接雨水:",
  trapRainWater([
    [1, 4, 3, 1, 3, 2],
    [3, 2, 1, 3, 2, 4],
    [2, 3, 3, 2, 3, 1],
  ]),
); // 期望 4

export {};
