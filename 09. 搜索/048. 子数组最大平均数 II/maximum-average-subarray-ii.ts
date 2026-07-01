// ============================================================
// 048. 子数组最大平均数 II
// ============================================================
// LeetCode 644. Maximum Average Subarray II
// 给定数组和整数 k，找出长度 >= k 的连续子数组的最大平均值。

// 方法1：二分查找平均值（O(n log(max-min))）
function findMaxAverageII(nums: number[], k: number): number {
  let left = Math.min(...nums);
  let right = Math.max(...nums);
  const eps = 1e-5;
  while (right - left > eps) {
    const mid = (left + right) / 2;
    if (check(nums, k, mid)) {
      left = mid;
    } else {
      right = mid;
    }
  }
  return left;
}

function check(nums: number[], k: number, avg: number): boolean {
  // 判断是否存在长度 >= k 的子数组平均值 >= avg
  // 即 sum(nums[i] - avg) >= 0
  const diff = nums.map((n) => n - avg);
  let sum = 0;
  let prevSum = 0;
  let minPrevSum = 0;
  for (let i = 0; i < diff.length; i++) {
    sum += diff[i];
    if (i >= k - 1) {
      if (sum - minPrevSum >= 0) return true;
      prevSum += diff[i - k + 1];
      minPrevSum = Math.min(minPrevSum, prevSum);
    }
  }
  return false;
}

// 方法2：固定长度滑动窗口暴力（仅当 k 固定时有效，O(n²)）
function findMaxAverageIIBrute(nums: number[], k: number): number {
  let maxAvg = -Infinity;
  for (let len = k; len <= nums.length; len++) {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += nums[i];
    maxAvg = Math.max(maxAvg, sum / len);
    for (let i = len; i < nums.length; i++) {
      sum += nums[i] - nums[i - len];
      maxAvg = Math.max(maxAvg, sum / len);
    }
  }
  return maxAvg;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 048. 子数组最大平均数 II =====");
console.log("二分 [1,12,-5,-6,50,3],4:", findMaxAverageII([1, 12, -5, -6, 50, 3], 4)); // 12.75
console.log("暴力 [1,12,-5,-6,50,3],4:", findMaxAverageIIBrute([1, 12, -5, -6, 50, 3], 4)); // 12.75

export {};
