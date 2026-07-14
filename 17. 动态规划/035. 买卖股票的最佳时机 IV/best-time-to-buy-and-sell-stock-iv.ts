// ============================================================
// 035. 买卖股票的最佳时机 IV
// ============================================================
// LeetCode 188. Best Time to Buy and Sell Stock IV
// 最多完成 k 笔交易，求最大利润
// 时间复杂度 O(nk)

// 方法1：动态规划（推荐）
// buy[j] 表示最多j次交易且持有股票时的最大利润
// sell[j] 表示最多j次交易且不持有股票时的最大利润
// 状态转移：
//   buy[j] = max(buy[j], sell[j-1] - prices[i])  保持持有 or 买入
//   sell[j] = max(sell[j], buy[j] + prices[i])   保持不持有 or 卖出
// 时间复杂度 O(nk)，空间复杂度 O(k)
function maxProfit(k: number, prices: number[]): number {
  const n: number = prices.length;
  if (n === 0 || k === 0) return 0;

  // 如果k >= n/2，相当于无限次交易，用贪心
  if (k >= Math.floor(n / 2)) {
    let profit: number = 0;
    for (let i: number = 1; i < n; i++) {
      if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1];
      }
    }
    return profit;
  }

  // buy[j]: 最多j次交易时持有股票的最大利润，初始为负无穷（不可能）
  const buy: number[] = new Array<number>(k + 1).fill(-Infinity);
  // sell[j]: 最多j次交易时不持有股票的最大利润，初始为0
  const sell: number[] = new Array<number>(k + 1).fill(0);

  for (let i: number = 0; i < n; i++) {
    for (let j: number = 1; j <= k; j++) {
      // 状态转移：买入（从j-1次交易的卖出利润中扣除当前价格）
      buy[j] = Math.max(buy[j], sell[j - 1] - prices[i]);
      // 状态转移：卖出（从j次交易的持有利润中加上当前价格）
      sell[j] = Math.max(sell[j], buy[j] + prices[i]);
    }
  }
  return sell[k];
}

// 方法2：动态规划-二维状态数组
// dp[j][0]: 最多j次交易不持有股票的最大利润
// dp[j][1]: 最多j次交易持有股票的最大利润
// 时间复杂度 O(nk)，空间复杂度 O(k)
function maxProfit2D(k: number, prices: number[]): number {
  const n: number = prices.length;
  if (n === 0 || k === 0) return 0;

  if (k >= Math.floor(n / 2)) {
    let profit: number = 0;
    for (let i: number = 1; i < n; i++) {
      if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1];
      }
    }
    return profit;
  }

  // dp[j][0]: 不持有, dp[j][1]: 持有
  const dp: number[][] = Array.from({ length: k + 1 }, (): number[] => [0, -Infinity]);

  for (let i: number = 0; i < n; i++) {
    for (let j: number = 1; j <= k; j++) {
      // 不持有 = max(昨天不持有, 昨天持有今天卖出)
      dp[j][0] = Math.max(dp[j][0], dp[j][1] + prices[i]);
      // 持有 = max(昨天持有, 昨天j-1次不持有今天买入)
      dp[j][1] = Math.max(dp[j][1], dp[j - 1][0] - prices[i]);
    }
  }
  return dp[k][0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 035. 买卖股票的最佳时机 IV =====");
console.log(maxProfit(2, [2, 4, 1])); // 期望结果: 2
console.log(maxProfit(2, [3, 2, 6, 5, 0, 3])); // 期望结果: 7
console.log(maxProfit2D(2, [2, 4, 1])); // 期望结果: 2
console.log(maxProfit2D(2, [3, 2, 6, 5, 0, 3])); // 期望结果: 7
console.log(maxProfit(2, [1, 2, 4])); // 期望结果: 3

export {};
