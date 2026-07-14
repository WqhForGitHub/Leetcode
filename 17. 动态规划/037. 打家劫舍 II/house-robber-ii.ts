// ============================================================
// 037. 打家劫舍 II
// ============================================================
// LeetCode 213. House Robber II
// 房屋排成环，不能偷相邻，求最大金额
// 时间复杂度 O(n)

// 方法1：动态规划-分情况（推荐）
// 环形：第一间和最后一间相邻，不能同时偷
// 情况1: 偷第一间，不偷最后一间 -> 范围[0, n-2]
// 情况2: 不偷第一间，可偷最后一间 -> 范围[1, n-1]
// 取两种情况的最大值
// 时间复杂度 O(n)，空间复杂度 O(1)
function rob(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  if (n === 2) return Math.max(nums[0], nums[1]);

  // 情况1：偷第一间房屋（范围[0, n-2]）
  const case1: number = robRange(nums, 0, n - 2);
  // 情况2：不偷第一间房屋（范围[1, n-1]）
  const case2: number = robRange(nums, 1, n - 1);
  return Math.max(case1, case2);
}

// 辅助函数：在[start, end]范围内偷窃（线性，同打家劫舍I）
function robRange(nums: number[], start: number, end: number): number {
  // prev2 = dp[start], prev1 = max(dp[start], dp[start+1])
  let prev2: number = nums[start];
  let prev1: number = Math.max(nums[start], nums[start + 1]);

  for (let i: number = start + 2; i <= end; i++) {
    // 状态转移：偷当前(prev2+当前) 或 不偷当前(prev1)
    const curr: number = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

// 方法2：动态规划-状态机分情况
// 同样分两种情况，但用状态机实现
// 状态：rob(偷当前) 和 notRob(不偷当前)
// 时间复杂度 O(n)，空间复杂度 O(1)
function robStateMachine(nums: number[]): number {
  const n: number = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  if (n === 2) return Math.max(nums[0], nums[1]);
  // 分两种情况取最大值
  return Math.max(robRangeStateMachine(nums, 0, n - 2), robRangeStateMachine(nums, 1, n - 1));
}

// 状态机方式求解线性范围
function robRangeStateMachine(nums: number[], start: number, end: number): number {
  let rob: number = nums[start];
  let notRob: number = 0;

  for (let i: number = start + 1; i <= end; i++) {
    // 不偷当前 = max(上轮偷, 上轮不偷)
    const newNotRob: number = Math.max(rob, notRob);
    // 偷当前 = 上轮不偷 + 当前金额
    const newRob: number = notRob + nums[i];
    rob = newRob;
    notRob = newNotRob;
  }
  return Math.max(rob, notRob);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 037. 打家劫舍 II =====");
console.log(rob([2, 3, 2])); // 期望结果: 3
console.log(rob([1, 2, 3, 1])); // 期望结果: 4
console.log(rob([1, 2, 3])); // 期望结果: 3
console.log(robStateMachine([2, 3, 2])); // 期望结果: 3
console.log(robStateMachine([1, 2, 3, 1])); // 期望结果: 4

export {};
