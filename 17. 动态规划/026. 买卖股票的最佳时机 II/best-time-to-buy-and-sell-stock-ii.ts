// ============================================================
// 026. 买卖股票的最佳时机 II
// ============================================================
// LeetCode 122. Best Time to Buy and Sell Stock II
// 可以多次买卖股票（不能同时持有多笔），求最大利润。
// 时间复杂度 O(n)，空间复杂度 O(1)

// 方法1：动态规划状态机（推荐）
// dp[i][0] 表示第 i 天不持有股票时的最大利润
// dp[i][1] 表示第 i 天持有股票时的最大利润
// 状态转移：
//   dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i])  卖出或继续不持有
//   dp[i][1] = max(dp[i-1][1], dp[i-1][0] - prices[i])  买入或继续持有
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxProfit(prices: number[]): number {
  if (prices.length === 0) return 0;

  // dp0: 不持有股票的最大利润，dp1: 持有股票的最大利润
  let dp0: number = 0;
  let dp1: number = -prices[0];

  for (let i: number = 1; i < prices.length; i++) {
    const newDp0: number = Math.max(dp0, dp1 + prices[i]); // 卖出或不动
    const newDp1: number = Math.max(dp1, dp0 - prices[i]); // 买入或不动
    dp0 = newDp0;
    dp1 = newDp1;
  }

  return dp0; // 最后一天不持有股票时的最大利润
}

// 方法2：贪心
// 只要今天比昨天高就卖出，累加所有上涨差价
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxProfit2(prices: number[]): number {
  let profit: number = 0;

  for (let i: number = 1; i < prices.length; i++) {
    // 如果今天价格比昨天高，就累加差价
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }

  return profit;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 026. 买卖股票的最佳时机 II =====");
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 期望结果: 7
console.log(maxProfit([1, 2, 3, 4, 5])); // 期望结果: 4
console.log(maxProfit([7, 6, 4, 3, 1])); // 期望结果: 0
console.log(maxProfit2([7, 1, 5, 3, 6, 4])); // 期望结果: 7
console.log(maxProfit2([1, 2, 3, 4, 5])); // 期望结果: 4

export {};
