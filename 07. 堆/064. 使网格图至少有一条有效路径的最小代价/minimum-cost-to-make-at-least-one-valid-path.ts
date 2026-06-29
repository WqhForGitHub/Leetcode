// ============================================================
// 064. 使网格图至少有一条有效路径的最小代价
// ============================================================
// LeetCode 1368. Minimum Cost to Make at Least One Valid Path in Grid
// 网格中每个格子有方向，可花代价 1 改变方向，求从左上到右下的最小代价。
// 时间复杂度：O(mn log(mn))，空间复杂度：O(mn)

// 方法1：Dijkstra + 最小堆
function minCost(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const heap: Array<{ c: number; r: number; col: number }> = [];
  const push = (v: { c: number; r: number; col: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].c < heap[p].c) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): { c: number; r: number; col: number } | undefined => {
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
        if (l < heap.length && heap[l].c < heap[s].c) s = l;
        if (r < heap.length && heap[r].c < heap[s].c) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  dist[0][0] = 0;
  push({ c: 0, r: 0, col: 0 });
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.r === m - 1 && cur.col === n - 1) return cur.c;
    if (cur.c > dist[cur.r][cur.col]) continue;
    for (let d = 0; d < 4; d++) {
      const nr = cur.r + dirs[d][0];
      const nc = cur.col + dirs[d][1];
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const cost = cur.c + (grid[cur.r][cur.col] === d + 1 ? 0 : 1);
      if (cost < dist[nr][nc]) {
        dist[nr][nc] = cost;
        push({ c: cost, r: nr, col: nc });
      }
    }
  }
  return dist[m - 1][n - 1];
}

// 方法2：0-1 BFS（双端队列）
function minCostBFS(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const deque: Array<[number, number, number]> = [[0, 0, 0]];
  dist[0][0] = 0;
  let head = 0;
  while (head < deque.length) {
    const [c, r, col] = deque[head++];
    if (r === m - 1 && col === n - 1) return c;
    if (c > dist[r][col]) continue;
    for (let d = 0; d < 4; d++) {
      const nr = r + dirs[d][0];
      const nc = col + dirs[d][1];
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const cost = c + (grid[r][col] === d + 1 ? 0 : 1);
      if (cost < dist[nr][nc]) {
        dist[nr][nc] = cost;
        if (grid[r][col] === d + 1) deque.splice(head, 0, [cost, nr, nc]);
        else deque.push([cost, nr, nc]);
        head++;
      }
    }
  }
  return dist[m - 1][n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 064. 使网格图至少有一条有效路径的最小代价 =====");
console.log(
  "Dijkstra:",
  minCost([
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [1, 1, 1, 1],
    [2, 2, 2, 2],
  ]),
); // 期望 3
console.log(
  "BFS:",
  minCostBFS([
    [1, 1, 3],
    [3, 2, 2],
    [1, 1, 4],
  ]),
); // 期望 0

export {};
