// ============================================================
// 154. 第 K 小的子数组和
// ============================================================
// LeetCode 1918. Kth Smallest Subarray Sum
// 数组中所有非空连续子数组的和升序排列后第 k 小。

// 方法1：二分查找
function kthSmallestSubarraySum(nums: number[], k: number): number {
  let left = Math.min(...nums);
  let right = nums.reduce((a, b) => a + b, 0);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (countSubarraySum(nums, mid) < k) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

function countSubarraySum(nums: number[], target: number): number {
  let count = 0;
  let sum = 0;
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > target) {
      sum -= nums[left++];
    }
    count += right - left + 1;
  }
  return count;
}

// 方法2：暴力枚举（O(n²)）
function kthSmallestSubarraySumBrute(nums: number[], k: number): number {
  const sums: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      sums.push(sum);
    }
  }
  sums.sort((a, b) => a - b);
  return sums[k - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 154. 第 K 小的子数组和 =====");
console.log("二分 [2,1,3],4:", kthSmallestSubarraySum([2, 1, 3], 4)); // 3
console.log("二分 [3,1,2,4],5:", kthSmallestSubarraySum([3, 1, 2, 4], 5)); // 4
console.log("暴力 [2,1,3],4:", kthSmallestSubarraySumBrute([2, 1, 3], 4)); // 3

export {};
