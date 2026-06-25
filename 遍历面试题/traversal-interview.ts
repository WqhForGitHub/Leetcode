// ============================================================
// 遍历面试题 - TypeScript 解题合集
// 主题：岛屿数量 / 最大岛屿面积 / 被围绕的区域 / 扫雷游戏 /
//       迷宫问题 / 水壶问题 / 数独验证 / 水流问题 /
//       矩阵中的最长递增路径
// ============================================================

// ============================================================
// 1. 岛屿数量
// ============================================================
// LeetCode 200. Number of Islands
// 给定一个由 '1'（陆地）和 '0'（水）组成的二维网格，计算岛屿的数量
// 岛屿由相邻的陆地连接而成（上下左右），被水包围
// 时间复杂度：O(m * n)，空间复杂度：O(m * n)

// 方法1：DFS 染色（推荐）
function numIslands(grid: string[][]): number {
  if (grid.length === 0) return 0;
  const m = grid.length;
  const n = grid[0].length;
  let count = 0;

  const dfs = (i: number, j: number): void => {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== '1') return;
    grid[i][j] = '2'; // 标记为已访问
    dfs(i + 1, j); // 下
    dfs(i - 1, j); // 上
    dfs(i, j + 1); // 右
    dfs(i, j - 1); // 左
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
      }
    }
  }
  return count;
}

// 方法2：BFS
function numIslandsBFS(grid: string[][]): number {
  if (grid.length === 0) return 0;
  const m = grid.length;
  const n = grid[0].length;
  let count = 0;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        count++;
        grid[i][j] = '2';
        const queue: [number, number][] = [[i, j]];
        while (queue.length > 0) {
          const [x, y] = queue.shift()!;
          for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === '1') {
              grid[nx][ny] = '2';
              queue.push([nx, ny]);
            }
          }
        }
      }
    }
  }
  return count;
}

// 方法3：并查集
class UnionFindIslands {
  parent: number[];
  rank: number[];
  count: number;

  constructor(n: number) {
    this.parent = new Array(n).fill(0).map((_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = 0;
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // 路径压缩
    }
    return this.parent[x];
  }

  union(x: number, y: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX !== rootY) {
      // 按秩合并
      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
      }
      this.count--;
    }
  }

  setCount(count: number): void {
    this.count = count;
  }

  getCount(): number {
    return this.count;
  }
}

function numIslandsUF(grid: string[][]): number {
  if (grid.length === 0) return 0;
  const m = grid.length;
  const n = grid[0].length;
  const uf = new UnionFindIslands(m * n);
  let landCount = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        landCount++;
      }
    }
  }
  uf.setCount(landCount);

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        // 只向右和向下合并，避免重复
        if (i + 1 < m && grid[i + 1][j] === '1') {
          uf.union(i * n + j, (i + 1) * n + j);
        }
        if (j + 1 < n && grid[i][j + 1] === '1') {
          uf.union(i * n + j, i * n + j + 1);
        }
      }
    }
  }
  return uf.getCount();
}

// ============================================================
// 2. 最大岛屿面积
// ============================================================
// LeetCode 695. Max Area of Island
// 给定一个由 0 和 1 组成的矩阵，找到最大的岛屿面积（相连的 1 的个数）
// 时间复杂度：O(m * n)，空间复杂度：O(m * n)

// 方法1：DFS 递归（推荐）
function maxAreaOfIsland(grid: number[][]): number {
  if (grid.length === 0) return 0;
  const m = grid.length;
  const n = grid[0].length;
  let maxArea = 0;

  const dfs = (i: number, j: number): number => {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== 1) return 0;
    grid[i][j] = 0; // 标记已访问
    return 1 + dfs(i + 1, j) + dfs(i - 1, j) + dfs(i, j + 1) + dfs(i, j - 1);
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        maxArea = Math.max(maxArea, dfs(i, j));
      }
    }
  }
  return maxArea;
}

