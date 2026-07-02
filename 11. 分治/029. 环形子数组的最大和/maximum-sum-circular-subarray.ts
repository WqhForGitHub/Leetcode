// ============================================================
// 029. 环形子数组的最大和
// ============================================================
// LeetCode 918. Maximum Sum Circular Subarray
// 给定环形数组 nums，求最大子数组和（子数组可跨过末尾回到开头）。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：Kadane 求 maxSub 与 minSub（推荐）
// 思路：环形情况下答案有两种可能：
//   1) 最大子数组不跨环 -> 普通最大子数组和（Kadane）；
//   2) 最大子数组跨环 -> 数组总和 - 最小子数组和（剩下的就是跨环部分）。
//   取两者最大。注意若所有元素都为负，总和 - minSum = 0 会错误，此时直接返回 maxSum。
function maxSubarraySumCircular(nums: number[]): number {
  const total = nums.reduce((a, b) => a + b, 0);
  const maxSum = kadaneMax(nums);
  const minSum = kadaneMin(nums);

  // 若全为负数，total - minSum === 0，但实际最大应是 maxSum（单个最大元素）
  if (maxSum < 0) return maxSum;

  return Math.max(maxSum, total - minSum);
}

// Kadane 求最大子数组和
function kadaneMax(nums: number[]): number {
  let maxSoFar = nums[0];
  let curMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curMax = Math.max(nums[i], curMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, curMax);
  }
  return maxSoFar;
}

// Kadane 求最小子数组和（用于跨环情形）
function kadaneMin(nums: number[]): number {
  let minSoFar = nums[0];
  let curMin = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curMin = Math.min(nums[i], curMin + nums[i]);
    minSoFar = Math.min(minSoFar, curMin);
  }
  return minSoFar;
}

// 方法2：前缀/后缀分解（O(n)）
// 思路：跨环的最大子数组可表示为"末尾一段后缀 + 开头一段前缀"。
//   预计算 prefMax[i]（nums[0..i] 中非空前缀的最大和）与
//   suffMax[i]（nums[i..n-1] 中非空后缀的最大和），
//   枚举断点 i：跨环候选 = prefMax[i] + suffMax[i+1]（两侧均非空）。
//   再与非跨环的 Kadane 最大子数组和比较。
//   注意：前缀/后缀必须非空，否则全负数组会错误地取到空子数组和 0。
function maxSubarraySumCircularPrefix(nums: number[]): number {
  const n = nums.length;
  if (n === 1) return nums[0];

  // prefixSum[k] = nums[0..k-1] 的和
  const prefixSum: number[] = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefixSum[i + 1] = prefixSum[i] + nums[i];
  }

  // prefMax[i] = max(prefixSum[1..i+1])，即 nums[0..i] 中非空前缀的最大和
  const prefMax: number[] = new Array<number>(n).fill(0);
  prefMax[0] = prefixSum[1];
  for (let i = 1; i < n; i++) {
    prefMax[i] = Math.max(prefMax[i - 1], prefixSum[i + 1]);
  }

  // suffixSum[i] = nums[i..n-1] 的和
  const suffixSum: number[] = new Array<number>(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    suffixSum[i] = suffixSum[i + 1] + nums[i];
  }

  // suffMax[i] = max(suffixSum[i..n-1])，即 nums[i..n-1] 中非空后缀的最大和
  const suffMax: number[] = new Array<number>(n + 1).fill(-Infinity);
  suffMax[n] = -Infinity;
  for (let i = n - 1; i >= 0; i--) {
    suffMax[i] = Math.max(suffMax[i + 1], suffixSum[i]);
  }

  // 跨环情形：枚举断点 i，左侧非空前缀最大 + 右侧非空后缀最大
  let circularMax = -Infinity;
  for (let i = 0; i < n - 1; i++) {
    circularMax = Math.max(circularMax, prefMax[i] + suffMax[i + 1]);
  }

  // 与非跨环 Kadane 比较
  return Math.max(circularMax, kadaneMax(nums));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 029. 环形子数组的最大和 =====");
console.log("Kadane [1,-2,3,-2]:", maxSubarraySumCircular([1, -2, 3, -2])); // 期望: 3
console.log("Kadane [5,-3,5]:", maxSubarraySumCircular([5, -3, 5])); // 期望: 10
console.log("Kadane [-3,-2,-3]:", maxSubarraySumCircular([-3, -2, -3])); // 期望: -2
console.log("前缀 [1,-2,3,-2]:", maxSubarraySumCircularPrefix([1, -2, 3, -2])); // 期望: 3
console.log("前缀 [5,-3,5]:", maxSubarraySumCircularPrefix([5, -3, 5])); // 期望: 10
console.log("前缀 [-3,-2,-3]:", maxSubarraySumCircularPrefix([-3, -2, -3])); // 期望: -2

export {};
