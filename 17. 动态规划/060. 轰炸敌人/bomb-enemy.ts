// ============================================================
// 060. 轰炸敌人
// ============================================================
// LeetCode 361. Bomb Enemy
// 给定一个 2D 网格，每个格子可以是墙 'W'、敌人 'E' 或空 '0'。
// 在一个空格放炸弹，能炸死同一行同一列连续的敌人（遇墙停止），求最多能炸死多少敌人。
// 时间复杂度 O(m * n)，空间复杂度 O(m * n)

// 方法1：动态规划 - 四方向预处理（推荐）
// 预处理四个方向的连续敌人数：
//   up[i][j]: (i,j) 上方（含当前格）到墙之间的敌人数
//   down[i][j]: (i,j) 下方（含当前格）到墙之间的敌人数
//   left[i][j]: (i,j) 左方（含当前格）到墙之间的敌人数
//   right[i][j]: (i,j) 右方（含当前格）到墙之间的敌人数
// 对于每个空格，炸敌数 = up + down + left + right
// 时间复杂度 O(m * n)，空间复杂度 O(m * n)
function maxKilledEnemies(grid: string[][]): number {
  if (grid.length === 0 || grid[0].length === 0) return 0;

  const m: number = grid.length;
  const n: number = grid[0].length;

  // 四个方向的连续敌人数
  const up: number[][] = new Array(m).fill(0).map(() => new Array(n).fill(0));
  const down: number[][] = new Array(m).fill(0).map(() => new Array(n).fill(0));
  const left: number[][] = new Array(m).fill(0).map(() => new Array(n).fill(0));
  const right: number[][] = new Array(m).fill(0).map(() => new Array(n).fill(0));

  // 从上往下扫描，计算 up
  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      if (grid[i][j] === "W") {
        up[i][j] = 0;
      } else if (grid[i][j] === "E") {
        up[i][j] = (i > 0 ? up[i - 1][j] : 0) + 1;
      } else {
        up[i][j] = i > 0 ? up[i - 1][j] : 0;
      }
    }
  }

  // 从下往上扫描，计算 down
  for (let i: number = m - 1; i >= 0; i--) {
    for (let j: number = 0; j < n; j++) {
      if (grid[i][j] === "W") {
        down[i][j] = 0;
      } else if (grid[i][j] === "E") {
        down[i][j] = (i < m - 1 ? down[i + 1][j] : 0) + 1;
      } else {
        down[i][j] = i < m - 1 ? down[i + 1][j] : 0;
      }
    }
  }

  // 从左往右扫描，计算 left
  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      if (grid[i][j] === "W") {
        left[i][j] = 0;
      } else if (grid[i][j] === "E") {
        left[i][j] = (j > 0 ? left[i][j - 1] : 0) + 1;
      } else {
        left[i][j] = j > 0 ? left[i][j - 1] : 0;
      }
    }
  }

  // 从右往左扫描，计算 right
  for (let i: number = 0; i < m; i++) {
    for (let j: number = n - 1; j >= 0; j--) {
      if (grid[i][j] === "W") {
        right[i][j] = 0;
      } else if (grid[i][j] === "E") {
        right[i][j] = (j < n - 1 ? right[i][j + 1] : 0) + 1;
      } else {
        right[i][j] = j < n - 1 ? right[i][j + 1] : 0;
      }
    }
  }

  // 遍历每个空格，计算四方向敌人数之和，取最大值
  let result: number = 0;
  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      if (grid[i][j] === "0") {
        result = Math.max(result, up[i][j] + down[i][j] + left[i][j] + right[i][j]);
      }
    }
  }

  return result;
}

// 方法2：暴力扫描（可选）
// 对每个空格，向四个方向扫描直到遇墙或边界，统计敌人数量
// 时间复杂度 O(m * n * (m + n))，空间复杂度 O(1)
function maxKilledEnemies2(grid: string[][]): number {
  if (grid.length === 0 || grid[0].length === 0) return 0;

  const m: number = grid.length;
  const n: number = grid[0].length;
  let result: number = 0;

  for (let i: number = 0; i < m; i++) {
    for (let j: number = 0; j < n; j++) {
      // 只在空格处放炸弹
      if (grid[i][j] !== "0") continue;

      let count: number = 0;

      // 向上扫描
      for (let k: number = i - 1; k >= 0; k--) {
        if (grid[k][j] === "W") break;
        if (grid[k][j] === "E") count++;
      }
      // 向下扫描
      for (let k: number = i + 1; k < m; k++) {
        if (grid[k][j] === "W") break;
        if (grid[k][j] === "E") count++;
      }
      // 向左扫描
      for (let k: number = j - 1; k >= 0; k--) {
        if (grid[i][k] === "W") break;
        if (grid[i][k] === "E") count++;
      }
      // 向右扫描
      for (let k: number = j + 1; k < n; k++) {
        if (grid[i][k] === "W") break;
        if (grid[i][k] === "E") count++;
      }

      result = Math.max(result, count);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 060. 轰炸敌人 =====");
console.log(
  maxKilledEnemies([
    ["0", "E", "0", "0"],
    ["E", "0", "W", "E"],
    ["0", "E", "0", "0"],
  ]),
); // 期望结果: 3
console.log(
  maxKilledEnemies2([
    ["0", "E", "0", "0"],
    ["E", "0", "W", "E"],
    ["0", "E", "0", "0"],
  ]),
); // 期望结果: 3
console.log(maxKilledEnemies([["W"]])); // 期望结果: 0
console.log(maxKilledEnemies([["E"]])); // 期望结果: 0
console.log(maxKilledEnemies([["0", "E"]])); // 期望结果: 1

export {};