// 方法2：BFS
function maxAreaOfIslandBFS(grid: number[][]): number {
  if (grid.length === 0) return 0;
  const m = grid.length;
  const n = grid[0].length;
  let maxArea = 0;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        let area = 0;
        grid[i][j] = 0;
        const queue: [number, number][] = [[i, j]];
        while (queue.length > 0) {
          const [x, y] = queue.shift()!;
          area++;
          for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === 1) {
              grid[nx][ny] = 0;
              queue.push([nx, ny]);
            }
          }
        }
        maxArea = Math.max(maxArea, area);
      }
    }
  }
  return maxArea;
}

// 方法3：DFS 迭代（显式栈）
function maxAreaOfIslandIterative(grid: number[][]): number {
  if (grid.length === 0) return 0;
  const m = grid.length;
  const n = grid[0].length;
  let maxArea = 0;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        let area = 0;
        const stack: [number, number][] = [[i, j]];
        grid[i][j] = 0;
        while (stack.length > 0) {
          const [x, y] = stack.pop()!;
          area++;
          for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === 1) {
              grid[nx][ny] = 0;
              stack.push([nx, ny]);
            }
          }
        }
        maxArea = Math.max(maxArea, area);
      }
    }
  }
  return maxArea;
}

// ============================================================
// 3. 被围绕的区域
// ============================================================
// LeetCode 130. Surrounded Regions
// 给定一个由 'X' 和 'O' 组成的矩阵，将所有被 'X' 围绕的 'O' 替换为 'X'
// 边界上的 'O' 以及与边界 'O' 相连的 'O' 不被替换
// 时间复杂度：O(m * n)，空间复杂度：O(m * n)

// 方法1：DFS 从边界出发（推荐）
function solveSurroundedRegions(board: string[][]): void {
  if (board.length === 0) return;
  const m = board.length;
  const n = board[0].length;

  const dfs = (i: number, j: number): void => {
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== 'O') return;
    board[i][j] = 'A'; // 标记为与边界相连的 'O'
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };

  // 从边界上的 'O' 开始 DFS
  for (let i = 0; i < m; i++) {
    dfs(i, 0);      // 左边界
    dfs(i, n - 1);  // 右边界
  }
  for (let j = 0; j < n; j++) {
    dfs(0, j);      // 上边界
    dfs(m - 1, j);  // 下边界
  }

  // 遍历整个矩阵，还原标记
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 'A') {
        board[i][j] = 'O'; // 与边界相连，保持 'O'
      } else if (board[i][j] === 'O') {
        board[i][j] = 'X'; // 被围绕，替换为 'X'
      }
    }
  }
}

// 方法2：BFS 从边界出发
function solveSurroundedRegionsBFS(board: string[][]): void {
  if (board.length === 0) return;
  const m = board.length;
  const n = board[0].length;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  const queue: [number, number][] = [];

  // 将边界上的 'O' 加入队列
  for (let i = 0; i < m; i++) {
    if (board[i][0] === 'O') { board[i][0] = 'A'; queue.push([i, 0]); }
    if (board[i][n - 1] === 'O') { board[i][n - 1] = 'A'; queue.push([i, n - 1]); }
  }
  for (let j = 0; j < n; j++) {
    if (board[0][j] === 'O') { board[0][j] = 'A'; queue.push([0, j]); }
    if (board[m - 1][j] === 'O') { board[m - 1][j] = 'A'; queue.push([m - 1, j]); }
  }

  // BFS 扩展
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < m && ny >= 0 && ny < n && board[nx][ny] === 'O') {
        board[nx][ny] = 'A';
        queue.push([nx, ny]);
      }
    }
  }

  // 还原
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 'A') {
        board[i][j] = 'O';
      } else if (board[i][j] === 'O') {
        board[i][j] = 'X';
      }
    }
  }
}

