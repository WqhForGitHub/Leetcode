// ============================================================
// 056. 不同路径 III
// ============================================================
// LeetCode 980. Unique Paths III
// 给定 m×n 网格：1=起点, 2=终点, -1=障碍, 0=空格。
// 求从起点到终点，且经过每个空格恰好一次的路径数量。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：DFS回溯 (推荐)
// 先统计需要走的空格数，从起点DFS，每访问一个空格标记已访问，到达终点时检查是否走完所有空格。
// 时间复杂度 O(3^(m*n)) 每格最多3个方向, 空间复杂度 O(m*n)
function uniquePathsIII(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  let startRow = 0,
    startCol = 0;
  let empty = 0; // 需要走的空格数（不含起点和终点，含0；不含障碍）
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        startRow = i;
        startCol = j;
      } else if (grid[i][j] === 0) {
        empty++;
      }
    }
  }

  let count = 0;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  const dfs = (r: number, c: number, remaining: number): void => {
    // 终点检查
    if (grid[r][c] === 2) {
      if (remaining === 0) count++;
      return;
    }
    // 标记为已访问
    grid[r][c] = -1;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (grid[nr][nc] === -1) continue;
      if (grid[nr][nc] === 2) {
        dfs(nr, nc, remaining);
      } else {
        // 空格
        dfs(nr, nc, remaining - 1);
      }
    }
    // 回溯
    grid[r][c] = 0;
  };

  dfs(startRow, startCol, empty);
  return count;
}

// 方法2：DFS+状态压缩
// 用位掩码记录已访问的格子，避免修改原grid。适合较小规模网格。
// 时间复杂度 O(2^(m*n) * m*n), 空间复杂度 O(2^(m*n))
function uniquePathsIIIBit(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  let startRow = 0,
    startCol = 0;
  // 给每个空格和终点分配位
  let _endIndex = -1;
  let startIndex = -1;
  // 先统计空格数，编号
  let total = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] !== -1) total++;
    }
  }

  // 编号映射
  const idMap = new Map<string, number>();
  let id = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] !== -1) {
        idMap.set(`${i},${j}`, id);
        if (grid[i][j] === 1) {
          startRow = i;
          startCol = j;
          startIndex = id;
        } else if (grid[i][j] === 2) {
          _endIndex = id;
        }
        id++;
      }
    }
  }

  const targetMask = (1 << total) - 1;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  const memo = new Map<string, number>();

  const dfs = (r: number, c: number, mask: number): number => {
    if (grid[r][c] === 2) {
      return mask === targetMask ? 1 : 0;
    }
    const key = `${r},${c},${mask}`;
    if (memo.has(key)) return memo.get(key)!;

    let result = 0;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (grid[nr][nc] === -1) continue;
      const nid = idMap.get(`${nr},${nc}`)!;
      if ((mask & (1 << nid)) !== 0) continue; // 已访问
      result += dfs(nr, nc, mask | (1 << nid));
    }
    memo.set(key, result);
    return result;
  };

  return dfs(startRow, startCol, 1 << startIndex!);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 056. 不同路径 III =====");
console.log(
  uniquePathsIII([
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, -1],
  ]),
); // 期望结果: 2
console.log(
  uniquePathsIII([
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 2],
  ]),
); // 期望结果: 4
console.log(
  uniquePathsIIIBit([
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, -1],
  ]),
); // 期望结果: 2
console.log(
  uniquePathsIIIBit([
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 2],
  ]),
); // 期望结果: 4

export {};
