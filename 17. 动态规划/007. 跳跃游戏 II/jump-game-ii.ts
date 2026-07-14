// ============================================================
// 007. 跳跃游戏 II
// ============================================================
// LeetCode 45. Jump Game II
// 给定非负整数数组，每个元素表示在该位置最大跳跃步数，求到达终点的最少跳跃次数
// 时间复杂度 O(n)

// 方法1：贪心（推荐）
// 维护当前能到达的最远位置和当前跳跃的边界
// 当到达边界时，跳跃次数+1，更新边界为最远位置
// 时间复杂度 O(n)，空间复杂度 O(1)
function jump(nums: number[]): number {
  const n: number = nums.length;
  if (n <= 1) return 0;
  let jumps: number = 0; // 跳跃次数
  let curEnd: number = 0; // 当前跳跃能到达的边界
  let farthest: number = 0; // 下一步能到达的最远位置
  for (let i: number = 0; i < n - 1; i++) {
    // 更新最远可达位置
    farthest = Math.max(farthest, i + nums[i]);
    // 到达当前边界，必须跳一次
    if (i === curEnd) {
      jumps++;
      curEnd = farthest;
      // 若边界已覆盖终点，提前结束
      if (curEnd >= n - 1) break;
    }
  }
  return jumps;
}

// 方法2：动态规划（可选第二种解法）
// dp[i] 表示到达位置 i 的最少跳跃次数
// 状态转移：dp[i] = min(dp[j] + 1)，其中 j < i 且 j+nums[j] >= i
// 时间复杂度 O(n²)，空间复杂度 O(n)
function jump2(nums: number[]): number {
  const n: number = nums.length;
  // dp[i] 表示到达位置 i 的最少跳跃次数
  const dp: number[] = new Array<number>(n).fill(Infinity);
  dp[0] = 0;
  for (let i: number = 1; i < n; i++) {
    for (let j: number = 0; j < i; j++) {
      // 从 j 能跳到 i
      if (j + nums[j] >= i) {
        dp[i] = Math.min(dp[i], dp[j] + 1);
      }
    }
  }
  return dp[n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 007. 跳跃游戏 II =====");
console.log(jump([2, 3, 1, 1, 4])); // 期望结果: 2
console.log(jump([2, 3, 0, 1, 4])); // 期望结果: 2
console.log(jump2([2, 3, 1, 1, 4])); // 期望结果: 2
console.log(jump2([2, 3, 0, 1, 4])); // 期望结果: 2

export {};
