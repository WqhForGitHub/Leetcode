// ============================================================
// 027. 买卖股票的最佳时机 III
// ============================================================
// LeetCode 123. Best Time to Buy and Sell Stock III
// 最多完成 2 笔交易，求最大利润。
// 时间复杂度 O(n)，空间复杂度 O(1)

// 方法1：动态规划状态机（推荐）
// 5个状态：不操作、第一次买入、第一次卖出、第二次买入、第二次卖出
// buy1: 第一次买入后的最大利润
// sell1: 第一次卖出后的最大利润
// buy2: 第二次买入后的最大利润
// sell2: 第二次卖出后的最大利润
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxProfit(prices: number[]): number {
  if (prices.length === 0) return 0;

  let buy1: number = -prices[0]; // 第一次买入后的最大利润
  let sell1: number = 0; // 第一次卖出后的最大利润
  let buy2: number = -prices[0]; // 第二次买入后的最大利润
  let sell2: number = 0; // 第二次卖出后的最大利润

  for (let i: number = 1; i < prices.length; i++) {
    const price: number = prices[i];
    // 第一次买入：之前没买过今天买，或之前已经买了
    buy1 = Math.max(buy1, -price);
    // 第一次卖出：之前已经卖了，或今天卖出第一次买入的
    sell1 = Math.max(sell1, buy1 + price);
    // 第二次买入：之前已经买了第二次，或用第一次利润今天买入
    buy2 = Math.max(buy2, sell1 - price);
    // 第二次卖出：之前已经卖了第二次，或今天卖出第二次买入的
    sell2 = Math.max(sell2, buy2 + price);
  }

  return sell2;
}

// 方法2：动态规划通用 k 次交易
// dp[k][i] 表示最多 k 次交易到第 i 天的最大利润
// 时间复杂度 O(kn)，空间复杂度 O(kn)，此处 k=2
function maxProfit2(prices: number[]): number {
  const n: number = prices.length;
  if (n === 0) return 0;
  const K: number = 2; // 最多交易次数

  // dp[k][i] 表示最多 k 次交易到第 i 天的最大利润
  const dp: number[][] = Array.from({ length: K + 1 }, () => new Array<number>(n).fill(0));

  for (let k: number = 1; k <= K; k++) {
    // maxDiff 表示 dp[k-1][j] - prices[j] 的最大值
    let maxDiff: number = -prices[0];
    for (let i: number = 1; i < n; i++) {
      // dp[k][i] = max(dp[k][i-1], max(prices[i] + dp[k-1][j] - prices[j])) for j < i
      maxDiff = Math.max(maxDiff, dp[k - 1][i - 1] - prices[i - 1]);
      dp[k][i] = Math.max(dp[k][i - 1], prices[i] + maxDiff);
    }
  }

  return dp[K][n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 027. 买卖股票的最佳时机 III =====");
console.log(maxProfit([3, 3, 5, 0, 0, 3, 1, 4])); // 期望结果: 6
console.log(maxProfit([1, 2, 3, 4, 5])); // 期望结果: 4
console.log(maxProfit([7, 6, 4, 3, 1])); // 期望结果: 0
console.log(maxProfit2([3, 3, 5, 0, 0, 3, 1, 4])); // 期望结果: 6
console.log(maxProfit2([1, 2, 3, 4, 5])); // 期望结果: 4

export {};
