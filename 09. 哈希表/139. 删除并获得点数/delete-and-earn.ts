// ============================================================
// 139. 删除并获得点数
// ============================================================
// LeetCode 740. Delete and Earn
// 给定整数数组 nums，每次选一个数 x 获得点数 x，但会删除所有 x-1 和 x+1。
// 求能获得的最大点数。
// 时间复杂度：O(n + maxVal)，空间复杂度：O(maxVal)

// 思路：转化为打家劫舍问题
// 统计每个值的总点数 points[v]，相邻值不能同时选
function deleteAndEarn(nums: number[]): number {
  if (nums.length === 0) return 0;
  let maxVal = 0;
  // 哈希表统计每个值的总点数
  const points = new Map<number, number>();
  for (const num of nums) {
    points.set(num, (points.get(num) || 0) + num);
    maxVal = Math.max(maxVal, num);
  }

  // DP：rob[i] 表示考虑值 i 时最大点数
  // 取 i：dp[i] = dp[i-2] + points[i]
  // 不取 i：dp[i] = dp[i-1]
  let prev2 = 0; // dp[i-2]
  let prev1 = points.get(1) || 0; // dp[i-1]（值 1 的点数）
  let result = Math.max(prev2, prev1);

  for (let i = 2; i <= maxVal; i++) {
    const take = prev2 + (points.get(i) || 0);
    const skip = prev1;
    const cur = Math.max(take, skip);
    prev2 = prev1;
    prev1 = cur;
    result = cur;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 139. 删除并获得点数 =====");
console.log(deleteAndEarn([3, 4, 2])); // 期望: 6 (取 4, 删 3 和 5, 再取 2)
console.log(deleteAndEarn([2, 2, 3, 3, 3, 4])); // 期望: 9 (取 3*3=9)
console.log(deleteAndEarn([1, 1, 1, 2, 4, 5, 5, 5, 6])); // 期望: 18

export {};
