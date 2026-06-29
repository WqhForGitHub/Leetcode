// ============================================================
// 148. 在网格图中访问一个格子的最少时间
// ============================================================
// LeetCode 2577. Minimum Time to Visit a Cell In a Grid
// 从(0,0)出发到达(m-1,n-1)，每次可上下左右移动，但只能在 grid[r][c] <= time 时进入。
// 时间复杂度：O(mn log(mn))，空间复杂度：O(mn)

// 方法1：Dijkstra + 最小堆
function minimumTime(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  if (grid[0][1] > 1 && grid[1][0] > 1) return -1;
  const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dist[0][0] = 0;
  const heap: Array<[number, number, number]> = [[0, 0, 0]]; // [time, r, c]
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] < heap[p][0]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l][0] < heap[s][0]) s = l;
      if (r < len && heap[r][0] < heap[s][0]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  while (heap.length > 0) {
    const [time, r, c] = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown();
    if (r === m - 1 && c === n - 1) return time;
    if (visited[r][c]) continue;
    visited[r][c] = true;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc]) continue;
      const diff = grid[nr][nc] - time;
      let newTime: number;
      if (diff <= 1) newTime = time + 1;
      else newTime = time + 1 + Math.floor((diff - 1) / 2) * 2;
      if (newTime < dist[nr][nc]) {
        dist[nr][nc] = newTime;
        heap.push([newTime, nr, nc]);
        siftUp(heap.length - 1);
      }
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 148. 在网格图中访问一个格子的最少时间 =====");
console.log("Dijkstra:", minimumTime([[0, 1, 3, 2], [5, 1, 2, 5], [4, 3, 8, 6]])); // 期望 7
console.log("Dijkstra:", minimumTime([[0, 2, 4], [3, 2, 1], [1, 0, 4]])); // 期望 -1

export {};
