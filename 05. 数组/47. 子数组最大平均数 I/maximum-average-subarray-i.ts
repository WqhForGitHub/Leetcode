// ============================================================
// 47. 子数组最大平均数 I
// ============================================================
// LeetCode 643. Maximum Average Subarray I
// 给定 n 个整数的数组 nums 和整数 k，找出长度为 k 的连续子数组的最大平均数。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：滑动窗口（推荐）
function findMaxAverage(nums: number[], k: number): number {
  // 先计算第一个窗口的元素和
  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += nums[i];
  }
  let maxSum = sum;

  // 滑动窗口：窗口右移，加入新元素，移除旧元素
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    if (sum > maxSum) {
      maxSum = sum;
    }
  }

  // 转换为平均数
  return maxSum / k;
}

// 方法2：前缀和
function findMaxAveragePrefixSum(nums: number[], k: number): number {
  const n = nums.length;
  // prefixSum[i] 表示前 i 个元素的和
  const prefixSum: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefixSum[i + 1] = prefixSum[i] + nums[i];
  }

  let maxSum = -Infinity;
  // 枚举所有长度为 k 的子数组
  for (let i = 0; i + k <= n; i++) {
    const currentSum = prefixSum[i + k] - prefixSum[i];
    if (currentSum > maxSum) {
      maxSum = currentSum;
    }
  }

  return maxSum / k;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 47. 子数组最大平均数 I =====");
console.log("滑动窗口:", findMaxAverage([1, 12, -5, -6, 50, 3], 4)); // 期望结果: 12.75
console.log("滑动窗口:", findMaxAverage([5], 1)); // 期望结果: 5
console.log("滑动窗口:", findMaxAverage([0, 1, 1, 3, 3], 4)); // 期望结果: 2
console.log("前缀和:", findMaxAveragePrefixSum([1, 12, -5, -6, 50, 3], 4)); // 期望结果: 12.75
console.log("前缀和:", findMaxAveragePrefixSum([5], 1)); // 期望结果: 5

export {};
