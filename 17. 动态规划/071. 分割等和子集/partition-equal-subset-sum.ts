// ============================================================
// 071. 分割等和子集
// ============================================================
// LeetCode 416. Partition Equal Subset Sum
// 给定正整数数组，判断能否分成两个子集使它们的和相等。
// 转化为 0-1 背包问题：能否从数组中选取若干元素使其和等于 sum/2。
// 时间复杂度 O(n * sum)

// 方法1：DP - 一维数组优化（推荐）
// dp[j] 表示能否凑成和 j，从后往前更新避免重复使用元素。
// 状态转移：dp[j] = dp[j] || dp[j - nums[i]]
// 时间复杂度 O(n * sum)，空间复杂度 O(sum)
function canPartition(nums: number[]): boolean {
  const n: number = nums.length;
  let sum: number = 0;
  for (let i: number = 0; i < nums.length; i++) {
    sum += nums[i];
  }
  // 和为奇数，无法平分
  if (sum % 2 !== 0) return false;
  const target: number = Math.floor(sum / 2);
  // dp[j] 表示能否凑成和 j
  const dp: boolean[] = new Array(target + 1).fill(false);
  dp[0] = true; // 和为 0 一定可以凑成
  // 遍历每个数字，从后往前更新（0-1背包）
  for (let i: number = 0; i < n; i++) {
    for (let j: number = target; j >= nums[i]; j--) {
      // 对于每个和 j，要么不选 nums[i]（保持 dp[j]），要么选 nums[i]（dp[j - nums[i]]）
      dp[j] = dp[j] || dp[j - nums[i]];
    }
  }
  return dp[target];
}

// 方法2：DP - 二维数组
// dp[i][j] 表示前 i 个数能否凑成和 j。
// 状态转移：dp[i][j] = dp[i-1][j] || (j >= nums[i-1] ? dp[i-1][j-nums[i-1]] : false)
// 时间复杂度 O(n * sum)，空间复杂度 O(n * sum)
function canPartition2(nums: number[]): boolean {
  const n: number = nums.length;
  let sum: number = 0;
  for (let i: number = 0; i < nums.length; i++) {
    sum += nums[i];
  }
  if (sum % 2 !== 0) return false;
  const target: number = Math.floor(sum / 2);
  // dp[i][j] 表示前 i 个数能否凑成和 j
  const dp: boolean[][] = new Array(n + 1);
  for (let i: number = 0; i <= n; i++) {
    dp[i] = new Array(target + 1).fill(false);
    dp[i][0] = true; // 前 i 个数凑成和 0，不选任何数
  }
  // 遍历每个数
  for (let i: number = 1; i <= n; i++) {
    for (let j: number = 1; j <= target; j++) {
      // 不选第 i 个数
      dp[i][j] = dp[i - 1][j];
      // 选第 i 个数（如果 j >= nums[i-1]）
      if (j >= nums[i - 1]) {
        dp[i][j] = dp[i][j] || dp[i - 1][j - nums[i - 1]];
      }
    }
  }
  return dp[n][target];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 071. 分割等和子集 =====");
console.log(canPartition([1, 5, 11, 5])); // 期望结果: true
console.log(canPartition([1, 2, 3, 5])); // 期望结果: false
console.log(canPartition([2, 2, 3, 5])); // 期望结果: false
console.log(canPartition([1, 1])); // 期望结果: true
console.log(canPartition([1, 2, 5])); // 期望结果: false

export {};
