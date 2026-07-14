// ============================================================
// 041. 粉刷房子
// ============================================================
// LeetCode 256. Paint House
// 给定 n×3 矩阵表示每个房子刷3种颜色的花费，相邻房子不能同色，求最小花费。
// 时间复杂度 O(n)，空间复杂度 O(1)

// 方法1：动态规划（推荐）
// 用三个变量记录当前房子刷每种颜色的最小累计花费
// 状态转移：dp[j] = costs[i][j] + min(其他两种颜色的dp值)
// 时间复杂度 O(n)，空间复杂度 O(1)
function minCost(costs: number[][]): number {
  const n: number = costs.length;
  if (n === 0) return 0;

  // 初始化第一个房子的花费
  let r: number = costs[0][0]; // 红色
  let b: number = costs[0][1]; // 蓝色
  let g: number = costs[0][2]; // 绿色

  for (let i: number = 1; i < n; i++) {
    // 保存上一轮的值，避免覆盖影响后续计算
    const prevR: number = r;
    const prevB: number = b;
    const prevG: number = g;
    // 当前房子刷某颜色 = 当前花费 + 上一房子刷其他颜色的最小花费
    r = costs[i][0] + Math.min(prevB, prevG);
    b = costs[i][1] + Math.min(prevR, prevG);
    g = costs[i][2] + Math.min(prevR, prevB);
  }

  return Math.min(r, b, g);
}

// 方法2：动态规划（二维数组版）
// 使用 dp[i][j] 表示前 i 个房子，第 i 个刷颜色 j 的最小花费
// 时间复杂度 O(n)，空间复杂度 O(n)
function minCost2(costs: number[][]): number {
  const n: number = costs.length;
  if (n === 0) return 0;

  // dp[i][j] 表示刷完前i+1个房子且第i+1个刷颜色j的最小累计花费
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(3).fill(0));

  dp[0][0] = costs[0][0];
  dp[0][1] = costs[0][1];
  dp[0][2] = costs[0][2];

  for (let i: number = 1; i < n; i++) {
    // 第i个房子刷颜色0，前一个只能刷颜色1或2
    dp[i][0] = costs[i][0] + Math.min(dp[i - 1][1], dp[i - 1][2]);
    dp[i][1] = costs[i][1] + Math.min(dp[i - 1][0], dp[i - 1][2]);
    dp[i][2] = costs[i][2] + Math.min(dp[i - 1][0], dp[i - 1][1]);
  }

  return Math.min(dp[n - 1][0], dp[n - 1][1], dp[n - 1][2]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 041. 粉刷房子 =====");
console.log(
  minCost([
    [17, 2, 17],
    [16, 16, 5],
    [14, 3, 19],
  ]),
); // 期望结果: 10
console.log(minCost([[7, 6, 2]])); // 期望结果: 2
console.log(minCost([])); // 期望结果: 0
console.log(
  minCost([
    [1, 5, 3],
    [2, 9, 4],
  ]),
); // 期望结果: 5
console.log(
  minCost2([
    [17, 2, 17],
    [16, 16, 5],
    [14, 3, 19],
  ]),
); // 期望结果: 10

export {};
