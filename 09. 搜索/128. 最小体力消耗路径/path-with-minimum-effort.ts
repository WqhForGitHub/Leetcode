// ============================================================
// 128. 最小体力消耗路径
// ============================================================
// LeetCode 1631. Path With Minimum Effort
// 从左上到右下，路径中相邻格子高度差的最大值最小化。

// 方法1：二分查找 + BFS
function minimumEffortPath(heights: number[][]): number {
  const m = heights.length;
  const n = heights[0].length;
  let left = 0;
  let right = 0;
  for (const row of heights) {
    for (const val of row) {
      right = Math.max(right, val);
    }
  }
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canReach(heights, mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

function canReach(heights: number[][], maxDiff: number): boolean {
  const m = heights.length;
  const n = heights[0].length;
  const visited = new Array(m).fill(0).map(() => new Array(n).fill(false));
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  const queue: [number, number][] = [[0, 0]];
  visited[0][0] = true;
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === m - 1 && c === n - 1) return true;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
        const diff = Math.abs(heights[nr][nc] - heights[r][c]);
        if (diff <= maxDiff) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
  }
  return false;
}

// 方法2：并查集 + 排序边
function minimumEffortPathUF(heights: number[][]): number {
  const m = heights.length;
  const n = heights[0].length;
  const edges: [number, number, number][] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const idx = i * n + j;
      if (i + 1 < m) {
        edges.push([Math.abs(heights[i][j] - heights[i + 1][j]), idx, (i + 1) * n + j]);
      }
      if (j + 1 < n) {
        edges.push([Math.abs(heights[i][j] - heights[i][j + 1]), idx, i * n + j + 1]);
      }
    }
  }
  edges.sort((a, b) => a[0] - b[0]);
  const parent = Array.from({ length: m * n }, (_, i) => i);
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  for (const [diff, u, v] of edges) {
    parent[find(u)] = find(v);
    if (find(0) === find(m * n - 1)) return diff;
  }
  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 128. 最小体力消耗路径 =====");
console.log("二分 [[1,2,2],[3,8,2],[5,3,5]]:", minimumEffortPath([[1, 2, 2], [3, 8, 2], [5, 3, 5]])); // 2
console.log("二分 [[1,2,3],[3,8,4],[5,3,5]]:", minimumEffortPath([[1, 2, 3], [3, 8, 4], [5, 3, 5]])); // 1
console.log("UF [[1,2,2],[3,8,2],[5,3,5]]:", minimumEffortPathUF([[1, 2, 2], [3, 8, 2], [5, 3, 5]])); // 2

export {};
