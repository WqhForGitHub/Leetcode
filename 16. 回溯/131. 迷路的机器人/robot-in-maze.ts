// ============================================================
// 131. 迷路的机器人
// ============================================================
// 面试金典 CCI 08.02. 迷路的机器人
// 给定 r×c 网格，1 表示障碍，0 表示可通行。机器人只能向右或向下移动，
// 从左上角到右下角。返回任意一条有效路径（坐标列表），若无路径返回空数组。
// 时间复杂度：O(r*c), 空间复杂度：O(r*c)

// 方法1：DFS回溯 (推荐)
// 从起点深度优先搜索，优先向右/向下。用集合记录已访问与失败点避免重复计算。
// 时间复杂度 O(r*c), 空间复杂度 O(r*c)
function pathWithObstacles(grid: number[][]): number[][] {
  const rows: number = grid.length;
  const cols: number = grid[0].length;
  // 若起点或终点是障碍，无解
  if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) {
    return [];
  }
  const path: number[][] = [];
  // 记忆化：已确认无法到达终点的点
  const failed: Set<string> = new Set();
  // 记录路径中已访问的点
  const visited: Set<string> = new Set();

  const key = (r: number, c: number): string => `${r},${c}`;

  const dfs = (r: number, c: number): boolean => {
    // 越界或障碍
    if (r >= rows || c >= cols || grid[r][c] === 1) {
      return false;
    }
    const k: string = key(r, c);
    if (failed.has(k)) {
      return false;
    }
    if (visited.has(k)) {
      return false;
    }
    visited.add(k);
    path.push([r, c]);
    // 到达终点
    if (r === rows - 1 && c === cols - 1) {
      return true;
    }
    // 向下或向右
    if (dfs(r + 1, c) || dfs(r, c + 1)) {
      return true;
    }
    // 回溯
    path.pop();
    failed.add(k);
    return false;
  };

  return dfs(0, 0) ? path : [];
}

// 方法2：BFS+路径重建
// 广度优先搜索找到终点，通过父节点指针重建路径。
// 时间复杂度 O(r*c), 空间复杂度 O(r*c)
function pathWithObstaclesBFS(grid: number[][]): number[][] {
  const rows: number = grid.length;
  const cols: number = grid[0].length;
  if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) {
    return [];
  }
  const key = (r: number, c: number): string => `${r},${c}`;
  const visited: Set<string> = new Set();
  // 父节点映射，用于重建路径
  const parent: Map<string, string | null> = new Map();
  const queue: number[][] = [[0, 0]];
  visited.add(key(0, 0));
  parent.set(key(0, 0), null);

  const dirs: number[][] = [
    [1, 0],
    [0, 1],
  ];
  let found: boolean = false;
  while (queue.length > 0) {
    const [r, c]: number[] = queue.shift() as number[];
    if (r === rows - 1 && c === cols - 1) {
      found = true;
      break;
    }
    for (const [dr, dc] of dirs) {
      const nr: number = r + dr;
      const nc: number = c + dc;
      if (nr < rows && nc < cols && grid[nr][nc] === 0 && !visited.has(key(nr, nc))) {
        visited.add(key(nr, nc));
        parent.set(key(nr, nc), key(r, c));
        queue.push([nr, nc]);
      }
    }
  }
  if (!found) {
    return [];
  }
  // 重建路径
  const path: number[][] = [];
  let cur: string | null = key(rows - 1, cols - 1);
  while (cur !== null) {
    const [r, c]: string[] = cur.split(",");
    path.push([parseInt(r, 10), parseInt(c, 10)]);
    cur = parent.get(cur) ?? null;
  }
  path.reverse();
  return path;
}

// 方法3：DP+记忆化
// 自顶向下递归判断 (r,c) 是否能到达终点，使用记忆化避免重复。
// 时间复杂度 O(r*c), 空间复杂度 O(r*c)
function pathWithObstaclesDP(grid: number[][]): number[][] {
  const rows: number = grid.length;
  const cols: number = grid[0].length;
  if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) {
    return [];
  }
  // memo: 0=未计算, 1=可达, -1=不可达
  const memo: number[][] = [];
  for (let i: number = 0; i < rows; i++) {
    memo.push(new Array(cols).fill(0));
  }
  const path: number[][] = [];

  const canReach = (r: number, c: number): boolean => {
    if (r >= rows || c >= cols || grid[r][c] === 1) {
      return false;
    }
    if (r === rows - 1 && c === cols - 1) {
      return true;
    }
    if (memo[r][c] !== 0) {
      return memo[r][c] === 1;
    }
    const ok: boolean = canReach(r + 1, c) || canReach(r, c + 1);
    memo[r][c] = ok ? 1 : -1;
    return ok;
  };

  // 沿可达路径构造结果
  let r: number = 0;
  let c: number = 0;
  if (!canReach(0, 0)) {
    return [];
  }
  path.push([r, c]);
  while (!(r === rows - 1 && c === cols - 1)) {
    if (r + 1 < rows && canReach(r + 1, c)) {
      r = r + 1;
    } else {
      c = c + 1;
    }
    path.push([r, c]);
  }
  return path;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 131. 迷路的机器人 =====");
const grid1: number[][] = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];
console.log(pathWithObstacles(grid1));
// 期望结果: [[0,0],[0,1],[0,2],[1,2],[2,2]] (或其它有效路径)
console.log(pathWithObstaclesBFS(grid1));
console.log(pathWithObstaclesDP(grid1));
const grid2: number[][] = [
  [0, 1],
  [1, 0],
];
console.log(pathWithObstacles(grid2)); // 期望结果: []
console.log(pathWithObstaclesBFS(grid2)); // 期望结果: []
console.log(pathWithObstaclesDP(grid2)); // 期望结果: []

export {};
