// ============================================================
// 119. 组合总和
// ============================================================
// 面试金典 08.08 / LeetCode 39. Combination Sum
// 给定无重复元素的正整数数组 candidates 和目标 target，
// 找出所有和为 target 的组合，同一数字可无限次使用。

// 时间复杂度：O(2^target) 最坏（取决于最小候选）
// 空间复杂度：O(target) 递归栈

// 方法1：回溯
// 排序后回溯，从 start 开始选数避免重复组合；剩余为负则剪枝。
// 时间复杂度 O(候选数^(target/min)), 空间复杂度 O(target)
function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const sorted: number[] = [...candidates].sort((a, b) => a - b);

  function backtrack(start: number, remain: number): void {
    if (remain === 0) {
      result.push([...path]);
      return;
    }
    for (let i: number = start; i < sorted.length; i++) {
      if (sorted[i] > remain) break; // 剪枝：已排序，后续更大
      path.push(sorted[i]);
      backtrack(i, remain - sorted[i]); // 同一数字可重复使用，故传 i
      path.pop();
    }
  }

  backtrack(0, target);
  return result;
}

// 方法2：DP
// dp[i] 表示和为 i 的所有组合列表，逐个候选扩展。
// 注意顺序：外层候选、内层金额，避免重复组合。
// 时间复杂度 O(n * target * 平均组合长度), 空间复杂度 O(target * 组合数)
function combinationSum2(candidates: number[], target: number): number[][] {
  const dp: number[][][] = new Array(target + 1).fill(null).map(() => []);
  dp[0] = [[]]; // 和为 0 的唯一组合：空集
  // 外层候选，内层金额 -> 保证组合中候选递增，无重复
  for (const cand of candidates) {
    for (let i: number = cand; i <= target; i++) {
      for (const comb of dp[i - cand]) {
        dp[i].push([...comb, cand]);
      }
    }
  }
  return dp[target];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 119. 组合总和 =====");
console.log(combinationSum([2, 3, 6, 7], 7)); // 期望: [[2,2,3],[7]]
console.log(combinationSum2([2, 3, 6, 7], 7));
console.log(combinationSum([2, 3, 5], 8)); // 期望: [[2,2,2,2],[2,3,3],[3,5]]
console.log(combinationSum2([2, 3, 5], 8));

export {};
