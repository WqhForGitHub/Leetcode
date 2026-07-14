// ============================================================
// 070. 等差数列划分
// ============================================================
// LeetCode 413. Arithmetic Slices
// 给定整数数组，返回所有连续等差子数组（长度>=3）的个数。
// 时间复杂度 O(n)，空间复杂度 O(1)

// 方法1：动态规划（推荐）
// dp[i] = 以 nums[i] 结尾的等差数列个数（长度>=3）
// 状态转移：如果 nums[i] - nums[i-1] == nums[i-1] - nums[i-2]
//   则 dp[i] = dp[i-1] + 1
// 含义：新等差数列由两部分组成：
//   1. 以 nums[i-1] 结尾的等差数列加上 nums[i]
//   2. 新的长度为3的等差数列 (nums[i-2], nums[i-1], nums[i])
// 时间复杂度 O(n)，空间复杂度 O(1)（只保留前一个状态）
function numberOfArithmeticSlices(nums: number[]): number {
  const n: number = nums.length;
  if (n < 3) return 0;

  let result: number = 0;
  // dp 表示以当前元素结尾的等差数列个数
  let dp: number = 0;

  for (let i: number = 2; i < n; i++) {
    // 判断 nums[i-2], nums[i-1], nums[i] 是否构成等差数列
    if (nums[i] - nums[i - 1] === nums[i - 1] - nums[i - 2]) {
      // 状态转移：dp[i] = dp[i-1] + 1
      dp = dp + 1;
      result += dp;
    } else {
      // 不构成等差数列，重置
      dp = 0;
    }
  }

  return result;
}

// 方法2：差值分组法
// 先计算相邻元素的差值，然后找连续相同差值的段
// 每段长度为 L 的连续相同差值，贡献 L*(L-1)/2 个等差数列
// 时间复杂度 O(n)，空间复杂度 O(1)
function numberOfArithmeticSlices2(nums: number[]): number {
  const n: number = nums.length;
  if (n < 3) return 0;

  let result: number = 0;
  let count: number = 0; // 连续相同差值的长度

  for (let i: number = 2; i < n; i++) {
    if (nums[i] - nums[i - 1] === nums[i - 1] - nums[i - 2]) {
      count++; // 连续相同差值长度增加
    } else {
      // 一段连续相同差值结束，计算贡献
      result += (count * (count + 1)) / 2;
      count = 0;
    }
  }
  // 最后一段
  result += (count * (count + 1)) / 2;

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 070. 等差数列划分 =====");
console.log(numberOfArithmeticSlices([1, 2, 3, 4])); // 期望结果: 3
console.log(numberOfArithmeticSlices([1])); // 期望结果: 0
console.log(numberOfArithmeticSlices([1, 2, 3, 4, 5])); // 期望结果: 6
console.log(numberOfArithmeticSlices([1, 2, 3, 8, 9, 10])); // 期望结果: 2

export {};
