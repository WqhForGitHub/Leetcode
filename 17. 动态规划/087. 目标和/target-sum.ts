// ============================================================
// 087. 目标和
// ============================================================
// LeetCode 494. Target Sum
// 给定非负整数数组和目标 S，给每个数加 + 或 -，使结果等于 S 的方案数。
// 时间复杂度：O(n * sum)

// 方法1：动态规划（0-1背包）（推荐）
// 设 P 为正数和，N 为负数和，则 P - N = S, P + N = sum(nums)
// 推导得 P = (sum + S) / 2，问题转化为从 nums 中选若干数使其和为 P 的方案数
// 状态转移：dp[j] += dp[j - num]（逆序遍历保证每个数只用一次）
// 时间复杂度 O(n * sum)，空间复杂度 O(sum)
function findTargetSumWays(nums: number[], target: number): number {
  const sum: number = nums.reduce((a: number, b: number) => a + b, 0);

  // 目标绝对值超过总和，无解
  if (Math.abs(target) > sum) return 0;
  // (sum + target) 必须是非负偶数，否则 P 不是整数
  if ((sum + target) % 2 !== 0 || sum + target < 0) return 0;

  const P: number = (sum + target) / 2; // 正数部分需要凑出的目标和

  // dp[j] = 凑成和为 j 的方案数
  const dp: number[] = new Array(P + 1).fill(0);
  dp[0] = 1; // 凑成和为 0 有 1 种方案（不选任何数）

  // 0-1背包：每个数只能用一次，逆序遍历 j 防止重复使用
  for (const num of nums) {
    for (let j: number = P; j >= num; j--) {
      // 状态转移：选 num 则方案数增加 dp[j - num]
      dp[j] += dp[j - num];
    }
  }

  return dp[P];
}

// 方法2：递归 + 记忆化
// dfs(index, currentSum) = 从第 index 个数开始，当前和为 currentSum，到达目标和的方案数
// 对每个数选择加正号或负号，递归求解
// 时间复杂度 O(n * sum)，空间复杂度 O(n * sum)
function findTargetSumWaysMemo(nums: number[], target: number): number {
  const memo: Map<string, number> = new Map();

  function dfs(index: number, currentSum: number): number {
    // 所有数都已处理完毕，检查是否等于目标
    if (index === nums.length) {
      return currentSum === target ? 1 : 0;
    }

    const stateKey: string = index + "," + currentSum;
    if (memo.has(stateKey)) return memo.get(stateKey)!;

    // 当前数取正号
    const add: number = dfs(index + 1, currentSum + nums[index]);
    // 当前数取负号
    const subtract: number = dfs(index + 1, currentSum - nums[index]);

    memo.set(stateKey, add + subtract);
    return add + subtract;
  }

  return dfs(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 087. 目标和 =====");
console.log(findTargetSumWays([1, 1, 1, 1, 1], 3)); // 期望结果: 5
console.log(findTargetSumWays([1], 1)); // 期望结果: 1
console.log(findTargetSumWays([0, 0, 0, 0, 0, 0, 0, 0, 1], 1)); // 期望结果: 256
console.log(findTargetSumWaysMemo([1, 1, 1, 1, 1], 3)); // 期望结果: 5
console.log(findTargetSumWays([1, 2, 1], 0)); // 期望结果: 2

export {};
