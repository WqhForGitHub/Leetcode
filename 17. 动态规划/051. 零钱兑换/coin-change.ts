// ============================================================
// 051. 零钱兑换
// ============================================================
// LeetCode 322. Coin Change
// 给定不同面额的硬币 coins 和一个总金额 amount，计算可以凑成总金额所需的最少硬币个数。
// 如果没有任何一种硬币组合能组成该金额，返回 -1。
// 时间复杂度 O(n * amount)，空间复杂度 O(amount)

// 方法1：动态规划（推荐）
// dp[i] 表示凑成金额 i 所需的最少硬币数
// 状态转移：dp[i] = min(dp[i - coin] + 1)，遍历每个硬币
// 时间复杂度 O(n * amount)，空间复杂度 O(amount)
function coinChange(coins: number[], amount: number): number {
  // 初始化 dp 数组，dp[i] 表示凑成金额 i 的最少硬币数
  // 初始值设为 amount + 1（一个不可能的大值，相当于无穷大）
  const dp: number[] = new Array(amount + 1).fill(amount + 1);
  // 金额为 0 时不需要硬币
  dp[0] = 0;

  // 遍历每个金额，计算最少硬币数
  for (let i: number = 1; i <= amount; i++) {
    for (let j: number = 0; j < coins.length; j++) {
      const coin: number = coins[j];
      // 只有当前硬币面额不超过目标金额时才考虑
      if (coin <= i) {
        // 状态转移：用当前硬币 + 剩余金额的最优解
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  // 如果 dp[amount] 仍为初始大值，说明无法凑成
  return dp[amount] > amount ? -1 : dp[amount];
}

// 方法2：BFS 广度优先搜索
// 将问题转化为图的最短路径问题：从金额 0 出发，每次加一个硬币，最先到达 amount 的层数即为答案
// 时间复杂度 O(n * amount)，空间复杂度 O(amount)
function coinChange2(coins: number[], amount: number): number {
  if (amount === 0) return 0;

  const queue: number[] = [0];
  const visited: boolean[] = new Array(amount + 1).fill(false);
  visited[0] = true;
  let level: number = 0;

  while (queue.length > 0) {
    const size: number = queue.length;
    level++;
    for (let i: number = 0; i < size; i++) {
      const cur: number = queue.shift()!;
      for (let j: number = 0; j < coins.length; j++) {
        const coin: number = coins[j];
        const next: number = cur + coin;
        // 到达目标金额，返回当前层数
        if (next === amount) return level;
        // 未越界且未访问过，加入队列
        if (next < amount && !visited[next]) {
          visited[next] = true;
          queue.push(next);
        }
      }
    }
  }

  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 051. 零钱兑换 =====");
console.log(coinChange([1, 2, 5], 11)); // 期望结果: 3 (5+5+1)
console.log(coinChange([2], 3)); // 期望结果: -1
console.log(coinChange([1], 0)); // 期望结果: 0
console.log(coinChange([1, 2, 5], 100)); // 期望结果: 20 (20个5)
console.log(coinChange2([1, 2, 5], 11)); // 期望结果: 3

export {};