// 方法3：并查集
function solveSurroundedRegionsUF(board: string[][]): void {
  if (board.length === 0) return;
  const m = board.length;
  const n = board[0].length;
  const dummy = m * n; // 虚拟节点，代表边界
  const uf = new UnionFindIslands(m * n + 1);
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  // 边界上的 'O' 与虚拟节点合并
  for (let i = 0; i < m; i++) {
    if (board[i][0] === 'O') uf.union(i * n, dummy);
    if (board[i][n - 1] === 'O') uf.union(i * n + n - 1, dummy);
  }
  for (let j = 0; j < n; j++) {
    if (board[0][j] === 'O') uf.union(j, dummy);
    if (board[m - 1][j] === 'O') uf.union((m - 1) * n + j, dummy);
  }

  // 内部的 'O' 与相邻的 'O' 合并
  for (let i = 1; i < m - 1; i++) {
    for (let j = 1; j < n - 1; j++) {
      if (board[i][j] === 'O') {
        for (const [dx, dy] of dirs) {
          const nx = i + dx;
          const ny = j + dy;
          if (nx >= 0 && nx < m && ny >= 0 && ny < n && board[nx][ny] === 'O') {
            uf.union(i * n + j, nx * n + ny);
          }
        }
      }
    }
  }

  // 不与虚拟节点相连的 'O' 替换为 'X'
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 'O' && uf.find(i * n + j) !== uf.find(dummy)) {
        board[i][j] = 'X';
      }
    }
  }
}

// ============================================================
// 4. 扫雷游戏
// ============================================================
// LeetCode 529. Minesweeper
// 给定一个扫雷游戏面板，根据点击位置揭示格子
// 规则：
//   - 点到地雷 'M'，变为 'X'，游戏结束
//   - 点到空白 'E'，若周围有地雷则显示地雷数，否则递归揭示相邻空白
// 时间复杂度：O(m * n)，空间复杂度：O(m * n)

// 方法1：DFS 递归（推荐）
function updateBoard(board: string[][], click: number[]): string[][] {
  const [row, col] = click;
  const m = board.length;
  const n = board[0].length;
  const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

  // 点到地雷
  if (board[row][col] === 'M') {
    board[row][col] = 'X';
    return board;
  }

  const countMines = (r: number, c: number): number => {
    let count = 0;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] === 'M') {
        count++;
      }
    }
    return count;
  };

  const dfs = (r: number, c: number): void => {
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== 'E') return;
    const mines = countMines(r, c);
    if (mines > 0) {
      board[r][c] = String(mines); // 周围有地雷，显示数字
    } else {
      board[r][c] = 'B'; // 周围无地雷，标记为空白
      for (const [dr, dc] of dirs) {
        dfs(r + dr, c + dc); // 递归揭示相邻格子
      }
    }
  };

  dfs(row, col);
  return board;
}

// 方法2：BFS
function updateBoardBFS(board: string[][], click: number[]): string[][] {
  const [row, col] = click;
  const m = board.length;
  const n = board[0].length;
  const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

  if (board[row][col] === 'M') {
    board[row][col] = 'X';
    return board;
  }

  const countMines = (r: number, c: number): number => {
    let count = 0;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] === 'M') count++;
    }
    return count;
  };

  const queue: [number, number][] = [[row, col]];
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (board[r][c] !== 'E') continue;
    const mines = countMines(r, c);
    if (mines > 0) {
      board[r][c] = String(mines);
    } else {
      board[r][c] = 'B';
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] === 'E') {
          queue.push([nr, nc]);
        }
      }
    }
  }
  return board;
}

// ============================================================
// 5. 迷宫问题
// ============================================================
// LeetCode 490. The Maze / LeetCode 505. The Maze II
// 给定一个迷宫（0 为空地，1 为墙壁），球会沿一个方向一直滚直到撞墙
// 判断球是否能从起点滚到终点 / 找到最短路径
// 时间复杂度：O(m * n)，空间复杂度：O(m * n)

