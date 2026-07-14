// ============================================================
// 057. 安卓系统手势解锁
// ============================================================
// LeetCode 351. Android Unlock Patterns
// Android 3x3 点阵解锁图案，给定最少和最多经过的点数 m 和 n，求合法图案数。
// 跳过中间点需要中间点已访问。
// 时间复杂度 O(9!)，空间复杂度 O(9)

// 方法1：回溯 + 预处理跳过数组（推荐）
// skip[i][j] 表示从点 i 到点 j 需要经过的中间点编号（0 表示不需要中间点）
// 利用对称性：1/3/7/9 对称，2/4/6/8 对称，5 单独，减少计算量
// 时间复杂度 O(9!)，空间复杂度 O(9)
function numberOfPatterns(m: number, n: number): number {
  // skip[i][j] 表示从点 i 到点 j 需要跳过的中间点（0 表示无需跳过）
  const skip: number[][] = new Array(10).fill(0).map(() => new Array(10).fill(0));

  // 预处理所有需要跳过中间点的情况
  skip[1][3] = skip[3][1] = 2; // 1-3 之间是 2
  skip[1][7] = skip[7][1] = 4; // 1-7 之间是 4
  skip[3][9] = skip[9][3] = 6; // 3-9 之间是 6
  skip[7][9] = skip[9][7] = 8; // 7-9 之间是 8
  skip[1][9] = skip[9][1] = 5; // 1-9 之间是 5
  skip[3][7] = skip[7][3] = 5; // 3-7 之间是 5
  skip[2][8] = skip[8][2] = 5; // 2-8 之间是 5
  skip[4][6] = skip[6][4] = 5; // 4-6 之间是 5

  const visited: boolean[] = new Array(10).fill(false);
  let result: number = 0;

  // DFS 回溯：从当前点 cur 出发，当前路径长度为 len
  function dfs(cur: number, len: number): number {
    let count: number = 0;
    // 超过最大长度，停止搜索
    if (len > n) return 0;
    // 达到最小长度，开始计数
    if (len >= m) count = 1;

    // 尝试访问下一个点
    for (let next: number = 1; next <= 9; next++) {
      // 如果 next 未访问，且（不需要跳过中间点 或 中间点已访问）
      if (!visited[next] && (skip[cur][next] === 0 || visited[skip[cur][next]])) {
        visited[next] = true;
        count += dfs(next, len + 1);
        visited[next] = false;
      }
    }
    return count;
  }

  // 利用对称性减少计算
  // 1, 3, 7, 9 对称（角点），结果乘以 4
  visited[1] = true;
  result += dfs(1, 1) * 4;
  visited[1] = false;

  // 2, 4, 6, 8 对称（边中点），结果乘以 4
  visited[2] = true;
  result += dfs(2, 1) * 4;
  visited[2] = false;

  // 5 单独（中心点）
  visited[5] = true;
  result += dfs(5, 1);
  visited[5] = false;

  return result;
}

// 方法2：回溯（不利用对称性，直接遍历所有起点）
// 时间复杂度 O(9!)，空间复杂度 O(9)
function numberOfPatterns2(m: number, n: number): number {
  const skip: number[][] = new Array(10).fill(0).map(() => new Array(10).fill(0));
  skip[1][3] = skip[3][1] = 2;
  skip[1][7] = skip[7][1] = 4;
  skip[3][9] = skip[9][3] = 6;
  skip[7][9] = skip[9][7] = 8;
  skip[1][9] = skip[9][1] = skip[3][7] = skip[7][3] = 5;
  skip[2][8] = skip[8][2] = skip[4][6] = skip[6][4] = 5;

  const visited: boolean[] = new Array(10).fill(false);
  let result: number = 0;

  function dfs(cur: number, len: number): void {
    if (len > n) return;
    if (len >= m) result++;
    for (let next: number = 1; next <= 9; next++) {
      if (!visited[next] && (skip[cur][next] === 0 || visited[skip[cur][next]])) {
        visited[next] = true;
        dfs(next, len + 1);
        visited[next] = false;
      }
    }
  }

  // 从每个点出发进行 DFS
  for (let i: number = 1; i <= 9; i++) {
    visited[i] = true;
    dfs(i, 1);
    visited[i] = false;
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 057. 安卓系统手势解锁 =====");
console.log(numberOfPatterns(1, 1)); // 期望结果: 9
console.log(numberOfPatterns(1, 2)); // 期望结果: 65
console.log(numberOfPatterns(1, 3)); // 期望结果: 385
console.log(numberOfPatterns2(1, 1)); // 期望结果: 9

export {};
