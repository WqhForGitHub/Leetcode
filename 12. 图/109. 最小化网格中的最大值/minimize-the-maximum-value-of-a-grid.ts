// 自定义. 最小化网格中的最大值
// m x n 网格, 从 (0,0) 到 (m-1,n-1) 路径最大值最小化
// 二分 + BFS / Dijkstra 变形

type Grid = number[][];

// 方法1: 二分 + BFS 可达性
function minimizeMax1(grid: Grid): number {
  const m = grid.length,
    n = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  function can(maxVal: number): boolean {
    if (grid[0][0] > maxVal) return false;
    const visited = new Array(m).fill(0).map(() => new Array(n).fill(false));
    visited[0][0] = true;
    const q: [number, number][] = [[0, 0]];
    while (q.length) {
      const [x, y] = q.shift()!;
      if (x === m - 1 && y === n - 1) return true;
      for (const [dx, dy] of dirs) {
        const nx = x + dx,
          ny = y + dy;
        if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
        if (visited[nx][ny]) continue;
        if (grid[nx][ny] > maxVal) continue;
        visited[nx][ny] = true;
        q.push([nx, ny]);
      }
    }
    return false;
  }
  let lo = grid[0][0],
    hi = 0;
  for (const row of grid) for (const v of row) hi = Math.max(hi, v);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (can(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// 方法2: Dijkstra 变形 (路径最大值最小化)
function minimizeMax2(grid: Grid): number {
  const m = grid.length,
    n = grid[0].length;
  const dist = new Array(m).fill(0).map(() => new Array(n).fill(Infinity));
  dist[0][0] = grid[0][0];
  const pq: [number, number, number][] = [[grid[0][0], 0, 0]];
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [c, x, y] = pq.shift()!;
    if (x === m - 1 && y === n - 1) return c;
    if (c > dist[x][y]) continue;
    for (const [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
      const nc = Math.max(c, grid[nx][ny]);
      if (nc < dist[nx][ny]) {
        dist[nx][ny] = nc;
        pq.push([nc, nx, ny]);
      }
    }
  }
  return dist[m - 1][n - 1];
}

// 测试
function test(): void {
  console.log(
    minimizeMax1([
      [1, 3, 1],
      [1, 5, 1],
      [4, 2, 1],
    ]),
  ); // 2
  console.log(
    minimizeMax1([
      [5, 8, 3],
      [2, 9, 7],
      [1, 4, 2],
    ]),
  ); // 5
  console.log(
    minimizeMax2([
      [1, 3, 1],
      [1, 5, 1],
      [4, 2, 1],
    ]),
  ); // 2
  console.log(
    minimizeMax2([
      [5, 8, 3],
      [2, 9, 7],
      [1, 4, 2],
    ]),
  ); // 5
}
test();

export {};
