// ============================================================
// 055. 比特位计数
// ============================================================
// LeetCode 338. Counting Bits
// 给定一个非负整数 n，对于 0 <= i <= n 的每个 i，返回其二进制表示中 1 的个数数组。
// 时间复杂度 O(n)，空间复杂度 O(n)

// 方法1：动态规划 - 最低有效位（推荐）
// dp[i] 表示数字 i 的二进制中 1 的个数
// 状态转移：dp[i] = dp[i >> 1] + (i & 1)
// i >> 1 去掉最低位，i & 1 判断最低位是否为 1
// 时间复杂度 O(n)，空间复杂度 O(n)
function countBits(n: number): number[] {
  const dp: number[] = new Array(n + 1).fill(0);
  for (let i: number = 1; i <= n; i++) {
    // i >> 1 是 i 去掉最低位后的数
    // i & 1 判断最低位是否为 1
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}

// 方法2：动态规划 - 最低设置位（可选）
// dp[i] = dp[i & (i - 1)] + 1
// i & (i - 1) 将 i 的最低位 1 变为 0，比 i 少一个 1
// 时间复杂度 O(n)，空间复杂度 O(n)
function countBits2(n: number): number[] {
  const dp: number[] = new Array(n + 1).fill(0);
  for (let i: number = 1; i <= n; i++) {
    // i & (i - 1) 把 i 的最低位 1 翻转为 0
    // 所以 dp[i] = dp[i & (i-1)] + 1
    dp[i] = dp[i & (i - 1)] + 1;
  }
  return dp;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 055. 比特位计数 =====");
console.log(countBits(2)); // 期望结果: [0, 1, 1]
console.log(countBits(5)); // 期望结果: [0, 1, 1, 2, 1, 2]
console.log(countBits(0)); // 期望结果: [0]
console.log(countBits2(2)); // 期望结果: [0, 1, 1]
console.log(countBits2(5)); // 期望结果: [0, 1, 1, 2, 1, 2]

export {};
