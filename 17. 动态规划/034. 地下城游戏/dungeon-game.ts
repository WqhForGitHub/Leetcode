// ============================================================
// 034. 地下城游戏
// ============================================================
// LeetCode 174. Dungeon Game
// 给定地下城矩阵，从左上到右下，每个房间加血或扣血，求初始最少血量
// 时间复杂度 O(mn)

// 方法1：动态规划-逆向（推荐）
// dp[i][j] 表示从(i,j)到终点所需的最少初始血量
// 状态转移：dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])
// 时间复杂度 O(mn)，空间复杂度 O(mn)
function calculateMinimumHP(dungeon: number[][]): number {
  const m: number = dungeon.length;
  const n: number = dungeon[0].length;
  // dp[i][j] 表示从(i,j)到公主处需要的最少血量
  // 多加一行一列作为边界，初始化为无穷大
  const dp: number[][] = Array.from({ length: m + 1 }, (): number[] =>
    new Array<number>(n + 1).fill(Infinity),
  );
  // 终点右侧和下方的边界设为1（到达公主后至少需要1血）
  dp[m][n - 1] = 1;
  dp[m - 1][n] = 1;

  // 从右下向左上递推
  for (let i: number = m - 1; i >= 0; i--) {
    for (let j: number = n - 1; j >= 0; j--) {
      // 需要的最少血量 = 下方/右方所需血量 - 当前房间影响
      // 如果房间加血，所需血量减少；如果扣血，所需血量增加
      const minNeeded: number = Math.min(dp[i + 1][j], dp[i][j + 1]) - dungeon[i][j];
      // 至少需要1血（不能死）
      dp[i][j] = Math.max(1, minNeeded);
    }
  }
  return dp[0][0];
}

// 方法2：动态规划-空间优化为一维
// 将dp[i][j]压缩为一维数组dp[j]
// dp[j] 在更新前保存上一行（下方）的值，更新后保存当前行的值
// 时间复杂度 O(mn)，空间复杂度 O(n)
function calculateMinimumHPOptimized(dungeon: number[][]): number {
  const m: number = dungeon.length;
  const n: number = dungeon[0].length;
  const dp: number[] = new Array<number>(n + 1).fill(Infinity);
  // dp[n-1] = 1 作为终点正下方的边界值
  dp[n - 1] = 1;

  for (let i: number = m - 1; i >= 0; i--) {
    for (let j: number = n - 1; j >= 0; j--) {
      // dp[j+1] 是右方（当前行已更新），dp[j] 是下方（上一行未更新）
      const minNeeded: number = Math.min(dp[j + 1], dp[j]) - dungeon[i][j];
      dp[j] = Math.max(1, minNeeded);
    }
  }
  return dp[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 034. 地下城游戏 =====");
console.log(
  calculateMinimumHP([
    [-2, -3, 3],
    [-5, -10, 1],
    [10, 30, -5],
  ]),
); // 期望结果: 7
console.log(calculateMinimumHP([[0]])); // 期望结果: 1
console.log(
  calculateMinimumHPOptimized([
    [-2, -3, 3],
    [-5, -10, 1],
    [10, 30, -5],
  ]),
); // 期望结果: 7
console.log(calculateMinimumHPOptimized([[0]])); // 期望结果: 1
console.log(
  calculateMinimumHP([
    [1, -3, 3],
    [0, -2, 0],
    [-3, -3, -3],
  ]),
); // 期望结果: 3

export {};
