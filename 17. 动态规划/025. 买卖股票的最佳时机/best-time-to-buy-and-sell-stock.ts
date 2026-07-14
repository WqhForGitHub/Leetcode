// ============================================================
// 025. 买卖股票的最佳时机
// ============================================================
// LeetCode 121. Best Time to Buy and Sell Stock
// 给定股票每天价格，只能买卖一次，求最大利润。
// 时间复杂度 O(n)，空间复杂度 O(1)

// 方法1：动态规划贪心（推荐）
// 维护最低价格 minPrice，每天计算利润并更新最大利润
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxProfit(prices: number[]): number {
  let minPrice: number = Infinity;
  let maxProfitValue: number = 0;

  for (let i: number = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      // 更新最低买入价
      minPrice = prices[i];
    } else {
      // 计算当前卖出的利润，更新最大利润
      maxProfitValue = Math.max(maxProfitValue, prices[i] - minPrice);
    }
  }

  return maxProfitValue;
}

// 方法2：动态规划
// dp[i] 表示前 i 天的最大利润
// 状态转移：dp[i] = max(dp[i-1], prices[i] - minPrice)
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxProfit2(prices: number[]): number {
  if (prices.length === 0) return 0;

  let minPrice: number = prices[0];
  let dp: number = 0; // dp 表示前 i 天的最大利润

  for (let i: number = 1; i < prices.length; i++) {
    // 更新最低价格
    minPrice = Math.min(minPrice, prices[i]);
    // dp[i] = max(dp[i-1], 今天卖出的利润)
    dp = Math.max(dp, prices[i] - minPrice);
  }

  return dp;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 025. 买卖股票的最佳时机 =====");
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 期望结果: 5
console.log(maxProfit([7, 6, 4, 3, 1])); // 期望结果: 0
console.log(maxProfit2([7, 1, 5, 3, 6, 4])); // 期望结果: 5
console.log(maxProfit2([7, 6, 4, 3, 1])); // 期望结果: 0
console.log(maxProfit([1, 2])); // 期望结果: 1

export {};