// 方法1：DFS 判断是否可达（推荐）
function hasPathMaze(
  maze: number[][],
  start: number[],
  destination: number[]
): boolean {
  const m = maze.length;
  const n = maze[0].length;
  const visited = new Array(m).fill(0).map(() => new Array(n).fill(false));
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  const dfs = (x: number, y: number): boolean => {
    if (x === destination[0] && y === destination[1]) return true;
    if (visited[x][y]) return false;
    visited[x][y] = true;

    for (const [dx, dy] of dirs) {
      let nx = x + dx;
      let ny = y + dy;
      // 沿当前方向一直滚，直到撞墙或出界
      while (nx >= 0 && nx < m && ny >= 0 && ny < n && maze[nx][ny] === 0) {
        nx += dx;
        ny += dy;
      }
      // 回退一步到合法位置（撞墙前的最后一个空地）
      nx -= dx;
      ny -= dy;
      if (dfs(nx, ny)) return true;
    }
    return false;
  };

  return dfs(start[0], start[1]);
}

// 方法2：BFS 判断是否可达
function hasPathMazeBFS(
  maze: number[][],
  start: number[],
  destination: number[]
): boolean {
  const m = maze.length;
  const n = maze[0].length;
  const visited = new Array(m).fill(0).map(() => new Array(n).fill(false));
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  const queue: [number, number][] = [[start[0], start[1]]];
  visited[start[0]][start[1]] = true;

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    if (x === destination[0] && y === destination[1]) return true;

    for (const [dx, dy] of dirs) {
      let nx = x + dx;
      let ny = y + dy;
      while (nx >= 0 && nx < m && ny >= 0 && ny < n && maze[nx][ny] === 0) {
        nx += dx;
        ny += dy;
      }
      nx -= dx;
      ny -= dy;
      if (!visited[nx][ny]) {
        visited[nx][ny] = true;
        queue.push([nx, ny]);
      }
    }
  }
  return false;
}

// 方法3：BFS 求最短路径长度
function shortestDistanceMaze(
  maze: number[][],
  start: number[],
  destination: number[]
): number {
  const m = maze.length;
  const n = maze[0].length;
  const dist = new Array(m).fill(0).map(() => new Array(n).fill(Infinity));
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  dist[start[0]][start[1]] = 0;

  const queue: [number, number][] = [[start[0], start[1]]];

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    for (const [dx, dy] of dirs) {
      let nx = x + dx;
      let ny = y + dy;
      let steps = 0;
      while (nx >= 0 && nx < m && ny >= 0 && ny < n && maze[nx][ny] === 0) {
        nx += dx;
        ny += dy;
        steps++;
      }
      nx -= dx;
      ny -= dy;
      const newDist = dist[x][y] + steps;
      if (newDist < dist[nx][ny]) {
        dist[nx][ny] = newDist;
        queue.push([nx, ny]);
      }
    }
  }

  return dist[destination[0]][destination[1]] === Infinity
    ? -1
    : dist[destination[0]][destination[1]];
}

// ============================================================
// 6. 水壶问题
// ============================================================
// LeetCode 365. Water and Jug Problem
// 有两个容量分别为 x 和 y 的水壶，判断能否用它们准确量出 z 升水
// 操作：装满、倒空、互相倒水
// 数学原理：贝祖定理 — z 是 x 和 y 的最大公约数的倍数，且 z <= x + y
// 时间复杂度：O(log(min(x, y)))，空间复杂度：O(1)

// 方法1：数学 — 贝祖定理（推荐）
function canMeasureWater(jug1Capacity: number, jug2Capacity: number, targetCapacity: number): boolean {
  if (targetCapacity > jug1Capacity + jug2Capacity) return false;
  if (targetCapacity === 0) return true;

  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  return targetCapacity % gcd(jug1Capacity, jug2Capacity) === 0;
}

