// ============================================================
// 043. 粉刷房子 II
// ============================================================
// LeetCode 265. Paint House II
// 给定 n×k 矩阵，每个房子刷k种颜色，相邻房子不能同色，求最小花费。
// 时间复杂度 O(nk)，空间复杂度 O(1)

// 方法1：动态规划 + 维护最小和次小值（推荐）
// 只需维护上一行的最小值、次小值及对应颜色索引，避免内层遍历所有颜色
// 状态转移：dp[j] = costs[i][j] + (j==minColor ? secondMin : min)
// 时间复杂度 O(nk)，空间复杂度 O(1)
function minCostII(costs: number[][]): number {
  const n: number = costs.length;
  if (n === 0) return 0;
  const k: number = costs[0].length;
  if (k === 1) {
    // 只有一种颜色，只能刷一个房子
    return n === 1 ? costs[0][0] : -1;
  }

  // 上一轮的最小值、次小值及其颜色索引
  let prevMin: number = 0;
  let prevSecondMin: number = 0;
  let prevMinColor: number = -1;

  for (let i: number = 0; i < n; i++) {
    let currMin: number = Infinity;
    let currSecondMin: number = Infinity;
    let currMinColor: number = -1;

    for (let j: number = 0; j < k; j++) {
      // 如果当前颜色和上一房子最小花费颜色相同，则用次小值
      const cost: number = costs[i][j] + (j === prevMinColor ? prevSecondMin : prevMin);

      // 更新当前行的最小值和次小值
      if (cost < currMin) {
        currSecondMin = currMin;
        currMin = cost;
        currMinColor = j;
      } else if (cost < currSecondMin) {
        currSecondMin = cost;
      }
    }

    prevMin = currMin;
    prevSecondMin = currSecondMin;
    prevMinColor = currMinColor;
  }

  return prevMin;
}

// 方法2：动态规划（暴力，遍历所有颜色）
// dp[i][j] = costs[i][j] + min(dp[i-1][m]) for m != j
// 时间复杂度 O(nk²)，空间复杂度 O(1)
function minCostII2(costs: number[][]): number {
  const n: number = costs.length;
  if (n === 0) return 0;
  const k: number = costs[0].length;

  // 用上一行的dp值
  let prevDp: number[] = [...costs[0]];

  for (let i: number = 1; i < n; i++) {
    const currDp: number[] = new Array<number>(k);
    for (let j: number = 0; j < k; j++) {
      // 找上一行中不与当前颜色相同的最小值
      let minPrev: number = Infinity;
      for (let m: number = 0; m < k; m++) {
        if (m !== j) {
          minPrev = Math.min(minPrev, prevDp[m]);
        }
      }
      currDp[j] = costs[i][j] + minPrev;
    }
    prevDp = currDp;
  }

  return Math.min(...prevDp);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 043. 粉刷房子 II =====");
console.log(
  minCostII([
    [1, 5, 3],
    [2, 9, 4],
  ]),
); // 期望结果: 5
console.log(
  minCostII([
    [1, 3],
    [2, 4],
  ]),
); // 期望结果: 5
console.log(minCostII([])); // 期望结果: 0
console.log(
  minCostII2([
    [1, 5, 3],
    [2, 9, 4],
  ]),
); // 期望结果: 5

export {};
