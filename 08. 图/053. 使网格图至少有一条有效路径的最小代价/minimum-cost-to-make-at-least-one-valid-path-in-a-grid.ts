// ============================================================
// 053. 使网格图至少有一条有效路径的最小代价
// ============================================================
// LeetCode 1368. Minimum Cost to Make at Least One Valid Path in a Grid
// grid[i][j] 指示该格方向（1右 2左 3下 4上）。可修改单元格方向，代价为 1。
// 求从 (0,0) 到 (m-1,n-1) 有有效路径的最小修改代价。
// 时间复杂度：O(m*n)，空间复杂度：O(m*n)

// 方向编码：1右 2左 3下 4上
const DIRS: number[][] = [
  [], // 占位
  [0, 1], // 1 右
  [0, -1], // 2 左
  [1, 0], // 3 下
  [-1, 0], // 4 上
];

// ============================================================
// 方法1：0-1 BFS（双端队列，推荐）
// 时间复杂度：O(m*n)，空间复杂度：O(m*n)
// 沿当前格子指示方向走代价 0（入队头），其余方向代价 1（入队尾）
// ============================================================
function minCost01BFS(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dist: number[][] = Array.from({ length: m }, () =>
    new Array(n).fill(Number.POSITIVE_INFINITY),
  );
  dist[0][0] = 0;
  // 双端队列：元素 [r, c]
  const dq: [number, number][] = [[0, 0]];
  while (dq.length > 0) {
    const [r, c] = dq.shift()!;
    // 取出时若非最优则跳过
    // 遍历 4 个方向
    for (let d = 1; d <= 4; d++) {
      const nr = r + DIRS[d][0];
      const nc = c + DIRS[d][1];
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const cost = grid[r][c] === d ? 0 : 1;
      if (dist[r][c] + cost < dist[nr][nc]) {
        dist[nr][nc] = dist[r][c] + cost;
        if (cost === 0) dq.unshift([nr, nc]);
        else dq.push([nr, nc]);
      }
    }
  }
  return dist[m - 1][n - 1];
}

// ============================================================
// 方法2：Dijkstra
// 时间复杂度：O(m*n log(m*n))，空间复杂度：O(m*n)
// ============================================================
function minCostDijkstra(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dist: number[][] = Array.from({ length: m }, () =>
    new Array(n).fill(Number.POSITIVE_INFINITY),
  );
  dist[0][0] = 0;
  // 堆元素 [代价, r, c]，简单用数组排序模拟最小堆
  const heap: [number, number, number][] = [[0, 0, 0]];
  while (heap.length > 0) {
    let minIdx = 0;
    for (let i = 1; i < heap.length; i++) {
      if (heap[i][0] < heap[minIdx][0]) minIdx = i;
    }
    const [d, r, c] = heap[minIdx];
    heap.splice(minIdx, 1);
    if (d > dist[r][c]) continue;
    if (r === m - 1 && c === n - 1) return d;
    for (let dir = 1; dir <= 4; dir++) {
      const nr = r + DIRS[dir][0];
      const nc = c + DIRS[dir][1];
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      const cost = grid[r][c] === dir ? 0 : 1;
      const nd = d + cost;
      if (nd < dist[nr][nc]) {
        dist[nr][nc] = nd;
        heap.push([nd, nr, nc]);
      }
    }
  }
  return dist[m - 1][n - 1];
}

// 统一入口
function minCost(grid: number[][]): number {
  return minCost01BFS(grid);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 053. 使网格图至少有一条有效路径的最小代价 =====");
// 测试1: grid=[[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]] -> 3
console.log(
  minCost([
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [1, 1, 1, 1],
    [2, 2, 2, 2],
  ]),
); // 期望 3
console.log(
  minCostDijkstra([
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [1, 1, 1, 1],
    [2, 2, 2, 2],
  ]),
); // 期望 3
// 测试2: grid=[[1,1,3],[3,2,2],[1,1,4]] -> 0
console.log(
  minCost([
    [1, 1, 3],
    [3, 2, 2],
    [1, 1, 4],
  ]),
); // 期望 0
// 测试3: grid=[[1,2],[4,3]] -> 1
console.log(
  minCost([
    [1, 2],
    [4, 3],
  ]),
); // 期望 1
console.log(
  minCostDijkstra([
    [1, 2],
    [4, 3],
  ]),
); // 期望 1

export {};
