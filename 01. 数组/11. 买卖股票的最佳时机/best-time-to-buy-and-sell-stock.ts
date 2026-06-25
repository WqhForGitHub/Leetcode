// ============================================================
// 11. 买卖股票的最佳时机
// ============================================================
// LeetCode 121. Best Time to Buy and Sell Stock
// 给定数组 prices，prices[i] 是第 i 天的价格。只能买卖一次，求最大利润。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：一次遍历-记录最小值和最大利润（推荐）
function maxProfit(prices: number[]): number {
  let minPrice = Infinity; // 截至目前的最低价
  let maxProfit = 0; // 截至目前的最大利润

  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price; // 更新最低价（买入点）
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice; // 更新最大利润（卖出点）
    }
  }

  return maxProfit;
}

// 方法2：动态规划
// dp 表示第 i 天结束时的最大利润，状态转移：dp[i] = max(dp[i-1], prices[i] - minPrice)
function maxProfitDP(prices: number[]): number {
  if (prices.length === 0) return 0;

  let minPrice = prices[0];
  let dp = 0; // 滚动变量，等价于 dp[i-1]

  for (let i = 1; i < prices.length; i++) {
    minPrice = Math.min(minPrice, prices[i]);
    dp = Math.max(dp, prices[i] - minPrice);
  }

  return dp;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 11. 买卖股票的最佳时机 =====");
console.log("描述:", maxProfit([7, 1, 5, 3, 6, 4])); // 期望结果: 5
console.log("描述:", maxProfit([7, 6, 4, 3, 1])); // 期望结果: 0
console.log("描述:", maxProfitDP([7, 1, 5, 3, 6, 4])); // 期望结果: 5
console.log("描述:", maxProfitDP([7, 6, 4, 3, 1])); // 期望结果: 0

export {};
