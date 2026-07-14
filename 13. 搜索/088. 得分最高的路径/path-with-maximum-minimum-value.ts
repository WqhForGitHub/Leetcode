// ============================================================
// 088. 得分最高的路径
// ============================================================
// LeetCode 1102. Path With Maximum Minimum Value
// 从左上到右下路径的得分是路径上最小值，求最大得分。

// 方法1：二分查找 + BFS
function maximumMinimumPath(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  let left = 0;
  let right = Math.min(grid[0][0], grid[m - 1][n - 1]);
  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    if (canReach(grid, mid)) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

function canReach(grid: number[][], minVal: number): boolean {
  const m = grid.length;
  const n = grid[0].length;
  if (grid[0][0] < minVal || grid[m - 1][n - 1] < minVal) return false;
  const visited = new Array(m).fill(0).map(() => new Array(n).fill(false));
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const queue: [number, number][] = [[0, 0]];
  visited[0][0] = true;
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === m - 1 && c === n - 1) return true;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] >= minVal) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}

// 方法2：最大堆（Dijkstra 变体）
function maximumMinimumPathHeap(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const visited = new Array(m).fill(0).map(() => new Array(n).fill(false));
  // 最大堆（用数组模拟，按值降序）
  const heap: [number, number, number][] = [[grid[0][0], 0, 0]];
  visited[0][0] = true;
  let result = grid[0][0];
  while (heap.length > 0) {
    heap.sort((a, b) => b[0] - a[0]);
    const [val, r, c] = heap.shift()!;
    result = Math.min(result, val);
    if (r === m - 1 && c === n - 1) return result;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
        visited[nr][nc] = true;
        heap.push([grid[nr][nc], nr, nc]);
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 088. 得分最高的路径 =====");
console.log(
  "二分 [[5,4,5],[1,2,6],[7,4,9]]:",
  maximumMinimumPath([
    [5, 4, 5],
    [1, 2, 6],
    [7, 4, 9],
  ]),
); // 4
console.log(
  "二分 [[2,2,1,2,2,2],[1,2,2,2,1,2]]:",
  maximumMinimumPath([
    [2, 2, 1, 2, 2, 2],
    [1, 2, 2, 2, 1, 2],
  ]),
); // 2
console.log(
  "堆 [[5,4,5],[1,2,6],[7,4,9]]:",
  maximumMinimumPathHeap([
    [5, 4, 5],
    [1, 2, 6],
    [7, 4, 9],
  ]),
); // 4

export {};
