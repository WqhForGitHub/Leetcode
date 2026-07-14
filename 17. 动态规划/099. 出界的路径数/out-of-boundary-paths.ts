// ============================================================
// 099. 出界的路径数
// ============================================================
// LeetCode 576. Out of Boundary Paths
// m×n 网格，球在 (i,j)，最多移动 N 步，每步四方向，
// 求将球移出界的路径数。结果对 10^9+7 取模。
// 时间复杂度：O(N * mn)，空间复杂度：O(mn)

const MOD_PATH: number = 1e9 + 7;

// 方法1：DP（推荐）
// dp[i][j] 表示球在 (i,j) 时的路径数
// 每步从四个方向累加
// 时间复杂度 O(N * mn)，空间复杂度 O(mn)
function findPaths(
  m: number,
  n: number,
  maxMove: number,
  startRow: number,
  startColumn: number,
): number {
  // dp[i][j] 表示球当前在 (i,j) 的路径数
  let dp: number[][] = [];
  for (let i: number = 0; i < m; i++) {
    dp.push(new Array(n).fill(0));
  }

  const dirs: number[][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let result: number = 0;

  for (let move: number = 0; move < maxMove; move++) {
    const nextDp: number[][] = [];
    for (let i: number = 0; i < m; i++) {
      nextDp.push(new Array(n).fill(0));
    }

    for (let i: number = 0; i < m; i++) {
      for (let j: number = 0; j < n; j++) {
        for (const [dr, dc] of dirs) {
          const ni: number = i + dr;
          const nj: number = j + dc;
          if (ni < 0 || ni >= m || nj < 0 || nj >= n) {
            // 出界，累加到结果
            result = (result + dp[i][j]) % MOD_PATH;
          } else {
            nextDp[ni][nj] = (nextDp[ni][nj] + dp[i][j]) % MOD_PATH;
          }
        }
      }
    }

    // 起始位置初始为1
    if (move === 0) {
      // 初始化：第0步只有一个起点
      for (let i: number = 0; i < m; i++) {
        for (let j: number = 0; j < n; j++) {
          nextDp[i][j] = 0;
        }
      }
      dp = [];
      for (let i: number = 0; i < m; i++) {
        dp.push(new Array(n).fill(0));
      }
      dp[startRow][startColumn] = 1;
      continue;
    }

    dp = nextDp;
  }

  return result;
}

// 方法2：递归 + 记忆化
// dfs(i, j, moves) 表示从 (i,j) 还能走 moves 步时出界的路径数
// 时间复杂度 O(N * mn)，空间复杂度 O(N * mn)
function findPathsMemo(
  m: number,
  n: number,
  maxMove: number,
  startRow: number,
  startColumn: number,
): number {
  const memo: Map<string, number> = new Map();

  const dfs = (i: number, j: number, moves: number): number => {
    // 出界，找到一条路径
    if (i < 0 || i >= m || j < 0 || j >= n) return 1;
    // 没有步数了且没出界
    if (moves === 0) return 0;

    const key: string = i + "," + j + "," + moves;
    if (memo.has(key)) return memo.get(key)!;

    let count: number = 0;
    count = (count + dfs(i - 1, j, moves - 1)) % MOD_PATH;
    count = (count + dfs(i + 1, j, moves - 1)) % MOD_PATH;
    count = (count + dfs(i, j - 1, moves - 1)) % MOD_PATH;
    count = (count + dfs(i, j + 1, moves - 1)) % MOD_PATH;

    memo.set(key, count);
    return count;
  };

  return dfs(startRow, startColumn, maxMove);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 099. 出界的路径数 =====");
console.log(findPathsMemo(2, 2, 2, 2, 2)); // 期望结果: 6
console.log(findPathsMemo(1, 3, 3, 0, 1)); // 期望结果: 12
console.log(findPathsMemo(3, 3, 3, 0, 2)); // 期望结果: 12
console.log("--- 方法2测试 ---");
console.log(findPathsMemo(2, 2, 2, 2, 2)); // 期望结果: 6

export {};
