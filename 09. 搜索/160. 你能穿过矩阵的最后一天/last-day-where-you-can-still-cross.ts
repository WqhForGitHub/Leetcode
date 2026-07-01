// ============================================================
// 160. 你能穿过矩阵的最后一天
// ============================================================
// LeetCode 1970. Last Day Where You Can Still Cross
// 矩阵顶部到底部，每天一个格子变水，求还能从顶部走到底部的最后一天。

// 方法1：二分查找 + BFS
function latestDayToCross(row: number, col: number, cells: number[][]): number {
  let left = 1;
  let right = cells.length;
  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    if (canCross(row, col, cells, mid)) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

function canCross(row: number, col: number, cells: number[][], day: number): boolean {
  // 构建第 day 天的网格
  const grid = new Array(row).fill(0).map(() => new Array(col).fill(0));
  for (let i = 0; i < day; i++) {
    grid[cells[i][0] - 1][cells[i][1] - 1] = 1; // 水为1
  }
  // BFS 从顶部到底部
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  const queue: [number, number][] = [];
  for (let j = 0; j < col; j++) {
    if (grid[0][j] === 0) {
      queue.push([0, j]);
      grid[0][j] = 1; // 标记已访问
    }
  }
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === row - 1) return true;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < row && nc >= 0 && nc < col && grid[nr][nc] === 0) {
        grid[nr][nc] = 1;
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}

// 方法2：并查集（反向处理）
function latestDayToCrossUF(row: number, col: number, cells: number[][]): number {
  const n = row * col;
  const parent = new Array(n + 2).fill(0).map((_, i) => i);
  const top = n; // 虚拟顶部节点
  const bottom = n + 1; // 虚拟底部节点
  const water = new Set<number>();
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): void {
    parent[find(x)] = find(y);
  }

  for (let day = cells.length - 1; day >= 0; day--) {
    const r = cells[day][0] - 1;
    const c = cells[day][1] - 1;
    const idx = r * col + c;
    water.add(idx);
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < row && nc >= 0 && nc < col) {
        const nidx = nr * col + nc;
        if (water.has(nidx)) {
          union(idx, nidx);
        }
      }
    }
    if (r === 0) union(idx, top);
    if (r === row - 1) union(idx, bottom);
    if (find(top) === find(bottom)) return day;
  }
  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 160. 你能穿过矩阵的最后一天 =====");
console.log("BFS 2,2,[[1,1],[2,1],[1,2],[2,2]]:", latestDayToCross(2, 2, [[1, 1], [2, 1], [1, 2], [2, 2]])); // 2
console.log("BFS 3,3,[[1,2],[2,1],[3,3],[2,2],[1,1],[1,3],[2,3],[3,2],[3,1]]:",
  latestDayToCross(3, 3, [[1, 2], [2, 1], [3, 3], [2, 2], [1, 1], [1, 3], [2, 3], [3, 2], [3, 1]])); // 3
console.log("UF 2,2,[[1,1],[2,1],[1,2],[2,2]]:", latestDayToCrossUF(2, 2, [[1, 1], [2, 1], [1, 2], [2, 2]])); // 2

export {};
