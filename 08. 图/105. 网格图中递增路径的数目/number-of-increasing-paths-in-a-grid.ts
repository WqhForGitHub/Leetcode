// LC2328. 网格图中递增路径的数目
// m x n 网格, 上下左右严格递增, 求递增路径总数 mod 1e9+7
// 记忆化 DFS / 拓扑 DP

type Grid = number[][];

const MOD = 1e9 + 7;

// 方法1: 记忆化 DFS
function countPaths1(grid: Grid): number {
  const m = grid.length,
    n = grid[0].length;
  const memo = new Array(m).fill(0).map(() => new Array(n).fill(-1));
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  function dfs(x: number, y: number): number {
    if (memo[x][y] !== -1) return memo[x][y];
    let res = 1;
    for (const [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
      if (grid[nx][ny] > grid[x][y]) {
        res = (res + dfs(nx, ny)) % MOD;
      }
    }
    memo[x][y] = res;
    return res;
  }
  let ans = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      ans = (ans + dfs(i, j)) % MOD;
    }
  }
  return ans;
}

// 方法2: 拓扑 DP (按值排序)
function countPaths2(grid: Grid): number {
  const m = grid.length,
    n = grid[0].length;
  const dp = new Array(m).fill(0).map(() => new Array(n).fill(1));
  const cells: [number, number, number][] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      cells.push([grid[i][j], i, j]);
    }
  }
  cells.sort((a, b) => a[0] - b[0]);
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let ans = 0;
  for (const [, x, y] of cells) {
    for (const [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
      if (grid[nx][ny] < grid[x][y]) {
        dp[x][y] = (dp[x][y] + dp[nx][ny]) % MOD;
      }
    }
    ans = (ans + dp[x][y]) % MOD;
  }
  return ans;
}

// 测试
function test(): void {
  console.log(
    countPaths1([
      [1, 1],
      [3, 4],
    ]),
  ); // 8
  console.log(countPaths1([[1], [2]])); // 3
  console.log(
    countPaths2([
      [1, 1],
      [3, 4],
    ]),
  ); // 8
  console.log(countPaths2([[1], [2]])); // 3
}
test();

export {};
