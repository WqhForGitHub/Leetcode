// ============================================================
// 041. 目标和
// ============================================================
// LeetCode 494. Target Sum
// 给定数组nums和目标值target，给每个元素分配+或-，统计表达式等于target的方案数。
// 时间复杂度：O(2^n)回溯 / O(n*sum)DP, 空间复杂度：O(n)

// 方法1：回溯 (推荐)
// 对每个元素选择+或-，回溯所有可能
// 时间复杂度 O(2^n), 空间复杂度 O(n)
function findTargetSumWays(nums: number[], target: number): number {
  let count: number = 0;

  // index: 当前处理元素下标
  // sum: 当前表达式的值
  function backtrack(index: number, sum: number): void {
    if (index === nums.length) {
      if (sum === target) count++;
      return;
    }

    // 选择+
    backtrack(index + 1, sum + nums[index]);
    // 选择-
    backtrack(index + 1, sum - nums[index]);
  }

  backtrack(0, 0);
  return count;
}

// 方法2：动态规划(转化为子集和)
// 设P为加正号的元素集合，N为加负号的元素集合
// sum(P) - sum(N) = target => sum(P) = (target + sum) / 2
// 转化为：从nums中选取若干数使其和等于posSum的方案数
// 时间复杂度 O(n * sum), 空间复杂度 O(sum)
function findTargetSumWays2(nums: number[], target: number): number {
  const sum: number = nums.reduce((a: number, b: number) => a + b, 0);
  // target + sum 必须为非负偶数
  const diff: number = target + sum;
  if (diff < 0 || diff % 2 !== 0) return 0;
  const posSum: number = diff / 2;
  if (posSum > sum) return 0;

  // dp[j] = 凑成和为j的方案数
  const dp: number[] = new Array(posSum + 1).fill(0);
  dp[0] = 1; // 和为0有1种方案（不选任何数）
  for (const num of nums) {
    for (let j: number = posSum; j >= num; j--) {
      dp[j] += dp[j - num];
    }
  }
  return dp[posSum];
}

// 方法3：记忆化搜索
// 用Map缓存(index, sum)的结果，避免重复计算
// 时间复杂度 O(n * sum), 空间复杂度 O(n * sum)
function findTargetSumWays3(nums: number[], target: number): number {
  const memo: Map<string, number> = new Map();

  function backtrack(index: number, sum: number): number {
    if (index === nums.length) {
      return sum === target ? 1 : 0;
    }
    const key: string = `${index},${sum}`;
    if (memo.has(key)) return memo.get(key)!;

    const result: number =
      backtrack(index + 1, sum + nums[index]) + backtrack(index + 1, sum - nums[index]);
    memo.set(key, result);
    return result;
  }

  return backtrack(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 041. 目标和 =====");
console.log(findTargetSumWays([1, 1, 1, 1, 1], 3)); // 期望结果: 5
console.log(findTargetSumWays([1], 1)); // 期望结果: 1
console.log(findTargetSumWays2([1, 1, 1, 1, 1], 3)); // 期望结果: 5
console.log(findTargetSumWays2([1], 1)); // 期望结果: 1
console.log(findTargetSumWays3([1, 1, 1, 1, 1], 3)); // 期望结果: 5
console.log(findTargetSumWays3([1], 1)); // 期望结果: 1

export {};
