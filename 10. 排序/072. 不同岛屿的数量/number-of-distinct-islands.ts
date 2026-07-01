// ============================================================
// 072. 不同岛屿的数量
// ============================================================
// LeetCode 694. Number of Distinct Islands
// 给定 0/1 矩阵，1 为陆地。岛屿是四连通的 1 组成的块。
// 两个岛屿形状相同当且仅当可通过平移（不旋转、不翻转）重合。
// 求不同形状岛屿的数量。
// 通过记录从起点出发的遍历路径签名（含方向与回溯标记）来唯一标识形状。

// 方法1：DFS + 路径签名（推荐，O(m*n) 时间，O(m*n) 空间用于 visited 与递归栈）
// 从每个未访问的 1 出发做 DFS，固定邻居探索顺序（下、上、右、左）。
// 每次进入一个有效格子记录方向字符，递归返回时记录回溯标记 'B'。
// 同形状岛屿从各自左上角起点出发会得到相同签名串（平移不变）。
function numDistinctIslands(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const signatures = new Set<string>();

  const dfs = (r: number, c: number, dir: string, path: string[]): void => {
    if (r < 0 || r >= m || c < 0 || c >= n) return;
    if (visited[r][c] || grid[r][c] !== 1) return;
    visited[r][c] = true;
    path.push(dir);
    dfs(r + 1, c, "D", path); // 下
    dfs(r - 1, c, "U", path); // 上
    dfs(r, c + 1, "R", path); // 右
    dfs(r, c - 1, "L", path); // 左
    path.push("B"); // 回溯标记，区分不同形状
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        const path: string[] = [];
        dfs(i, j, "S", path);
        signatures.add(path.join(""));
      }
    }
  }
  return signatures.size;
}

// 方法2：BFS + 路径签名（O(m*n) 时间，O(m*n) 空间）
// 从每个未访问的 1 出发做 BFS，固定邻居入队顺序（下、上、右、左）。
// 按出队顺序记录每个格子相对起点的坐标 (dr, dc)，组成签名串。
// 同形状岛屿从各自左上角起点出发会得到相同的相对坐标序列（平移不变）。
function numDistinctIslands_bfs(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  const signatures = new Set<string>();

  // 邻居方向：下、上、右、左（与 DFS 保持一致）
  const dirs: Array<[number, number]> = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1 && !visited[i][j]) {
        const path: string[] = [];
        const queue: Array<[number, number]> = [[i, j]];
        visited[i][j] = true;
        let head = 0;
        while (head < queue.length) {
          const [r, c] = queue[head++];
          // 记录相对起点的坐标
          path.push(`${r - i},${c - j};`);
          for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
            if (visited[nr][nc] || grid[nr][nc] !== 1) continue;
            visited[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
        signatures.add(path.join(""));
      }
    }
  }
  return signatures.size;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 072. 不同岛屿的数量 =====");
console.log("DFS 两个 2x2 方块:",
  numDistinctIslands([
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
  ])); // 期望 1
console.log("DFS L 形与横条:",
  numDistinctIslands([
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
  ])); // 期望 3
console.log("BFS 两个 2x2 方块:",
  numDistinctIslands_bfs([
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
  ])); // 期望 1
console.log("BFS L 形与横条:",
  numDistinctIslands_bfs([
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
  ])); // 期望 3

export {};
