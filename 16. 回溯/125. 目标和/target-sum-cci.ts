// ============================================================
// 125. 目标和
// ============================================================
// 面试金典 08.10 进阶 / LeetCode 494. Target Sum
// 给数组每个元素配 + 或 -，使表达式等于 target，求方案数。

// 时间复杂度：O(2^n) 回溯，O(n*sum) DP
// 空间复杂度：O(n) 回溯，O(sum) DP

// 方法1：回溯
// 对每个元素选 + 或 -，到达末尾时检查总和是否等于 target。
// 时间复杂度 O(2^n), 空间复杂度 O(n)
function findTargetSumWays(nums: number[], target: number): number {
  const n: number = nums.length;
  let count: number = 0;

  function backtrack(index: number, sum: number): void {
    if (index === n) {
      if (sum === target) count++;
      return;
    }
    backtrack(index + 1, sum + nums[index]); // 取 +
    backtrack(index + 1, sum - nums[index]); // 取 -
  }

  backtrack(0, 0);
  return count;
}

// 方法2：DP（子集和）
// 设 P 为取 + 的元素和，N 为取 - 的元素和（绝对值和）。
// P - N = target, P + N = sum => 2P = target + sum => P = (target+sum)/2
// 问题转化为：从 nums 中选若干元素使其和为 P（0/1 背包计数）。
// 时间复杂度 O(n * sum), 空间复杂度 O(sum)
function findTargetSumWays2(nums: number[], target: number): number {
  const sum: number = nums.reduce((a, b) => a + b, 0);
  // (target + sum) 必须非负偶数
  const P: number = target + sum;
  if (P < 0 || P % 2 !== 0) return 0;
  const goal: number = P / 2;
  if (goal < 0) return 0;

  // dp[j] = 选若干数和为 j 的方案数
  const dp: number[] = new Array(goal + 1).fill(0);
  dp[0] = 1;
  for (const num of nums) {
    for (let j: number = goal; j >= num; j--) {
      dp[j] += dp[j - num];
    }
  }
  return dp[goal];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 125. 目标和 =====");
console.log(findTargetSumWays([1, 1, 1, 1, 1], 3)); // 期望: 5
console.log(findTargetSumWays2([1, 1, 1, 1, 1], 3)); // 期望: 5
console.log(findTargetSumWays([1], 1)); // 期望: 1
console.log(findTargetSumWays2([1], 1));

export {};
