// ============================================================
// 160. 找出最安全路径
// ============================================================
// LeetCode 2812. Find the Safest Path in a Grid
// 网格中有小偷，求从(0,0)到(n-1,n-1)路径上到小偷最大最小距离。
// 时间复杂度：O(n^2 log n)，空间复杂度：O(n^2)

// 方法1：多源 BFS + 并查集
function maximumSafenessFactor(grid: number[][]): number {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return 0;
  // 多源 BFS 计算到最近小偷的距离
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1));
  const queue: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        dist[i][j] = 0;
        queue.push([i, j]);
      }
    }
  }
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let head = 0;
  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
  // 二分 + BFS 或并查集
  // 按距离从大到小排序
  const cells: Array<[number, number, number]> = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      cells.push([dist[i][j], i, j]);
    }
  }
  cells.sort((a, b) => b[0] - a[0]);
  const parent: number[] = new Array(n * n).fill(-1);
  const find = (x: number): number => {
    while (parent[x] !== -1) x = parent[x];
    return x;
  };
  const union = (x: number, y: number): void => {
    const px = find(x), py = find(y);
    if (px !== py) parent[px] = py;
  };
  const visited: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  for (const [d, r, c] of cells) {
    visited[r][c] = true;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && visited[nr][nc]) {
        union(r * n + c, nr * n + nc);
      }
    }
    if (visited[0][0] && visited[n - 1][n - 1] && find(0) === find(n * n - 1)) {
      return d;
    }
  }
  return 0;
}

// 方法2：Dijkstra + 最大堆
function maximumSafenessFactorDijkstra(grid: number[][]): number {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return 0;
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1));
  const queue: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        dist[i][j] = 0;
        queue.push([i, j]);
      }
    }
  }
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let head = 0;
  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
  // 最大堆，路径上最小距离的最大化
  const maxDist: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1));
  maxDist[0][0] = dist[0][0];
  const heap: Array<[number, number, number]> = [[dist[0][0], 0, 0]];
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] > heap[p][0]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const siftDown = (): void => {
    let i = 0;
    const len = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < len && heap[l][0] > heap[s][0]) s = l;
      if (r < len && heap[r][0] > heap[s][0]) s = r;
      if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
      else break;
    }
  };
  while (heap.length > 0) {
    const [d, r, c] = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) siftDown();
    if (r === n - 1 && c === n - 1) return d;
    if (d < maxDist[r][c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
        const nd = Math.min(d, dist[nr][nc]);
        if (nd > maxDist[nr][nc]) {
          maxDist[nr][nc] = nd;
          heap.push([nd, nr, nc]);
          siftUp(heap.length - 1);
        }
      }
    }
  }
  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 160. 找出最安全路径 =====");
console.log("并查集:", maximumSafenessFactor([[1, 0, 0], [0, 0, 0], [0, 0, 1]])); // 期望 0
console.log("Dijkstra:", maximumSafenessFactorDijkstra([[0, 0, 1], [0, 0, 0], [0, 0, 0]])); // 期望 2

export {};
