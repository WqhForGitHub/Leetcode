// ============================================================
// 087. 小于 K 的两数之和
// ============================================================
// LeetCode 1099. Two Sum Less Than K
// 数组中两数之和小于 K 的最大值，不存在返回 -1。

// 方法1：排序 + 双指针
function twoSumLessThanK(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  let left = 0;
  let right = nums.length - 1;
  let maxSum = -1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum < k) {
      maxSum = Math.max(maxSum, sum);
      left++;
    } else {
      right--;
    }
  }
  return maxSum;
}

// 方法2：排序 + 二分查找
function twoSumLessThanKBinary(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  let maxSum = -1;
  for (let i = 0; i < nums.length - 1; i++) {
    // 二分找最大的 nums[j] 使得 nums[i] + nums[j] < k
    let lo = i + 1;
    let hi = nums.length - 1;
    let best = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[i] + nums[mid] < k) {
        best = nums[mid];
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (best !== -1) {
      maxSum = Math.max(maxSum, nums[i] + best);
    }
  }
  return maxSum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 087. 小于 K 的两数之和 =====");
console.log(
  "双指针 [34,23,1,24,75,33,54,8],60:",
  twoSumLessThanK([34, 23, 1, 24, 75, 33, 54, 8], 60),
); // 58
console.log("双指针 [10,20,30],15:", twoSumLessThanK([10, 20, 30], 15)); // -1
console.log(
  "二分 [34,23,1,24,75,33,54,8],60:",
  twoSumLessThanKBinary([34, 23, 1, 24, 75, 33, 54, 8], 60),
); // 58

export {};
