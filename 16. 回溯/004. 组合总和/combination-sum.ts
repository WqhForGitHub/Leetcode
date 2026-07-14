// ============================================================
// 004. 组合总和
// ============================================================
// LeetCode 39. Combination Sum
// 给定无重复元素的候选数组 candidates 和目标数 target，
// 找出所有使数字之和为 target 的唯一组合。数字可无限次使用。
// 时间复杂度：O(n^(target/min))，最坏情况指数级

// 方法1：回溯（可重复选）（推荐）
// 排序后，从 start 开始选数，允许重复选当前数
// 通过保证非递减顺序避免重复组合
// 时间复杂度 O(n^(target/min))，空间复杂度 O(target/min) 递归栈
function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  // 排序便于剪枝
  candidates.sort((a: number, b: number) => a - b);

  const backtrack = (start: number, remain: number, path: number[]): void => {
    // 剩余为 0，找到合法组合
    if (remain === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      // 剪枝：当前数已大于剩余值，后面更大，直接退出
      if (candidates[i] > remain) {
        break;
      }
      path.push(candidates[i]);
      // 允许重复选，所以下一轮仍从 i 开始
      backtrack(i, remain - candidates[i], path);
      path.pop();
    }
  };

  backtrack(0, target, []);
  return result;
}

// 方法2：动态规划
// dp[i] 表示和为 i 的所有组合
// 为去重，按候选数顺序构建，并在组合内维护非递减顺序
// 时间复杂度 O(n * target * 组合数)，空间复杂度 O(target * 组合数)
function combinationSumDP(candidates: number[], target: number): number[][] {
  candidates.sort((a: number, b: number) => a - b);
  // dp[i] 存储和为 i 的所有组合
  const dp: number[][][] = new Array(target + 1).fill(null).map(() => []);
  dp[0] = [[]];
  // 逐个候选数，类似完全背包，避免重复组合
  for (const num of candidates) {
    for (let i = num; i <= target; i++) {
      for (const comb of dp[i - num]) {
        dp[i].push([...comb, num]);
      }
    }
  }
  return dp[target];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 004. 组合总和 =====");
console.log(combinationSum([2, 3, 6, 7], 7)); // 期望结果: [[2,2,3],[7]]
console.log(combinationSum([2, 3, 5], 8)); // 期望结果: [[2,2,2,2],[2,3,3],[3,5]]
console.log(combinationSum([2], 1)); // 期望结果: []
console.log(combinationSumDP([2, 3, 6, 7], 7)); // 期望结果: [[2,2,3],[7]]
console.log(combinationSumDP([2, 3, 5], 8)); // 期望结果: [[2,2,2,2],[2,3,3],[3,5]]

export {};
