// ============================================================
// 036. 打家劫舍
// ============================================================
// LeetCode 198. House Robber
// 沿街房屋有金额，不能偷相邻房屋，求最大金额
// 时间复杂度 O(n)

// 方法1：动态规划（推荐）
// dp[i] 表示前i个房屋能偷到的最大金额
// 状态转移：dp[i] = max(dp[i-1], dp[i-2] + nums[i])
// 偷当前房屋：dp[i-2] + nums[i]（不能偷前一间）
// 不偷当前房屋：dp[i-1]（沿用前一间的结果）
// 时间复杂度 O(n)，空间复杂度 O(1)
function rob(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];

  // prev2 = dp[i-2], prev1 = dp[i-1]
  let prev2: number = nums[0];
  let prev1: number = Math.max(nums[0], nums[1]);

  for (let i: number = 2; i < n; i++) {
    // 状态转移：偷当前(i-2的最优+当前) 或 不偷当前(i-1的最优)
    const curr: number = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

// 方法2：动态规划-状态机
// 用状态机思路：每个房屋有"偷"和"不偷"两种状态
// rob: 偷当前房屋的最大金额
// notRob: 不偷当前房屋的最大金额
// 状态转移：
//   notRob[i] = max(rob[i-1], notRob[i-1])  不偷当前，上轮随意
//   rob[i] = notRob[i-1] + nums[i]          偷当前，上轮必须不偷
// 时间复杂度 O(n)，空间复杂度 O(1)
function robStateMachine(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;

  // rob: 偷当前房屋, notRob: 不偷当前房屋
  let rob: number = nums[0];
  let notRob: number = 0;

  for (let i: number = 1; i < n; i++) {
    // 不偷当前 = max(上轮偷, 上轮不偷)
    const newNotRob: number = Math.max(rob, notRob);
    // 偷当前 = 上轮不偷 + 当前金额（相邻不能都偷）
    const newRob: number = notRob + nums[i];
    rob = newRob;
    notRob = newNotRob;
  }
  return Math.max(rob, notRob);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 036. 打家劫舍 =====");
console.log(rob([1, 2, 3, 1])); // 期望结果: 4
console.log(rob([2, 7, 9, 3, 1])); // 期望结果: 12
console.log(robStateMachine([1, 2, 3, 1])); // 期望结果: 4
console.log(robStateMachine([2, 7, 9, 3, 1])); // 期望结果: 12
console.log(rob([1])); // 期望结果: 1

export {};
