// ============================================================
// 064. 组合总和 IV
// ============================================================
// LeetCode 377. Combination Sum IV
// 给定不同正整数数组和目标 target，求排列数之和等于 target 的方案数。
// 时间复杂度 O(n * target)，空间复杂度 O(target)

// 方法1：动态规划（推荐）
// dp[i] = 凑成目标 i 的排列方案数
// 状态转移：dp[i] = sum(dp[i - num]) for each num in nums if i >= num
// 注意：这是排列问题（顺序不同算不同方案），外层遍历 target，内层遍历 nums
// 时间复杂度 O(n * target)，空间复杂度 O(target)
function combinationSum4(nums: number[], target: number): number {
  // dp[i] 表示凑成目标值 i 的排列方案数
  const dp: number[] = new Array(target + 1).fill(0);
  dp[0] = 1; // 凑成 0 有一种方案：不选任何数

  for (let i: number = 1; i <= target; i++) {
    for (const num of nums) {
      if (i >= num) {
        // 当前目标 i 可以由 i-num 加上 num 得到
        dp[i] += dp[i - num];
      }
    }
  }

  return dp[target];
}

// 方法2：递归 + 记忆化
// 从 target 出发，每次减去一个 num，递归求解
// 时间复杂度 O(n * target)，空间复杂度 O(target)
function combinationSum4_2(nums: number[], target: number): number {
  const memo: Map<number, number> = new Map();

  function dfs(remaining: number): number {
    if (remaining === 0) return 1; // 找到一种方案
    if (remaining < 0) return 0; // 不合法
    if (memo.has(remaining)) return memo.get(remaining)!;

    let count: number = 0;
    for (const num of nums) {
      count += dfs(remaining - num);
    }
    memo.set(remaining, count);
    return count;
  }

  return dfs(target);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 064. 组合总和 IV =====");
console.log(combinationSum4([1, 2, 3], 4)); // 期望结果: 7
console.log(combinationSum4([9], 3)); // 期望结果: 0
console.log(combinationSum4([1, 2, 3], 32)); // 期望结果: 181997601
console.log(combinationSum4([4, 2, 1], 32)); // 期望结果: 39882198

export {};
