// ============================================================
// 063. 水位上升的泳池中游泳
// ============================================================
// LeetCode 778. Swim in Rising Water
// N×N 网格，grid[i][j] 表示该位置的水位高度。时间 t 时水位为 t，
// 求从 (0,0) 游到 (N-1,N-1) 的最少时间。

// 方法1：二分查找 + BFS/DFS
function swimInWater(grid: number[][]): number {
  const n = grid.length;
  let left = grid[0][0];
  let right = n * n - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canReach(grid, mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

function canReach(grid: number[][], t: number): boolean {
  const n = grid.length;
  if (grid[0][0] > t || grid[n - 1][n - 1] > t) return false;
  const visited = new Array(n).fill(0).map(() => new Array(n).fill(false));
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  const queue: [number, number][] = [[0, 0]];
  visited[0][0] = true;
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === n - 1 && c === n - 1) return true;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] <= t) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}

// 方法2：并查集
function swimInWaterUF(grid: number[][]): number {
  const n = grid.length;
  const positions = grid.flat().map((val, idx) => ({ val, r: Math.floor(idx / n), c: idx % n }));
  positions.sort((a, b) => a.val - b.val);
  const uf = new UnionFind788(n * n);
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  const seen = new Set<number>();
  for (const { val, r, c } of positions) {
    seen.add(r * n + c);
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && seen.has(nr * n + nc)) {
        uf.union(r * n + c, nr * n + nc);
      }
    }
    if (uf.find(0) === uf.find(n * n - 1)) return val;
  }
  return -1;
}

class UnionFind788 {
  parent: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x: number, y: number): void {
    const px = this.find(x);
    const py = this.find(y);
    if (px !== py) this.parent[px] = py;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 063. 水位上升的泳池中游泳 =====");
console.log("二分 [[0,2],[1,3]]:", swimInWater([[0, 2], [1, 3]])); // 3
console.log("二分 [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]:",
  swimInWater([[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]])); // 16

export {};
