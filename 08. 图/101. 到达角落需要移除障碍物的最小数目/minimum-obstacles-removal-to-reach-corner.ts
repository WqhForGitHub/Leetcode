// LC2290. 到达角落需要移除障碍物的最小数目
// 给定 m x n 网格 grid, 0 表示空, 1 表示障碍
// 从 (0, 0) 到 (m-1, n-1) 移动, 求最少需移除的障碍数
// 0-1 BFS / Dijkstra

type Grid = number[][];

// 方法1: 0-1 BFS
function minimumObstacles1(grid: Grid): number {
  const m = grid.length,
    n = grid[0].length;
  const dist: number[][] = Array.from({ length: m }, () => Array(n).fill(Infinity));
  dist[0][0] = 0;
  const dq: [number, number][] = [[0, 0]];
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  while (dq.length) {
    const [x, y] = dq.shift()!;
    for (const [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
      const w = grid[nx][ny];
      if (dist[x][y] + w < dist[nx][ny]) {
        dist[nx][ny] = dist[x][y] + w;
        if (w === 0) dq.unshift([nx, ny]);
        else dq.push([nx, ny]);
      }
    }
  }
  return dist[m - 1][n - 1];
}

// 方法2: Dijkstra 优先队列
function minimumObstacles2(grid: Grid): number {
  const m = grid.length,
    n = grid[0].length;
  const dist: number[][] = Array.from({ length: m }, () => Array(n).fill(Infinity));
  dist[0][0] = 0;
  const pq: [number, number, number][] = [[0, 0, 0]]; // cost, x, y
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
      const nc = c + grid[nx][ny];
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
    minimumObstacles1([
      [0, 1, 1],
      [1, 1, 1],
      [1, 1, 0],
    ]),
  ); // 2
  console.log(
    minimumObstacles1([
      [0, 1, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 1, 0],
    ]),
  ); // 0
  console.log(
    minimumObstacles2([
      [0, 1, 1],
      [1, 1, 1],
      [1, 1, 0],
    ]),
  ); // 2
  console.log(
    minimumObstacles2([
      [0, 1, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 1, 0],
    ]),
  ); // 0
}
test();

export {};
