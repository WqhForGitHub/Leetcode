// ============================================================
// 048. 买卖股票的最佳时机含冷冻期
// ============================================================
// LeetCode 309. Best Time to Buy and Sell Stock with Cooldown
// 可以多次买卖，卖出后有一天冷冻期不能买入，求最大利润。
// 时间复杂度 O(n)，空间复杂度 O(1)

// 方法1：动态规划 / 状态机（推荐）
// 三个状态：
//   hold: 当前持有股票时的最大利润
//   sold: 当天刚卖出股票（处于冷冻期）的最大利润
//   cooldown: 当前不持有股票且非冷冻期的最大利润
// 状态转移：
//   hold = max(hold, cooldown - price)  保持持有 或 从冷冻期后买入
//   sold = hold + price  卖出股票
//   cooldown = max(cooldown, sold)  冷冻期结束 或 继续不持有
// 时间复杂度 O(n)，空间复杂度 O(1)
function maxProfit(prices: number[]): number {
  const n: number = prices.length;
  if (n <= 1) return 0;

  // 初始化第一天的状态
  let hold: number = -prices[0]; // 第一天买入
  let sold: number = 0; // 第一天不可能卖出
  let cooldown: number = 0; // 第一天不操作

  for (let i: number = 1; i < n; i++) {
    const price: number = prices[i];
    // 保存上一轮的值
    const prevHold: number = hold;
    const prevSold: number = sold;
    const prevCooldown: number = cooldown;

    // 持有：保持持有 或 从非冷冻期买入
    hold = Math.max(prevHold, prevCooldown - price);
    // 卖出：从持有状态卖出
    sold = prevHold + price;
    // 冷冻期/空仓：前一天冷冻期 或 前一天卖出后进入冷冻期
    cooldown = Math.max(prevCooldown, prevSold);
  }

  // 最后一天不可能持有股票（持有一定不如卖出）
  return Math.max(sold, cooldown);
}

// 方法2：动态规划（数组版）
// 使用三个数组分别记录每天的状态
// 时间复杂度 O(n)，空间复杂度 O(n)
function maxProfit2(prices: number[]): number {
  const n: number = prices.length;
  if (n <= 1) return 0;

  // hold[i], sold[i], cooldown[i] 分别表示第i天的三种状态
  const hold: number[] = new Array<number>(n);
  const sold: number[] = new Array<number>(n);
  const cooldown: number[] = new Array<number>(n);

  hold[0] = -prices[0];
  sold[0] = 0;
  cooldown[0] = 0;

  for (let i: number = 1; i < n; i++) {
    hold[i] = Math.max(hold[i - 1], cooldown[i - 1] - prices[i]);
    sold[i] = hold[i - 1] + prices[i];
    cooldown[i] = Math.max(cooldown[i - 1], sold[i - 1]);
  }

  return Math.max(sold[n - 1], cooldown[n - 1]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 048. 买卖股票的最佳时机含冷冻期 =====");
console.log(maxProfit([1, 2, 3, 0, 2])); // 期望结果: 3
console.log(maxProfit([1])); // 期望结果: 0
console.log(maxProfit([1, 2, 4])); // 期望结果: 3
console.log(maxProfit2([1, 2, 3, 0, 2])); // 期望结果: 3

export {};