// 方法2：BFS 模拟倒水过程
function canMeasureWaterBFS(jug1Capacity: number, jug2Capacity: number, targetCapacity: number): boolean {
  if (targetCapacity > jug1Capacity + jug2Capacity) return false;

  const visited = new Set<string>();
  const queue: [number, number][] = [[0, 0]];
  visited.add('0,0');

  while (queue.length > 0) {
    const [a, b] = queue.shift()!;
    if (a === targetCapacity || b === targetCapacity || a + b === targetCapacity) {
      return true;
    }

    // 所有可能的状态转移
    const states: [number, number][] = [
      [jug1Capacity, b],              // 装满壶1
      [a, jug2Capacity],              // 装满壶2
      [0, b],                         // 倒空壶1
      [a, 0],                         // 倒空壶2
      [a - Math.min(a, jug2Capacity - b), b + Math.min(a, jug2Capacity - b)], // 壶1倒入壶2
      [a + Math.min(b, jug1Capacity - a), b - Math.min(b, jug1Capacity - a)], // 壶2倒入壶1
    ];

    for (const [na, nb] of states) {
      const key = `${na},${nb}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([na, nb]);
      }
    }
  }
  return false;
}

// 方法3：DFS 模拟
function canMeasureWaterDFS(jug1Capacity: number, jug2Capacity: number, targetCapacity: number): boolean {
  if (targetCapacity > jug1Capacity + jug2Capacity) return false;

  const visited = new Set<string>();

  const dfs = (a: number, b: number): boolean => {
    if (a === targetCapacity || b === targetCapacity || a + b === targetCapacity) {
      return true;
    }
    const key = `${a},${b}`;
    if (visited.has(key)) return false;
    visited.add(key);

    // 装满
    if (dfs(jug1Capacity, b)) return true;
    if (dfs(a, jug2Capacity)) return true;
    // 倒空
    if (dfs(0, b)) return true;
    if (dfs(a, 0)) return true;
    // 互倒
    const pour1to2 = Math.min(a, jug2Capacity - b);
    if (dfs(a - pour1to2, b + pour1to2)) return true;
    const pour2to1 = Math.min(b, jug1Capacity - a);
    if (dfs(a + pour2to1, b - pour2to1)) return true;

    return false;
  };

  return dfs(0, 0);
}

// ============================================================
// 7. 数独验证
// ============================================================
// LeetCode 36. Valid Sudoku
// 判断一个 9x9 的数独是否有效（只验证已填数字是否违反规则）
// 规则：每行、每列、每个 3x3 宫格内的数字 1-9 不能重复
// 时间复杂度：O(9^2)，空间复杂度：O(9^2)

// 方法1：三次遍历（推荐 — 最清晰）
function isValidSudoku(board: string[][]): boolean {
  const n = 9;

  // 检查每一行
  for (let i = 0; i < n; i++) {
    const seen = new Set<string>();
    for (let j = 0; j < n; j++) {
      if (board[i][j] !== '.') {
        if (seen.has(board[i][j])) return false;
        seen.add(board[i][j]);
      }
    }
  }

  // 检查每一列
  for (let j = 0; j < n; j++) {
    const seen = new Set<string>();
    for (let i = 0; i < n; i++) {
      if (board[i][j] !== '.') {
        if (seen.has(board[i][j])) return false;
        seen.add(board[i][j]);
      }
    }
  }

  // 检查每个 3x3 宫格
  for (let box = 0; box < n; box++) {
    const seen = new Set<string>();
    const startRow = Math.floor(box / 3) * 3;
    const startCol = (box % 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] !== '.') {
          if (seen.has(board[i][j])) return false;
          seen.add(board[i][j]);
        }
      }
    }
  }
  return true;
}

// 方法2：一次遍历（使用 Set 编码）
function isValidSudokuOnePass(board: string[][]): boolean {
  const seen = new Set<string>();

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== '.') {
        const num = board[i][j];
        const rowKey = `${num}r${i}`;   // 行标记
        const colKey = `${num}c${j}`;   // 列标记
        const boxKey = `${num}b${Math.floor(i / 3)}${Math.floor(j / 3)}`; // 宫格标记
        if (seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey)) {
          return false;
        }
        seen.add(rowKey);
        seen.add(colKey);
        seen.add(boxKey);
      }
    }
  }
  return true;
}

// 方法3：使用数组代替 Set（最快）
function isValidSudokuArray(board: string[][]): boolean {
  const rows = new Array(9).fill(0).map(() => new Array(9).fill(false));
  const cols = new Array(9).fill(0).map(() => new Array(9).fill(false));
  const boxes = new Array(9).fill(0).map(() => new Array(9).fill(false));

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== '.') {
        const num = parseInt(board[i][j]) - 1;
        const boxIdx = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        if (rows[i][num] || cols[j][num] || boxes[boxIdx][num]) {
          return false;
        }
        rows[i][num] = true;
        cols[j][num] = true;
        boxes[boxIdx][num] = true;
      }
    }
  }
  return true;
}

// ============================================================
// 8. 水流问题
// ============================================================
// LeetCode 417. Pacific Atlantic Water Flow
// 给定一个 m x n 的矩阵表示地形高度，水只能从高处流向低处或等高处
// 左边界和上边界邻接太平洋，右边界和下边界邻接大西洋
// 找出可以同时流向两个洋的坐标
// 时间复杂度：O(m * n)，空间复杂度：O(m * n)

// 方法1：DFS 从两个洋的边界逆向搜索（推荐）
function pacificAtlantic(heights: number[][]): number[][] {
  if (heights.length === 0) return [];
  const m = heights.length;
  const n = heights[0].length;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  const pacific = new Array(m).fill(0).map(() => new Array(n).fill(false));
  const atlantic = new Array(m).fill(0).map(() => new Array(n).fill(false));

  const dfs = (i: number, j: number, visited: boolean[][]): void => {
    visited[i][j] = true;
    for (const [dx, dy] of dirs) {
      const ni = i + dx;
      const nj = j + dy;
      // 水从高处流向低处 → 逆向搜索：从低处向高处走
      if (ni >= 0 && ni < m && nj >= 0 && nj < n
        && !visited[ni][nj] && heights[ni][nj] >= heights[i][j]) {
        dfs(ni, nj, visited);
      }
    }
  };

  // 从太平洋边界（左 + 上）出发
  for (let i = 0; i < m; i++) dfs(i, 0, pacific);
  for (let j = 0; j < n; j++) dfs(0, j, pacific);

  // 从大西洋边界（右 + 下）出发
  for (let i = 0; i < m; i++) dfs(i, n - 1, atlantic);
  for (let j = 0; j < n; j++) dfs(m - 1, j, atlantic);

  // 找两个洋都能到达的坐标
  const result: number[][] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (pacific[i][j] && atlantic[i][j]) {
        result.push([i, j]);
      }
    }
  }
  return result;
}

// 方法2：BFS 逆向搜索
function pacificAtlanticBFS(heights: number[][]): number[][] {
  if (heights.length === 0) return [];
  const m = heights.length;
  const n = heights[0].length;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  const bfs = (starts: [number, number][]): boolean[][] => {
    const visited = new Array(m).fill(0).map(() => new Array(n).fill(false));
    const queue: [number, number][] = [...starts];
    for (const [i, j] of starts) visited[i][j] = true;

    while (queue.length > 0) {
      const [i, j] = queue.shift()!;
      for (const [dx, dy] of dirs) {
        const ni = i + dx;
        const nj = j + dy;
        if (ni >= 0 && ni < m && nj >= 0 && nj < n
          && !visited[ni][nj] && heights[ni][nj] >= heights[i][j]) {
          visited[ni][nj] = true;
          queue.push([ni, nj]);
        }
      }
    }
    return visited;
  };

  // 太平洋起点
  const pacificStarts: [number, number][] = [];
  for (let i = 0; i < m; i++) pacificStarts.push([i, 0]);
  for (let j = 0; j < n; j++) pacificStarts.push([0, j]);

  // 大西洋起点
  const atlanticStarts: [number, number][] = [];
  for (let i = 0; i < m; i++) atlanticStarts.push([i, n - 1]);
  for (let j = 0; j < n; j++) atlanticStarts.push([m - 1, j]);

  const pacific = bfs(pacificStarts);
  const atlantic = bfs(atlanticStarts);

  const result: number[][] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (pacific[i][j] && atlantic[i][j]) {
        result.push([i, j]);
      }
    }
  }
  return result;
}

// ============================================================
// 9. 矩阵中的最长递增路径
// ============================================================
// LeetCode 329. Longest Increasing Path in a Matrix
// 给定一个 m x n 的整数矩阵，找出最长递增路径的长度
// 每一步可以上下左右移动，且目标格子值必须严格大于当前格子
// 时间复杂度：O(m * n)，空间复杂度：O(m * n)

// 方法1：DFS + 记忆化（推荐）
function longestIncreasingPath(matrix: number[][]): number {
  if (matrix.length === 0) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  const memo = new Array(m).fill(0).map(() => new Array(n).fill(0));
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  const dfs = (i: number, j: number): number => {
    if (memo[i][j] !== 0) return memo[i][j]; // 已计算过，直接返回
    let maxLen = 1;
    for (const [dx, dy] of dirs) {
      const ni = i + dx;
      const nj = j + dy;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
        maxLen = Math.max(maxLen, 1 + dfs(ni, nj));
      }
    }
    memo[i][j] = maxLen;
    return maxLen;
  };

  let result = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      result = Math.max(result, dfs(i, j));
    }
  }
  return result;
}

// 方法2：拓扑排序（BFS + 出度）
function longestIncreasingPathTopological(matrix: number[][]): number {
  if (matrix.length === 0) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  // 计算每个格子的出度（能走到多少个更大的邻居）
  const outDegree = new Array(m).fill(0).map(() => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (const [dx, dy] of dirs) {
        const ni = i + dx;
        const nj = j + dy;
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
          outDegree[i][j]++;
        }
      }
    }
  }

  // 出度为 0 的格子入队（路径的终点，局部最大值）
  const queue: [number, number][] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (outDegree[i][j] === 0) queue.push([i, j]);
    }
  }

  let level = 0;
  while (queue.length > 0) {
    const size = queue.length;
    level++;
    for (let k = 0; k < size; k++) {
      const [i, j] = queue.shift()!;
      for (const [dx, dy] of dirs) {
        const ni = i + dx;
        const nj = j + dy;
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] < matrix[i][j]) {
          outDegree[ni][nj]--;
          if (outDegree[ni][nj] === 0) {
            queue.push([ni, nj]);
          }
        }
      }
    }
  }
  return level;
}

// 方法3：排序 + 动态规划
function longestIncreasingPathDP(matrix: number[][]): number {
  if (matrix.length === 0) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  const dp = new Array(m).fill(0).map(() => new Array(n).fill(1));

  // 按值从小到大排序所有格子的坐标
  const cells: [number, number, number][] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      cells.push([matrix[i][j], i, j]);
    }
  }
  cells.sort((a, b) => a[0] - b[0]);

  let result = 1;
  for (const [val, i, j] of cells) {
    for (const [dx, dy] of dirs) {
      const ni = i + dx;
      const nj = j + dy;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] < val) {
        dp[i][j] = Math.max(dp[i][j], dp[ni][nj] + 1);
      }
    }
    result = Math.max(result, dp[i][j]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 岛屿数量 =====");
const islandsGrid1 = [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1'],
];
console.log("DFS:", numIslands(islandsGrid1.map(row => [...row]))); // 3

const islandsGrid2 = [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1'],
];
console.log("BFS:", numIslandsBFS(islandsGrid2.map(row => [...row]))); // 3

const islandsGrid3 = [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1'],
];
console.log("并查集:", numIslandsUF(islandsGrid3.map(row => [...row]))); // 3

console.log("\n===== 2. 最大岛屿面积 =====");
const areaGrid1 = [
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
];
console.log("DFS:", maxAreaOfIsland(areaGrid1.map(row => [...row]))); // 5

const areaGrid2 = [
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
];
console.log("BFS:", maxAreaOfIslandBFS(areaGrid2.map(row => [...row]))); // 5

console.log("\n===== 3. 被围绕的区域 =====");
const surroundBoard1 = [
  ['X', 'X', 'X', 'X'],
  ['X', 'O', 'O', 'X'],
  ['X', 'X', 'O', 'X'],
  ['X', 'O', 'X', 'X'],
];
const b1 = surroundBoard1.map(row => [...row]);
solveSurroundedRegions(b1);
console.log("DFS:", b1);
// [['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']]

const surroundBoard2 = [
  ['X', 'X', 'X', 'X'],
  ['X', 'O', 'O', 'X'],
  ['X', 'X', 'O', 'X'],
  ['X', 'O', 'X', 'X'],
];
const b2 = surroundBoard2.map(row => [...row]);
solveSurroundedRegionsBFS(b2);
console.log("BFS:", b2);

console.log("\n===== 4. 扫雷游戏 =====");
const mineBoard1 = [
  ['E', 'E', 'E', 'E', 'E'],
  ['E', 'E', 'M', 'E', 'E'],
  ['E', 'E', 'E', 'E', 'E'],
  ['E', 'E', 'E', 'E', 'E'],
];
console.log("DFS:", updateBoard(mineBoard1.map(row => [...row]), [3, 0]));

const mineBoard2 = [
  ['E', 'E', 'E', 'E', 'E'],
  ['E', 'E', 'M', 'E', 'E'],
  ['E', 'E', 'E', 'E', 'E'],
  ['E', 'E', 'E', 'E', 'E'],
];
console.log("BFS:", updateBoardBFS(mineBoard2.map(row => [...row]), [3, 0]));

console.log("\n===== 5. 迷宫问题 =====");
const maze1 = [
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0],
  [1, 1, 0, 1, 1],
  [0, 0, 0, 0, 0],
];
console.log("DFS 可达:", hasPathMaze(maze1, [0, 4], [4, 4])); // true
console.log("BFS 可达:", hasPathMazeBFS(maze1, [0, 4], [4, 4])); // true
console.log("BFS 最短距离:", shortestDistanceMaze(maze1, [0, 4], [4, 4])); // 12

console.log("\n===== 6. 水壶问题 =====");
console.log("数学(3,5,4):", canMeasureWater(3, 5, 4));   // true
console.log("数学(2,6,5):", canMeasureWater(2, 6, 5));   // false
console.log("BFS(3,5,4):", canMeasureWaterBFS(3, 5, 4)); // true
console.log("DFS(3,5,4):", canMeasureWaterDFS(3, 5, 4)); // true

console.log("\n===== 7. 数独验证 =====");
const sudoku1 = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];
console.log("三次遍历:", isValidSudoku(sudoku1.map(row => [...row])));   // true
console.log("一次遍历:", isValidSudokuOnePass(sudoku1.map(row => [...row]))); // true
console.log("数组法:", isValidSudokuArray(sudoku1.map(row => [...row])));     // true

const sudoku2 = [
  ['8', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];
console.log("无效数独:", isValidSudoku(sudoku2.map(row => [...row]))); // false

console.log("\n===== 8. 水流问题 =====");
const heights1 = [
  [1, 2, 2, 3, 5],
  [3, 2, 3, 4, 4],
  [2, 4, 5, 3, 1],
  [6, 7, 1, 4, 5],
  [5, 1, 1, 2, 4],
];
console.log("DFS:", pacificAtlantic(heights1.map(row => [...row])));
// [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
console.log("BFS:", pacificAtlanticBFS(heights1.map(row => [...row])));

console.log("\n===== 9. 矩阵中的最长递增路径 =====");
const pathMatrix1 = [
  [9, 9, 4],
  [6, 6, 8],
  [2, 1, 1],
];
console.log("DFS+记忆化:", longestIncreasingPath(pathMatrix1.map(row => [...row]))); // 4

const pathMatrix2 = [
  [3, 4, 5],
  [3, 2, 6],
  [2, 2, 1],
];
console.log("拓扑排序:", longestIncreasingPathTopological(pathMatrix2.map(row => [...row]))); // 4

const pathMatrix3 = [
  [1, 2, 3],
  [6, 5, 4],
  [7, 8, 9],
];
console.log("排序+DP:", longestIncreasingPathDP(pathMatrix3.map(row => [...row]))); // 9

export {};
