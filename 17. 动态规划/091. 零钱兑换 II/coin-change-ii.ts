// ============================================================
// 091. 零钱兑换 II
// ============================================================
// LeetCode 518. Coin Change II
// 给定硬币面额数组和金额 amount，求凑成总金额的硬币组合数（每种硬币无限个）。
// 时间复杂度：O(n * amount)，空间复杂度：O(amount)

// 方法1：DP 完全背包（推荐）
// dp[j] = 凑成金额 j 的组合数
// 外层遍历硬币，内层遍历金额（保证组合而非排列）
// 时间复杂度 O(n * amount)，空间复杂度 O(amount)
function change(amount: number, coins: number[]): number {
  // dp[j] 表示凑成金额 j 的组合数
  const dp: number[] = new Array(amount + 1).fill(0);
  dp[0] = 1; // 凑成金额0有1种方式（不选任何硬币）

  for (const coin of coins) {
    for (let j: number = coin; j <= amount; j++) {
      dp[j] += dp[j - coin];
    }
  }

  return dp[amount];
}

// 方法2：DP 二维数组
// dp[i][j] 表示前 i 种硬币凑成金额 j 的方案数
// 时间复杂度 O(n * amount)，空间复杂度 O(n * amount)
function change2D(amount: number, coins: number[]): number {
  const n: number = coins.length;
  // dp[i][j] 表示前 i 种硬币凑成金额 j 的方案数
  const dp: number[][] = [];
  for (let i: number = 0; i <= n; i++) {
    dp.push(new Array(amount + 1).fill(0));
  }
  dp[0][0] = 1;

  for (let i: number = 1; i <= n; i++) {
    const coin: number = coins[i - 1];
    for (let j: number = 0; j <= amount; j++) {
      // 不选第 i 种硬币
      dp[i][j] = dp[i - 1][j];
      // 选第 i 种硬币（可重复选）
      if (j >= coin) {
        dp[i][j] += dp[i][j - coin];
      }
    }
  }

  return dp[n][amount];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 091. 零钱兑换 II =====");
console.log(change(5, [1, 2, 5])); // 期望结果: 4
console.log(change(3, [2])); // 期望结果: 0
console.log(change(10, [10])); // 期望结果: 1
console.log(change(5, [5])); // 期望结果: 1
console.log("--- 方法2测试 ---");
console.log(change2D(5, [1, 2, 5])); // 期望结果: 4
console.log(change2D(3, [2])); // 期望结果: 0

export {};
