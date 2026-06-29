// ============================================================
// 120. 到达角落需要移除障碍物的最小数目
// ============================================================
// LeetCode 2290. Minimum Obstacle Removal to Reach Corner
// 网格中 1 是障碍，0 是空地，求从左上到右下移除障碍的最小数。
// 时间复杂度：O(mn log(mn))，空间复杂度：O(mn)

// 方法1：Dijkstra + 最小堆
function minimumObstacles(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dist[0][0] = 0;
  const heap: Array<{ d: number; r: number; c: number }> = [{ d: 0, r: 0, c: 0 }];
  const push = (v: { d: number; r: number; c: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].d < heap[p].d) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { d: number; r: number; c: number } => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < heap.length && heap[l].d < heap[s].d) s = l;
        if (r < heap.length && heap[r].d < heap[s].d) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.r === m - 1 && cur.c === n - 1) return cur.d;
    if (cur.d > dist[cur.r][cur.c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const nd = cur.d + grid[nr][nc];
      if (nd < dist[nr][nc]) {
        dist[nr][nc] = nd;
        push({ d: nd, r: nr, c: nc });
      }
    }
  }
  return dist[m - 1][n - 1];
}

// 方法2：0-1 BFS（双端队列）
function minimumObstaclesBFS(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dist[0][0] = 0;
  const deque: Array<[number, number, number]> = [[0, 0, 0]];
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let head = 0;
  while (head < deque.length) {
    const [d, r, c] = deque[head++];
    if (r === m - 1 && c === n - 1) return d;
    if (d > dist[r][c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const nd = d + grid[nr][nc];
      if (nd < dist[nr][nc]) {
        dist[nr][nc] = nd;
        if (grid[nr][nc] === 0) deque.splice(head, 0, [nd, nr, nc]);
        else deque.push([nd, nr, nc]);
      }
    }
  }
  return dist[m - 1][n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 120. 到达角落需要移除障碍物的最小数目 =====");
console.log(
  "Dijkstra:",
  minimumObstacles([
    [0, 1, 1],
    [1, 1, 0],
    [1, 1, 0],
  ]),
); // 期望 2
console.log(
  "BFS:",
  minimumObstaclesBFS([
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ]),
); // 期望 0

export {};
